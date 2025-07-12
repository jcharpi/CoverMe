"use client"

import { useState } from "react"
import { styles } from "./styles"

interface OutputProps {
  initialOutput: string
  onCreateAnother: () => void
}

export default function Output({
  initialOutput,
  onCreateAnother,
}: OutputProps) {
  const [aiOutput, setAiOutput] = useState(initialOutput)

  const downloadTextAreaContent = () => {
    const blob = new Blob([aiOutput], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const downloadLink = document.createElement("a")
    downloadLink.href = url
    downloadLink.download = "cover-letter.txt"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.container} style={{ backgroundColor: "#4ACA7A" }}>
      <div className={styles.header}>
        <h1 className={styles.title}>CoverMe</h1>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.writingSection}>
          <h2 className={styles.sectionHeading}>Your Cover Letter</h2>
          <div className={styles.writingContainer}>
            <textarea
              value={aiOutput}
              onChange={(e) => setAiOutput(e.target.value)}
              className={styles.textareaLarge}
              readOnly={false}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              onClick={downloadTextAreaContent}
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
