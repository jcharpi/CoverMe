/**
 * Output component for displaying generated cover letters
 * Shows the cover letter with edit capability, download option, and auth warnings
 */
"use client"

import { useState } from "react"
import { styles } from "./styles"
import AuthWarning from "./components/AuthWarning"
import { parseOutputData } from "./utils/outputParser"
import { downloadTextAsFile } from "./utils/fileDownload"

interface OutputProps {
  initialOutput: string
  onCreateAnother: () => void
}

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
          <p className={styles.subtitle}>Your personalized cover letter is ready</p>
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
            <button
              className={styles.buttonPrimary}
              onClick={handleDownload}
            >
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
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
