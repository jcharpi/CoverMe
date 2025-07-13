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
    <div className={styles.container} style={{ backgroundColor: "#4ACA7A" }}>
      <div className={styles.header}>
        <h1 className={styles.title}>CoverMe</h1>
      </div>
      <div className={styles.mainContent}>
        {outputData.hasAuthIssue && <AuthWarning />}
        <div className={styles.writingSection}>
          <h2 className={styles.sectionHeading}>Your Cover Letter</h2>
          <div className={styles.writingContainer}>
            <textarea
              value={aiOutput}
              onChange={(e) => setAiOutput(e.target.value)}
              className={styles.textareaLarge}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              onClick={handleDownload}
              style={{ marginRight: "1rem" }}
            >
              Download
            </button>
            <button className={styles.button} onClick={onCreateAnother}>
              Create Another
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
