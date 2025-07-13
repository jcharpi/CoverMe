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
