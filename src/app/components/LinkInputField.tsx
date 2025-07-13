import { styles, svgPaths } from "../styles"

interface LinkInputFieldProps {
  linkUrl: string
  onLinkChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isValid: boolean
}

export default function LinkInputField({
  linkUrl,
  onLinkChange,
  isValid,
}: LinkInputFieldProps) {
  const hasInput = linkUrl.trim().length > 0
  const showValidation = hasInput && !isValid

  return (
    <div className={styles.fieldContainer}>
      <div
        className={styles.circle}
        style={{
          borderColor: showValidation ? "#ef4444" : "white",
          backgroundColor: hasInput && isValid ? "white" : "transparent",
        }}
      >
        {hasInput && isValid && (
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
        {showValidation && (
          <svg
            className={styles.checkIcon}
            style={{ color: "#ef4444" }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="text"
          placeholder='Job Link or "general"'
          value={linkUrl}
          onChange={onLinkChange}
          className={styles.urlInput}
          style={{
            width: linkUrl
              ? `${Math.max(linkUrl.length * 8 + 200, 225)}px`
              : "225px",
            borderColor: showValidation ? "#ef4444" : undefined,
          }}
        />
        {showValidation && (
          <span
            style={{
              color: "#ef4444",
              fontSize: "12px",
              fontWeight: "500",
              whiteSpace: "nowrap",
            }}
          >
            Enter a valid URL or &quot;general&quot;
          </span>
        )}
      </div>
    </div>
  )
}
