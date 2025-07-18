/**
 * Authentication Warning Component
 *
 * A warning banner that displays when job posting scraping fails due to authentication
 * requirements (e.g., LinkedIn login walls). Provides helpful guidance for users to
 * find alternative job posting sources.
 *
 * @component
 * @example
 * ```tsx
 * {outputData.hasAuthIssue && <AuthWarning />}
 * ```
 *
 * @fileoverview Authentication issue warning banner component
 * @version 1.0.0
 * @author CoverMe Team
 */

import { SVG_PATHS } from "../styles/constants"
import { styles } from "../styles"

export default function AuthWarning() {
	return (
		<div className={styles.authWarning}>
			<div className={styles.authWarningContent}>
				<svg
					className={styles.authWarningIcon}
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path fillRule="evenodd" d={SVG_PATHS.WARNING} clipRule="evenodd" />
				</svg>
				<div className={styles.authWarningTextContainer}>
					<h3 className={styles.authWarningTitle}>Job Details Access Issue</h3>
					<p className={styles.authWarningText}>
						The specific job details could not be accessed due to authorization
						requirements. If using a job board link (like LinkedIn), please try
						using the direct job application link from the company&apos;s
						careers page instead for better results.
					</p>
				</div>
			</div>
		</div>
	)
}
