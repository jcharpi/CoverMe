/**
 * Output Component
 *
 * Displays AI-generated cover letters with editing and download capabilities.
 * Features a clean, focused interface for reviewing and customizing cover letters
 * before final download.
 *
 * Key Features:
 * - Large, editable textarea for cover letter content
 * - Real-time editing with state preservation
 * - One-click download as TXT file
 * - Authentication warnings for job posting access issues
 * - "Create Another" workflow to return to input form
 * - Responsive design for various screen sizes
 *
 * Props:
 * - initialOutput: AI-generated cover letter content with header and signature
 * - onCreateAnother: Callback to reset form and create a new cover letter
 *
 * @component
 * @example
 * ```tsx
 * <Output
 *   initialOutput={aiGeneratedText}
 *   onCreateAnother={() => resetForm()}
 * />
 * ```
 *
 * @fileoverview Cover letter display and editing component
 * @version 1.0.0
 * @author CoverMe Team
 */
"use client"

import { useState } from "react"
import { styles } from "./styles"
import { SVG_PATHS } from "./styles/constants"
import type { OutputProps } from "./types/interfaces"
import AuthWarning from "./components/AuthWarning"
import { parseOutputData } from "./utils/outputParser"
import { downloadTextAsFile } from "./utils/fileDownload"

export default function Output({
  initialOutput,
  onCreateAnother,
}: OutputProps) {
  // Parse output data with fallback for backwards compatibility
  const outputData = parseOutputData(initialOutput)
  const [aiOutput, setAiOutput] = useState(outputData.summary)

  // File download handler
  const handleDownload = () => {
    downloadTextAsFile(aiOutput)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>CoverMe</h1>
          <p className={styles.subtitle}>
            Your personalized cover letter is ready
          </p>
        </div>
      </header>

      <main className={styles.mainContent}>
        {outputData.hasAuthIssue && <AuthWarning />}

        <div className={styles.card}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Your Cover Letter</label>
            <textarea
              value={aiOutput}
              onChange={(e) => setAiOutput(e.target.value)}
              className={styles.textareaLarge}
            />
            <div className={styles.helperText}>
              You can edit your cover letter above before downloading
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.buttonPrimary} onClick={handleDownload}>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={SVG_PATHS.DOWNLOAD}
                />
              </svg>
              Download as TXT
            </button>
            <button
              className={styles.buttonSecondary}
              onClick={onCreateAnother}
            >
              Create Another
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
