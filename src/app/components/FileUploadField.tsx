/**
 * File Upload Field Component
 *
 * A modern drag-and-drop file upload component for resume files. Features visual feedback,
 * validation states, and accessibility support. Accepts only .txt files up to 10MB.
 *
 * @component
 * @example
 * ```tsx
 * <FileUploadField
 *   resumeFile={resumeFile}
 *   onFileUpload={handleFileUpload}
 * />
 * ```
 *
 * @fileoverview Resume file upload component with validation
 * @version 1.0.0
 * @author CoverMe Team
 */

import { styles } from "../styles"
import { SVG_PATHS, APP_CONSTANTS } from "../styles/constants"
import type { FileUploadFieldProps } from "../types/interfaces"

export default function FileUploadField({
  resumeFile,
  onFileUpload,
}: FileUploadFieldProps) {
  return (
    <div className={styles.card}>
      <div className="flex items-start space-x-4">
        <div
          className={`${styles.statusIndicator} ${
            resumeFile
              ? styles.statusIndicatorComplete
              : styles.statusIndicatorIncomplete
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
                d={SVG_PATHS.CHECKMARK}
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <div className="flex-1">
          <label className={styles.label}>1. Upload your resume</label>
          <div
            className={`${styles.fileUpload} ${
              resumeFile ? styles.fileUploadActive : ""
            }`}
          >
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
                  d={SVG_PATHS.UPLOAD}
                />
              </svg>
              <div>
                <div
                  className={
                    resumeFile
                      ? styles.fileUploadTextActive
                      : styles.fileUploadText
                  }
                >
                  {resumeFile
                    ? resumeFile.name
                    : "Choose a file or drag and drop"}
                </div>
                <div
                  className={
                    resumeFile
                      ? styles.fileUploadSubtextActive
                      : styles.fileUploadSubtext
                  }
                >
                  {APP_CONSTANTS.ACCEPTED_FILE_TYPES.join(", ")} files only, up
                  to {APP_CONSTANTS.MAX_FILE_SIZE_MB}MB
                </div>
              </div>
            </div>
            <input
              type="file"
              accept={APP_CONSTANTS.ACCEPTED_FILE_TYPES.join(",")}
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
