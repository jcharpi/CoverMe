import express, { Request, Response } from "express"
import cors from "cors"
import multer from "multer"
import { Ollama } from "ollama"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execAsync = promisify(exec)

const stanfordGuideContent = fs.readFileSync(
  path.join(__dirname, "src", "data", "stanford_guide.txt"),
  "utf8"
)

// Type definitions
interface ResumeRequest extends Request {
  file?: Express.Multer.File
}

interface SummaryResponse {
  summary: string
}

interface ErrorResponse {
  error: string
  details?: string
}

interface HealthResponse {
  status: string
}

// Configuration constants
const PORT: number = 3001
const OLLAMA_HOST: string = "http://localhost:11434"
const OLLAMA_MODEL: string = "phi4-mini"
const OLLAMA_STARTUP_DELAY: number = 3000

const app: express.Application = express()

// Initialize Ollama client
const ollama: Ollama = new Ollama({ host: OLLAMA_HOST })

// Configure multer for file uploads (memory storage only)
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
      const selectedModel: string = req.body.model || OLLAMA_MODEL

      // Prepare prompt for Ollama to generate cover letter
      const writingSampleSection = writingSample
        ? `

Writing Sample for Style Reference:
${writingSample}

STYLE INSTRUCTION: Analyze the writing sample above and mimic the applicant's writing style, tone, and voice in the cover letter. Match their level of formality, sentence structure, and personal expression while maintaining professionalism.`
        : ""

      const prompt: string = `
You are a professional cover letter writer. Follow these STRICT requirements:
${writingSampleSection}

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

      // Call Ollama with selected model
      const response = await ollama.chat({
        model: selectedModel,
        messages: [{ role: "user", content: prompt }],
      })

      const summary: string = response.message.content

      // Remove thinking tags from the response
      const cleanedSummary = summary
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .trim()

      // Send response with cover letter content
      res.json({
        summary: cleanedSummary,
      })
    } catch (error: unknown) {
      console.error("Error generating cover letter:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      res.status(500).json({
        error: "Failed to generate cover letter",
        details: errorMessage,
      })
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
    console.error("Error fetching models:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({
      error: "Failed to fetch models",
      details: errorMessage,
    })
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

  // Check if configured model is available
  try {
    const models = await ollama.list()
    const hasModel = models.models.some((model) =>
      model.name.includes(OLLAMA_MODEL)
    )
    if (!hasModel) {
      console.log(`Downloading ${OLLAMA_MODEL} model...`)
      await ollama.pull({ model: OLLAMA_MODEL })
      console.log(`${OLLAMA_MODEL} model ready`)
    }
  } catch {
    console.log(
      `Warning: Could not verify ${OLLAMA_MODEL} model. You may need to run "ollama pull ${OLLAMA_MODEL}"`
    )
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

startServer()
