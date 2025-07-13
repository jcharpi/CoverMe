"use client"

import { useState, useEffect } from "react"
import { styles, svgPaths } from "./styles"
import Output from "./output"

const API_BASE_URL = "http://localhost:3001"

export default function Input() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [writingSample, setWritingSample] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiOutput, setAiOutput] = useState("")
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")

  useEffect(() => {
    fetchAvailableModels()
  }, [])

  const fetchAvailableModels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models`)
      if (response.ok) {
        const data = await response.json()
        setAvailableModels(data.models)
        if (data.models.length > 0) {
          setSelectedModel(data.models[0])
        }
      }
    } catch (error) {
      console.error("Failed to fetch models:", error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(event.target.value)
  }

  const handleWritingChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setWritingSample(event.target.value)
  }

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value)
  }

  const createFormData = (): FormData => {
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

  const checkBackendHealth = async (): Promise<void> => {
    const healthCheck = await fetch(`${API_BASE_URL}/api/health`)
    if (!healthCheck.ok) {
      throw new Error("Backend server is not responding")
    }
  }

  const generateCoverLetter = async (formData: FormData): Promise<string> => {
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
    return data.summary || "AI output will appear here"
  }

  const handleError = (error: unknown): void => {
    console.error("Error details:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes("fetch")) {
      alert(
        "Cannot connect to backend server. Make sure it's running on port 3001."
      )
    } else {
      alert(`Error: ${errorMessage}`)
    }
  }

  const isValidLink = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isValidInput = (input: string): boolean => {
    const trimmed = input.trim()
    return isValidLink(trimmed) || trimmed.toLowerCase() === "general"
  }

  const bothFieldsCompleted =
    resumeFile && linkUrl.trim() && isValidInput(linkUrl)

  const handleCreate = async () => {
    if (!resumeFile) return

    setIsProcessing(true)
    try {
      await checkBackendHealth()
      const formData = createFormData()
      const summary = await generateCoverLetter(formData)
      setAiOutput(summary)
    } catch (error) {
      handleError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetToHome = () => {
    setAiOutput("")
    setResumeFile(null)
    setLinkUrl("")
    setWritingSample("")
  }

  if (aiOutput) {
    return <Output initialOutput={aiOutput} onCreateAnother={resetToHome} />
  }

  return (
    <div className={styles.container} style={{ backgroundColor: "#4ACA7A" }}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>CoverMe</h1>
        <ModelSelector
          availableModels={availableModels}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <FileUploadField
          resumeFile={resumeFile}
          onFileUpload={handleFileUpload}
        />

        <LinkInputField
          linkUrl={linkUrl}
          onLinkChange={handleLinkChange}
          isValid={isValidInput(linkUrl)}
        />

        {bothFieldsCompleted && (
          <WritingSampleSection
            writingSample={writingSample}
            onWritingChange={handleWritingChange}
            onCreateClick={handleCreate}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  )
}

interface ModelSelectorProps {
  availableModels: string[]
  selectedModel: string
  onModelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

function ModelSelector({
  availableModels,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  if (availableModels.length === 0) return null

  return (
    <div style={{ position: "absolute", top: "20px", right: "20px" }}>
      <select
        value={selectedModel}
        onChange={onModelChange}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: "2px solid white",
          backgroundColor: "white",
          color: "black",
          fontSize: "14px",
          fontWeight: "500",
          outline: "none",
          cursor: "pointer",
        }}
      >
        {availableModels.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  )
}

interface FileUploadFieldProps {
  resumeFile: File | null
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function FileUploadField({ resumeFile, onFileUpload }: FileUploadFieldProps) {
  return (
    <div className={styles.fieldContainer}>
      <div
        className={styles.circle}
        style={{
          borderColor: "white",
          backgroundColor: resumeFile ? "white" : "transparent",
        }}
      >
        {resumeFile && (
          <svg
            className={styles.checkIcon}
            style={{ color: "#10b981" }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d={svgPaths.checkmark}
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <label className={styles.fileUpload}>
        <span
          className={`${styles.fileUploadText} ${
            resumeFile ? "text-white" : "text-white text-opacity-50"
          }`}
        >
          {resumeFile ? resumeFile.name : "Upload resume"}
        </span>
        <svg
          className={styles.uploadIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={svgPaths.upload}
          />
        </svg>
        <input
          type="file"
          accept=".txt"
          onChange={onFileUpload}
          className={styles.fileInput}
        />
      </label>
    </div>
  )
}

interface LinkInputFieldProps {
  linkUrl: string
  onLinkChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isValid: boolean
}

function LinkInputField({
  linkUrl,
  onLinkChange,
  isValid,
}: LinkInputFieldProps) {
  const hasInput = linkUrl.trim().length > 0
  const showValidation = hasInput && !isValid

  return (
    <div className={styles.fieldContainer}>
      <div
        className={styles.circle}
        style={{
          borderColor: showValidation ? "#ef4444" : "white",
          backgroundColor: hasInput && isValid ? "white" : "transparent",
        }}
      >
        {hasInput && isValid && (
          <svg
            className={styles.checkIcon}
            style={{ color: "#10b981" }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d={svgPaths.checkmark}
              clipRule="evenodd"
            />
          </svg>
        )}
        {showValidation && (
          <svg
            className={styles.checkIcon}
            style={{ color: "#ef4444" }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <input
          type="text"
          placeholder="Job Link"
          value={linkUrl}
          onChange={onLinkChange}
          className={styles.urlInput}
          style={{
            width: linkUrl
              ? `${Math.min(linkUrl.length * 8 + 100, 400)}px`
              : "175px",
            borderColor: showValidation ? "#ef4444" : undefined,
          }}
        />
        {showValidation && (
          <span
            style={{
              color: "#ef4444",
              fontSize: "12px",
              marginLeft: "8px",
              fontWeight: "500",
            }}
          >
            Enter a valid URL or &quot;general&quot;
          </span>
        )}
      </div>
    </div>
  )
}

interface WritingSampleSectionProps {
  writingSample: string
  onWritingChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onCreateClick: () => void
  isProcessing: boolean
}

function WritingSampleSection({
  writingSample,
  onWritingChange,
  onCreateClick,
  isProcessing,
}: WritingSampleSectionProps) {
  return (
    <div className={styles.writingSection}>
      <h2 className={styles.sectionHeading}>Write away!</h2>
      <div className={styles.writingContainer}>
        <textarea
          value={writingSample}
          onChange={onWritingChange}
          placeholder="Write as much as you'd like or paste a sample of your writing. The more you write, the more likely your cover letter will match your unique voice and style."
          className={styles.textarea}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={onCreateClick}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Create"}
        </button>
      </div>
    </div>
  )
}
