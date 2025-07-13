/**
 * Component to display setup instructions when no Ollama models are available
 */
import { styles } from "../styles"

export default function OllamaSetupMessage() {
  return (
    <div className={styles.card}>
      <div className="text-center py-8">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-[var(--text-tertiary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
          Setup Required
        </h2>

        <div className="space-y-4 text-left max-w-md mx-auto">
          <p className="text-[var(--text-secondary)]">
            To use CoverMe, you need to install Ollama and download an AI model:
          </p>

          <div className="bg-[var(--surface-secondary)] rounded-[var(--radius-md)] p-4">
            <h3 className="font-medium text-[var(--text-primary)] mb-2">
              1. Install Ollama
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              Visit{" "}
              <a
                href="https://ollama.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline"
              >
                ollama.com
              </a>{" "}
              and download the installer for your operating system.
            </p>
          </div>

          <div className="bg-[var(--surface-secondary)] rounded-[var(--radius-md)] p-4">
            <h3 className="font-medium text-[var(--text-primary)] mb-2">
              2. Download a Model
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              After installing Ollama, run this command in your terminal:
            </p>
            <code className="block bg-[var(--background)] px-3 py-2 rounded text-sm font-mono text-[var(--text-primary)] border">
              ollama pull gemma3:1b
            </code>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              You can also try: deepseek-r1, phi4-mini, or llama3.2
            </p>
          </div>

          <div className="bg-[var(--surface-secondary)] rounded-[var(--radius-md)] p-4">
            <h3 className="font-medium text-[var(--text-primary)] mb-2">
              3. Start Ollama
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Ollama should start automatically. If not, run:
            </p>
            <code className="block bg-[var(--background)] px-3 py-2 rounded text-sm font-mono text-[var(--text-primary)] border mt-1">
              ollama serve
            </code>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className={`${styles.buttonPrimary} mt-6`}
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}
