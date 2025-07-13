/**
 * Warning banner component for authentication issues
 * Displays when job posting scraping fails due to login requirements
 */
export default function AuthWarning() {
  return (
    <div
      style={{
        backgroundColor: "#fef3c7",
        border: "1px solid #f59e0b",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
        color: "#92400e",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <svg
          style={{ width: "20px", height: "20px", fill: "#f59e0b" }}
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <strong>Job Details Access Issue</strong>
      </div>
      <p style={{ margin: 0, lineHeight: "1.5" }}>
        The specific job details could not be accessed due to authorization
        requirements. If using a job board link (like LinkedIn), please try
        using the direct job application link from the company&apos;s careers
        page instead for better results.
      </p>
    </div>
  )
}
