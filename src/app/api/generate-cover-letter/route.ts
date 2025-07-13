/**
 * API route for generating cover letters using OpenRouter
 */
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const model = formData.get("model") as string
    const jobLink = formData.get("jobLink") as string
    // const writingSample = formData.get('writingSample') as string
    // const resumeFile = formData.get('resume') as File

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      )
    }

    // Basic validation
    if (!model || !jobLink) {
      return NextResponse.json(
        { error: "Model and job link are required" },
        { status: 400 }
      )
    }
    console.log("API Key present:", !!process.env.OPENROUTER_API_KEY)
    console.log("Model being used:", model)

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "user",
              content: `Generate a professional cover letter for this job: ${jobLink}`,
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
    const coverLetter =
      data.choices?.[0]?.message?.content || "No content generated"

    return NextResponse.json({
      summary: coverLetter,
      hasAuthIssue: false,
    })
  } catch (error) {
    console.error("Cover letter generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    )
  }
}