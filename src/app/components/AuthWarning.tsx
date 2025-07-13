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
export default function AuthWarning() {
  return (
    <div className="bg-[var(--warning-light)] border border-[var(--warning)] rounded-[var(--radius-md)] p-4 mb-6">
      <div className="flex items-start space-x-3">
        <svg
          className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d={SVG_PATHS.WARNING} clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h3 className="font-medium text-[var(--warning)] mb-1">
            Job Details Access Issue
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The specific job details could not be accessed due to authorization
            requirements. If using a job board link (like LinkedIn), please try
            using the direct job application link from the company&apos;s careers
            page instead for better results.
          </p>
        </div>
      </div>
    </div>
  )
}
