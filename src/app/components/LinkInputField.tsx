/**
 * Link Input Field Component
 *
 * A validated input field for job posting URLs with real-time feedback. Accepts valid URLs
 * or the keyword "general" for creating versatile cover letters. Features visual validation
 * states and accessibility support.
 *
 * @component
 * @example
 * ```tsx
 * <LinkInputField
 *   linkUrl={linkUrl}
 *   onLinkChange={handleLinkChange}
 *   isValid={isValidInput(linkUrl)}
 * />
 * ```
 *
 * @fileoverview Job link input component with validation
 * @version 1.0.0
 * @author CoverMe Team
 */

import { styles } from "../styles"
import { SVG_PATHS } from "../styles/constants"
import type { LinkInputFieldProps } from "../types/interfaces"

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
								d={SVG_PATHS.CHECKMARK}
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
							<path fillRule="evenodd" d={SVG_PATHS.CLOSE} clipRule="evenodd" />
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
							className={`${styles.input} ${
								showValidation ? styles.inputError : ""
							}`}
						/>
						{showValidation && (
							<div
								className={styles.helperText}
								style={{ color: "var(--error)" }}
							>
								Please enter a valid URL or type &quot;general&quot;
							</div>
						)}
						{hasInput && isValid && (
							<div className={styles.helperText}>✓ Job link is valid</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
