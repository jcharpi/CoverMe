/**
 * Writing Sample Section Component
 *
 * An optional input section for users to provide writing samples that help the AI match
 * their personal writing style. Features a large textarea, processing states, and an
 * action button to generate the cover letter.
 *
 * @component
 * @example
 * ```tsx
 * <WritingSampleSection
 *   writingSample={writingSample}
 *   onWritingChange={handleWritingChange}
 *   onCreateClick={handleCreate}
 *   isProcessing={isProcessing}
 * />
 * ```
 *
 * @fileoverview Writing sample input and cover letter generation component
 * @version 1.0.0
 * @author CoverMe Team
 */

import { styles } from "../styles"
import type { WritingSampleSectionProps } from "../types/interfaces"

export default function WritingSampleSection({
  writingSample,
  onWritingChange,
  onCreateClick,
  isProcessing,
}: WritingSampleSectionProps) {
  return (
    <div className={styles.card}>
      <div className="flex items-start space-x-4">
        <div className={styles.statusIndicatorIncomplete}></div>

        <div className="flex-1">
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              3. Add writing sample (optional)
            </label>
            <textarea
              value={writingSample}
              onChange={onWritingChange}
              placeholder="Write as much as you'd like or paste a sample of your writing. The more you write, the more likely your cover letter will match your unique voice and style."
              className={styles.textarea}
            />
            <div className={styles.helperText}>
              Help the AI match your writing style by providing examples of your
              work
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
