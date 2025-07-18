/**
 * Server Error Message Component
 *
 * A comprehensive error message that displays when server communication fails
 * or when no AI models are available. Provides helpful troubleshooting information
 * and guidance for resolving common server connectivity issues.
 *
 * @component
 * @example
 * ```tsx
 * {hasServerError && <ServerError />}
 * ```
 *
 * @fileoverview Server error and troubleshooting guide component
 * @version 1.0.0
 * @author CoverMe Team
 */

import { styles } from "../styles"
import { SVG_PATHS } from "../styles/constants"

export default function ServerError() {
	return (
		<div className={styles.card}>
			<div className="text-center py-8">
				<div className="mb-6">
					<svg
						className="w-16 h-16 mx-auto text-[var(--error)]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d={SVG_PATHS.EXCLAMATION_TRIANGLE}
						/>
					</svg>
				</div>

				<h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
					Server Error
				</h2>

				<div className="space-y-4 text-left max-w-md mx-auto">
					<p className="text-[var(--text-secondary)]">
						Unable to connect to the AI service. Please check the following:
					</p>

					<div className="bg-[var(--surface-secondary)] rounded-[var(--radius-md)] p-4">
						<h3 className="font-medium text-[var(--text-primary)] mb-2">
							1. Check API Configuration
						</h3>
						<p className="text-sm text-[var(--text-secondary)]">
							Ensure your OpenRouter API key is properly configured in the
							environment settings.
						</p>
					</div>

					<div className="bg-[var(--surface-secondary)] rounded-[var(--radius-md)] p-4">
						<h3 className="font-medium text-[var(--text-primary)] mb-2">
							2. Network Connection
						</h3>
						<p className="text-sm text-[var(--text-secondary)]">
							Verify your internet connection and that the service is not
							blocked by a firewall.
						</p>
					</div>

					<div className="bg-[var(--surface-secondary)] rounded-[var(--radius-md)] p-4">
						<h3 className="font-medium text-[var(--text-primary)] mb-2">
							3. Service Status
						</h3>
						<p className="text-sm text-[var(--text-secondary)]">
							The AI service may be temporarily unavailable. Please try again in
							a few moments.
						</p>
					</div>
				</div>

				<button
					onClick={() => window.location.reload()}
					className={`${styles.buttonPrimary} mt-6`}
				>
					Retry Connection
				</button>
			</div>
		</div>
	)
}
