/**
 * Writing sample input section with cover letter generation
 * Provides textarea for writing sample input and trigger for cover letter generation
 */
import { styles } from "../styles"

interface WritingSampleSectionProps {
  writingSample: string
  onWritingChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onCreateClick: () => void
  isProcessing: boolean
}

export default function WritingSampleSection({
  writingSample,
  onWritingChange,
  onCreateClick,
  isProcessing,
}: WritingSampleSectionProps) {
  return (
    <div className={styles.card}>
      <div className="flex items-start space-x-4">
        <div className={styles.statusIndicatorIncomplete}>
        </div>
        
        <div className="flex-1">
          <div className={styles.inputGroup}>
            <label className={styles.label}>3. Add writing sample (optional)</label>
            <textarea
              value={writingSample}
              onChange={onWritingChange}
              placeholder="Write as much as you'd like or paste a sample of your writing. The more you write, the more likely your cover letter will match your unique voice and style."
              className={styles.textarea}
            />
            <div className={styles.helperText}>
              Help the AI match your writing style by providing examples of your work
            </div>
          </div>
          
          <div className={styles.buttonContainer}>
            <button
              className={styles.buttonPrimary}
              onClick={onCreateClick}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className={styles.spinner} />
                  <span className="ml-2">Generating cover letter...</span>
                </>
              ) : (
                "Generate Cover Letter"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
