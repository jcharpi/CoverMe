/**
 * Input field for job links with validation
 * Accepts URLs or "general" with real-time validation feedback
 */
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
    <div className={styles.card}>
      <div className="flex items-start space-x-4">
        <div
          className={`${styles.statusIndicator} ${
            hasInput && isValid 
              ? styles.statusIndicatorComplete 
              : styles.statusIndicatorIncomplete
          }`}
        >
          {hasInput && isValid && (
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
          {showValidation && (
            <svg
              className={styles.checkIcon}
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ color: "var(--error)" }}
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        
        <div className="flex-1">
          <div className={styles.inputGroup}>
            <label className={styles.label}>2. Add job link</label>
            <input
              type="text"
              placeholder='Paste job URL or type "general" for a general cover letter'
              value={linkUrl}
              onChange={onLinkChange}
              className={`${styles.input} ${showValidation ? styles.inputError : ''}`}
            />
            {showValidation && (
              <div className={styles.helperText} style={{ color: "var(--error)" }}>
                Please enter a valid URL or type "general"
              </div>
            )}
            {hasInput && isValid && (
              <div className={styles.helperText}>
                ✓ Job link is valid
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
