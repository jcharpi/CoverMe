"use client"

import { useState } from "react"
import { styles, svgPaths } from "./styles"

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [writingSample, setWritingSample] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [summary, setSummary] = useState("")

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

  const bothFieldsCompleted = resumeFile && linkUrl.trim()

  const handleCreate = async () => {
    if (!resumeFile) return

    setIsProcessing(true)
    const formData = new FormData()
    formData.append('resume', resumeFile)

    try {
      // First test if backend is running
      console.log('Testing backend connection...')
      const healthCheck = await fetch('http://localhost:3001/api/health')
      if (!healthCheck.ok) {
        throw new Error('Backend server is not responding')
      }
      console.log('Backend connection successful')

      console.log('Sending resume for processing...')
      const response = await fetch('http://localhost:3001/api/summarize-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`Server error: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      console.log('Resume processed successfully:', data)
      setSummary(data.summary)
      
      // Trigger download
      const downloadLink = document.createElement('a')
      downloadLink.href = `http://localhost:3001${data.downloadUrl}`
      downloadLink.download = data.filename
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      
    } catch (error) {
      console.error('Error details:', error)
      if (error.message.includes('fetch')) {
        alert('Cannot connect to backend server. Make sure it\'s running on port 3001.')
      } else {
        alert(`Error: ${error.message}`)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={styles.container} style={{ backgroundColor: "#4ACA7A" }}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>CoverMe</h1>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Resume Upload Field */}
        <div className={styles.fieldContainer}>
          <div
            className={styles.circle}
            style={{
              borderColor: "white",
              backgroundColor: resumeFile ? "white" : "transparent",
            }}
          >
            {resumeFile ? (
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
            ) : null}
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
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
          </label>
        </div>

        {/* Link Paste Field */}
        <div className={styles.fieldContainer}>
          <div
            className={styles.circle}
            style={{
              borderColor: "white",
              backgroundColor: linkUrl.trim() ? "white" : "transparent",
            }}
          >
            {linkUrl.trim() ? (
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
            ) : null}
          </div>
          <input
            type="url"
            placeholder="Paste Job Link"
            value={linkUrl}
            onChange={handleLinkChange}
            className={styles.urlInput}
            style={{
              width: linkUrl
                ? `${Math.min(
                    linkUrl.length * 8 + 100,
                    window.innerWidth * 0.5
                  )}px`
                : "175px",
            }}
          />
        </div>

        {/* Writing Sample Section - Only show when both fields are completed */}
        {bothFieldsCompleted && (
          <div className={styles.writingSection}>
            <h2 className={styles.sectionHeading}>Write away!</h2>
            <div className={styles.writingContainer}>
              <textarea
                value={writingSample}
                onChange={handleWritingChange}
                placeholder="Write as much as you'd like or paste a sample of your writing. The more you write, the more likely your cover letter will match your unique voice and style."
                className={styles.textarea}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button 
                className={styles.button}
                onClick={handleCreate}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Create'}
              </button>
            </div>
            {summary && (
              <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Resume Summary:</h3>
                <p className="text-white text-sm">{summary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
