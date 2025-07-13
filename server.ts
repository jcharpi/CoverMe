/**
 * Main Express server for CoverMe application
 * Handles cover letter generation, file uploads, and API endpoints
 */
import express, { Request, Response } from "express"
import cors from "cors"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Internal imports
import { PORT } from "./src/server/config/constants"
import {
  ResumeRequest,
  SummaryResponse,
  ErrorResponse,
  HealthResponse,
} from "./src/server/types/interfaces"
import { upload } from "./src/server/middleware/upload"
import { scrapeJobPosting } from "./src/server/services/scraperService"
import {
  parseJobPosting,
  createCoverLetterPrompt,
  removeThinkingTags,
  ollama,
} from "./src/server/services/aiService"
import { ensureOllama } from "./src/server/services/ollamaService"
import { handleError } from "./src/server/utils/errorHandler"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const stanfordGuideContent = fs.readFileSync(
  path.join(__dirname, "src", "data", "stanford_guide.txt"),
  "utf8"
)

// Initialize Express app
const app: express.Application = express()

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
)
app.use(express.json())

// Endpoint to process resume and generate cover letter
app.post(
  "/api/generate-cover-letter",
  upload.single("resume"),
  async (
    req: ResumeRequest,
    res: Response<SummaryResponse | ErrorResponse>
  ) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No resume file uploaded" })
      }

      // Read the uploaded resume file from memory buffer
      const resumeContent: string = req.file.buffer.toString("utf8")
      const writingSample: string = req.body.writingSample || ""
      const selectedModel: string = req.body.model
      const jobLink: string = req.body.jobLink || ""

      let jobContent = ""
      let hasAuthIssue = false
      if (jobLink.trim().toLowerCase() !== "general") {
        try {
          const rawJobContent = await scrapeJobPosting(jobLink)
          if (
            rawJobContent &&
            rawJobContent.includes("requires authentication")
          ) {
            hasAuthIssue = true
            jobContent = rawJobContent
          } else if (rawJobContent && rawJobContent.length > 100) {
            jobContent = await parseJobPosting(rawJobContent, selectedModel)
          }
        } catch (error) {
          console.error("Failed to scrape job posting:", error)
        }
      }

      const prompt: string = createCoverLetterPrompt(
        resumeContent,
        writingSample,
        stanfordGuideContent,
        jobContent,
        jobLink.trim().toLowerCase() === "general"
      )

      // Call Ollama with selected model
      const response = await ollama.chat({
        model: selectedModel,
        messages: [{ role: "user", content: prompt }],
      })

      const summary: string = response.message.content

      const cleanedSummary = removeThinkingTags(summary)

      // Hardcoded header
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

      // Combine header + body + signature
      const finalCoverLetter =
        header + cleanedSummary + "\n\nSincerely,\n[Your Name]"

      res.json({
        summary: finalCoverLetter,
        hasAuthIssue: hasAuthIssue,
      })
    } catch (error: unknown) {
      handleError(res, error, "Failed to generate cover letter")
    }
  }
)

// Health check endpoint
app.get("/api/health", (req: Request, res: Response<HealthResponse>) => {
  res.json({ status: "Backend server is running" })
})

// Endpoint to get available Ollama models
app.get("/api/models", async (req: Request, res: Response) => {
  try {
    const models = await ollama.list()
    const modelNames = models.models.map((model) => model.name)
    res.json({ models: modelNames })
  } catch (error: unknown) {
    handleError(res, error, "Failed to fetch models")
  }
})

// Start server
const startServer = async (): Promise<void> => {
  try {
    await ensureOllama()
    console.log("Ollama check complete")

    app.listen(PORT, () => {
      console.log(`✅ Backend server running on http://localhost:${PORT}`)
      console.log("🤖 Ollama integration ready")
      console.log("🔗 CORS enabled for http://localhost:3000")
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
