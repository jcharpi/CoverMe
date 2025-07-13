/**
 * File upload component for resume files
 * Handles .txt file upload with visual feedback and validation
 */
import { styles, svgPaths } from "../styles"

interface FileUploadFieldProps {
  resumeFile: File | null
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileUploadField({
  resumeFile,
  onFileUpload,
}: FileUploadFieldProps) {
  return (
    <div className={styles.card}>
      <div className="flex items-start space-x-4">
        <div
          className={`${styles.statusIndicator} ${
            resumeFile ? styles.statusIndicatorComplete : styles.statusIndicatorIncomplete
          }`}
        >
          {resumeFile && (
            <svg
              className={styles.checkIcon}
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
        
        <div className="flex-1">
          <label className={styles.label}>1. Upload your resume</label>
          <div className={`${styles.fileUpload} ${resumeFile ? styles.fileUploadActive : ''}`}>
            <div className={styles.fileUploadContent}>
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
              <div>
                <div className={resumeFile ? styles.fileUploadTextActive : styles.fileUploadText}>
                  {resumeFile ? resumeFile.name : "Choose a file or drag and drop"}
                </div>
                <div className={resumeFile ? styles.fileUploadSubtextActive : styles.fileUploadSubtext}>
                  TXT files only, up to 10MB
                </div>
              </div>
            </div>
            <input
              type="file"
              accept=".txt"
              onChange={onFileUpload}
              className={styles.fileInput}
            />
          </div>
          {resumeFile && (
            <div className={styles.helperText}>
              ✓ Resume uploaded successfully
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
