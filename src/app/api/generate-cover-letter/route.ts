/**
 * API route for generating cover letters using OpenRouter
 */
import { NextRequest, NextResponse } from "next/server"
import { createCoverLetterPrompt } from "../../lib/aiService"
import { scrapeJobContent, checkUrlForAuthIssues } from "../../utils/jobScraper"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const model = formData.get("model") as string
    const jobLink = formData.get("jobLink") as string
    const writingSample = (formData.get("writingSample") as string) || ""
    const resumeFile = formData.get("resume") as File

    // Read Stanford guide content
    const stanfordGuidePath = path.join(
      process.cwd(),
      "src",
      "data",
      "stanford_guide.txt"
    )
    const stanfordGuideContent = fs.readFileSync(stanfordGuidePath, "utf-8")

    // Process resume file if provided
    let resumeContent = ""
    if (resumeFile && resumeFile.size > 0) {
      const resumeText = await resumeFile.text()
      resumeContent = resumeText
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      )
    }

    // Basic validation
    if (!model) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 })
    }

    if (!resumeContent) {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      )
    }

    // Scrape job content and check for authentication issues
    let jobContent = ""
    let hasAuthIssue = false

    if (
      jobLink &&
      jobLink.trim() &&
      jobLink.trim().toLowerCase() !== "general"
    ) {
      try {
        const scrapingResult = await scrapeJobContent(jobLink)
        jobContent = scrapingResult.content
        hasAuthIssue = scrapingResult.hasAuthIssue

        if (scrapingResult.error) {
          console.log("Job scraping error:", scrapingResult.error)
        }
      } catch (error) {
        console.error("Failed to scrape job content:", error)
        // If scraping fails entirely, check URL patterns as fallback
        hasAuthIssue = checkUrlForAuthIssues(jobLink)
      }
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: createCoverLetterPrompt(
                resumeContent,
                writingSample,
                stanfordGuideContent,
                jobContent || jobLink || "",
                !jobLink || jobLink.trim().toLowerCase() === "general"
              ),
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiOutput =
      data.choices?.[0]?.message?.content || "No content generated"

    // Hardcoded header (same as server.ts)
    const header = `Applicant Info:
Address
City, ST Zip Code
Date

Recipient Info:
Name
Job Title
Company/Organization Name
Address
City, ST Zip Code

`

    // Combine header + AI output + signature
    const finalCoverLetter = header + aiOutput + "\n\nSincerely,\n[Your Name]"

    return NextResponse.json({
      summary: finalCoverLetter,
      hasAuthIssue,
    })
  } catch (error) {
    console.error("Cover letter generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    )
  }
}
