import { exec } from "child_process"
import { promisify } from "util"
import { ollama } from "./aiService"
import { OLLAMA_STARTUP_DELAY } from "../config/constants"

const execAsync = promisify(exec)

export async function ensureOllama(): Promise<void> {
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
