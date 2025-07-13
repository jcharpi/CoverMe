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
    <div className={styles.writingSection}>
      <h2 className={styles.sectionHeading}>Write away!</h2>
      <div className={styles.writingContainer}>
        <textarea
          value={writingSample}
          onChange={onWritingChange}
          placeholder="Write as much as you'd like or paste a sample of your writing. The more you write, the more likely your cover letter will match your unique voice and style."
          className={styles.textarea}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={onCreateClick}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Create"}
        </button>
      </div>
    </div>
  )
}
