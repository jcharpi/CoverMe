/**
 * API service for backend communication
 * Handles all HTTP requests to the Express server including health checks and cover letter generation
 */
const API_BASE_URL = "http://localhost:3001"

export interface CoverLetterResult {
  summary: string
  hasAuthIssue: boolean
}

export const checkBackendHealth = async (): Promise<void> => {
  const healthCheck = await fetch(`${API_BASE_URL}/api/health`)
  if (!healthCheck.ok) {
    throw new Error("Backend server is not responding")
  }
}

export const generateCoverLetter = async (
  formData: FormData
): Promise<CoverLetterResult> => {
  const response = await fetch(`${API_BASE_URL}/api/generate-cover-letter`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }))
    throw new Error(`Server error: ${errorData.error || response.statusText}`)
  }

  const data = await response.json()
  return {
    summary: data.summary || "AI output will appear here",
    hasAuthIssue: data.hasAuthIssue || false,
  }
}

export const createFormData = (
  resumeFile: File | null,
  writingSample: string,
  selectedModel: string,
  linkUrl: string
): FormData => {
  const formData = new FormData()
  if (resumeFile) {
    formData.append("resume", resumeFile)
  }
  if (writingSample.trim()) {
    formData.append("writingSample", writingSample.trim())
  }
  if (selectedModel) {
    formData.append("model", selectedModel)
  }
  if (linkUrl.trim()) {
    formData.append("jobLink", linkUrl.trim())
  }
  return formData
}
