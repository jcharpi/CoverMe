import express, { Request, Response } from "express"
import cors from "cors"
import multer from "multer"
import { Ollama } from "ollama"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { chromium } from "playwright"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const execAsync = promisify(exec)

const stanfordGuideContent = fs.readFileSync(
  path.join(__dirname, "src", "data", "stanford_guide.txt"),
  "utf8"
)

// Configuration constants
const PORT: number = 3001
const OLLAMA_HOST: string = "http://localhost:11434"
const OLLAMA_STARTUP_DELAY: number = 3000

// Type definitions
interface ResumeRequest extends Request {
  file?: Express.Multer.File
}

interface SummaryResponse {
  summary: string
  hasAuthIssue?: boolean
}

interface ErrorResponse {
  error: string
  details?: string
}

interface HealthResponse {
  status: string
}

// Initialize Express app
const app: express.Application = express()
const ollama: Ollama = new Ollama({ host: OLLAMA_HOST })

// Configure multer for file uploads
const upload: multer.Multer = multer({
  storage: multer.memoryStorage(),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype === "text/plain") {
      cb(null, true)
    } else {
      cb(new Error("Only .txt files are allowed"))
    }
  },
})

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
      res.json({
        summary: cleanedSummary,
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

// Check if Ollama is running and start if needed
const ensureOllama = async (): Promise<void> => {
  try {
    // Try to ping Ollama
    await ollama.list()
    console.log("Ollama is already running")
  } catch {
    console.log("Starting Ollama...")
    try {
      // Start Ollama service
      await execAsync("ollama serve")
      // Wait a moment for service to start
      await new Promise((resolve) => setTimeout(resolve, OLLAMA_STARTUP_DELAY))
      console.log("Ollama started successfully")
    } catch {
      console.log(
        'Could not auto-start Ollama. Please run "ollama serve" manually'
      )
    }
  }
}

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

// Utility functions
async function scrapeJobPosting(url: string): Promise<string> {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  })

  const page = await context.newPage()

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })

    const isAuthPage = await page.evaluate(() => {
      const authIndicators = [
        "sign in",
        "sign up",
        "log in",
        "login",
        "register",
      ]
      const pageText = document.body.innerText.toLowerCase()
      return (
        authIndicators.some((indicator) => pageText.includes(indicator)) &&
        pageText.length < 1000
      )
    })

    if (isAuthPage && url.includes("linkedin.com")) {
      return "LinkedIn requires authentication. Please use a company careers page or 'general'."
    }

    await page.waitForTimeout(2000)

    const textContent = await page.evaluate(() => {
      const elementsToRemove = document.querySelectorAll(
        "script, style, nav, header, footer, .nav, .header, .footer, .advertisement, .ads"
      )
      elementsToRemove.forEach((el) => el.remove())

      const contentSelectors = [
        ".job-description",
        ".job-content",
        ".posting-content",
        ".job-details",
        "main",
        ".main-content",
        "article",
      ]

      for (const selector of contentSelectors) {
        const element = document.querySelector(selector)
        if (
          element &&
          element.textContent &&
          element.textContent.trim().length > 100
        ) {
          return element.textContent.trim()
        }
      }

      return document.body.innerText.trim()
    })

    return textContent
  } finally {
    await browser.close()
  }
}

async function parseJobPosting(
  rawJobContent: string,
  model: string
): Promise<string> {
  try {
    const parsePrompt = `
You are a job posting parser. Extract and organize the key information from this job posting into a clean, structured format.

Focus on extracting:
1. Job Title and Company
2. Key Responsibilities/Duties
3. Required Skills and Qualifications
4. Preferred Skills and Experience
5. Company Information/Culture
6. Benefits and Compensation (if mentioned)
7. Location and Work Arrangement

Remove any:
- Repetitive text
- Legal disclaimers
- Application instructions
- Navigation text
- Irrelevant website content

Format the output as a clean, organized summary that highlights the most important information for writing a cover letter.

Raw Job Posting Content:
${rawJobContent}

Provide a clean, well-structured summary:
`

    const response = await ollama.chat({
      model: model,
      messages: [{ role: "user", content: parsePrompt }],
    })

    return removeThinkingTags(response.message.content)
  } catch (error) {
    console.error("Failed to parse job posting with AI:", error)
    return rawJobContent // Return raw content as fallback
  }
}

function createCoverLetterPrompt(
  resumeContent: string,
  writingSample: string,
  stanfordGuideContent: string,
  jobContent: string = "",
  isGeneral: boolean = false
): string {
  const writingSampleSection = writingSample
    ? `

Writing Sample for Style Reference:
${writingSample}

STYLE INSTRUCTION: Analyze the writing sample above and mimic the applicant's writing style, tone, and voice in the cover letter. Match their level of formality, sentence structure, and personal expression while maintaining professionalism.`
    : ""

  const jobSection = isGeneral
    ? `

JOB TYPE: General cover letter - Do not reference specific company names, positions, or job requirements. Write a versatile cover letter that highlights the applicant's overall qualifications and can be adapted for various opportunities.`
    : jobContent
    ? `

Job Posting Content:
${jobContent}

JOB INSTRUCTION: Analyze the job posting above and tailor the cover letter specifically to this position. Reference specific requirements, company information, and role details mentioned in the posting.`
    : ""

  return `
You are a professional cover letter writer. Follow these STRICT requirements:
${writingSampleSection}
${jobSection}

1. STRUCTURE: Write EXACTLY 3 paragraphs (no more, no less)
2. LENGTH: 300-400 words total
3. FORMAT: Include proper business letter header
4. PARAGRAPH BREAKDOWN:
   - Paragraph 1: Opening (state intent, position, brief introduction)
   - Paragraph 2: Qualifications (majority of content - highlight relevant skills/experience)
   - Paragraph 3: Closing (follow-up plan, thank you)

Stanford Cover Letter Guide:
${stanfordGuideContent}

Applicant's Resume:
${resumeContent}

CRITICAL: Your response must contain EXACTLY 3 paragraphs in the body. Do not write more than 3 paragraphs. Each paragraph should be separated by a blank line.`
}

function removeThinkingTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()
}

function handleError(res: Response, error: unknown, message: string): void {
  console.error(message, error)
  const errorMessage = error instanceof Error ? error.message : "Unknown error"
  res.status(500).json({
    error: message,
    details: errorMessage,
  })
}

startServer()
