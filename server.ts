import express, { Request, Response } from "express"
import cors from "cors"
import multer from "multer"
import { Ollama } from "ollama"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

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

// Endpoint to process resume and generate summary
app.post(
  "/api/summarize-resume",
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

      // Prepare prompt for Ollama
      const prompt: string = `Please provide a concise professional summary of the following resume. Focus on key skills, experience, and qualifications:

${resumeContent}

Summary:`

      // Call Ollama with configured model
      const response = await ollama.chat({
        model: OLLAMA_MODEL,
        messages: [{ role: "user", content: prompt }],
      })

      const summary: string = response.message.content

      // Send response with summary content only
      res.json({
        summary: summary,
      })
    } catch (error: unknown) {
      console.error("Error processing resume:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      res.status(500).json({
        error: "Failed to process resume",
        details: errorMessage,
      })
    }
  }
)

// Health check endpoint
app.get("/api/health", (req: Request, res: Response<HealthResponse>) => {
  res.json({ status: "Backend server is running" })
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
