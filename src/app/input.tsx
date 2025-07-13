"use client"

import { useState } from "react"
import { styles } from "./styles"
import Output from "./output"
import ModelSelector from "./components/ModelSelector"
import FileUploadField from "./components/FileUploadField"
import LinkInputField from "./components/LinkInputField"
import WritingSampleSection from "./components/WritingSampleSection"
import { useModels } from "./hooks/useModels"
import { isValidInput } from "./utils/validation"
import {
  checkBackendHealth,
  generateCoverLetter,
  createFormData,
} from "./services/api"

export default function Input() {
  // State management
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [writingSample, setWritingSample] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiOutput, setAiOutput] = useState("")

  // Custom hooks
  const { availableModels, selectedModel, setSelectedModel } = useModels()

  // Event handlers
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

  // Computed values
  const bothFieldsCompleted =
    resumeFile && linkUrl.trim() && isValidInput(linkUrl)

  const handleCreate = async () => {
    if (!resumeFile) return

    setIsProcessing(true)
    try {
      await checkBackendHealth()
      const formData = createFormData(
        resumeFile,
        writingSample,
        selectedModel,
        linkUrl
      )
      const result = await generateCoverLetter(formData)
      setAiOutput(JSON.stringify(result))
    } catch (error) {
      handleError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Navigation functions
  const resetToHome = () => {
    setAiOutput("")
    setResumeFile(null)
    setLinkUrl("")
    setWritingSample("")
  }

  // Conditional rendering
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
