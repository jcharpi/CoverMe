/**
 * Ollama Setup Message Component
 *
 * A comprehensive setup guide that displays when no Ollama models are detected.
 * Provides step-by-step instructions for installing Ollama, downloading models,
 * and getting started with the application. Features links to official resources
 * and recommended model suggestions.
 *
 * @component
 * @example
 * ```tsx
 * {availableModels.length === 0 && <OllamaSetupMessage />}
 * ```
 *
 * @fileoverview Ollama installation and setup guide component
 * @version 1.0.0
 * @author CoverMe Team
 */

import { styles } from "../styles"
import { SVG_PATHS, APP_CONSTANTS } from "../styles/constants"

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
              d={SVG_PATHS.MONITOR}
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
              ollama pull {APP_CONSTANTS.RECOMMENDED_MODELS[0]}
            </code>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              You can also try:{" "}
              {APP_CONSTANTS.RECOMMENDED_MODELS.slice(1).join(", ")}
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
