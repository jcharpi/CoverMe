/**
 * Component Style Definitions
 *
 * Centralized Tailwind CSS class definitions for all CoverMe components.
 * Organized by component type and functionality for easy maintenance and consistency.
 * Uses CSS custom properties for theming and responsive design patterns.
 *
 * @fileoverview Tailwind CSS class definitions for component styling
 * @version 1.0.0
 * @author CoverMe Team
 */

import { ANIMATIONS } from "./styles/constants"

/**
 * Tailwind CSS class combinations for consistent component styling
 */
export const styles = {
  // =============================================================================
  // LAYOUT & STRUCTURE
  // =============================================================================

  /** Main application container with full height and overflow control */
  container: "min-h-screen bg-[var(--background)] font-sans",

  /** Application header with responsive padding and flex layout */
  header: "flex items-center justify-between p-4 sm:p-6",

  /** Main content area with max width, centering, and spacing */
  mainContent: "flex flex-col max-w-4xl mx-auto px-6 sm:px-8 space-y-6 pb-8",

  /** Form field container with consistent vertical spacing */
  fieldContainer: "space-y-6",

  /** Input group with tight spacing for label-input pairs */
  inputGroup: "space-y-2",

  // =============================================================================
  // TYPOGRAPHY
  // =============================================================================

  /** Primary application title with responsive sizing */
  title:
    "text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight",

  /** Subtitle text with secondary color */
  subtitle: "text-lg text-[var(--text-secondary)] mt-2",

  /** Section headings with consistent spacing */
  sectionHeading: "text-xl font-semibold text-[var(--text-primary)] mb-4",

  /** Form field labels */
  label: "text-md font-medium text-[var(--text-primary)] mb-2 block",

  /** Helper and validation text */
  helperText: "text-sm text-[var(--text-secondary)] mt-1",

  // =============================================================================
  // CARDS & SURFACES
  // =============================================================================

  /** Primary card component with shadow and border */
  card: "bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]",

  /** Compact card variant for smaller content */
  cardCompact:
    "bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-sm)]",

  // =============================================================================
  // WARNING COMPONENTS
  // =============================================================================

  /** Authentication warning container with appropriate spacing and styling */
  authWarning:
    "bg-[var(--warning-light)] border border-[var(--warning)] rounded-[var(--radius-md)] p-4 mb-6",

  /** Warning content layout with icon and text */
  authWarningContent: "flex items-start space-x-3",

  /** Warning icon styling */
  authWarningIcon: "w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5",

  /** Warning text container */
  authWarningTextContainer: "flex-1",

  /** Warning title styling */
  authWarningTitle: "font-medium text-[var(--warning)] mb-1",

  /** Warning message text styling */
  authWarningText: "text-sm font-semibold text-black leading-relaxed",

  // =============================================================================
  // STATUS INDICATORS
  // =============================================================================

  /** Base status indicator circle */
  statusIndicator: `w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-${ANIMATIONS.TRANSITION_DURATION}`,

  /** Completed status indicator with success styling */
  statusIndicatorComplete:
    "bg-[var(--success)] border-[var(--success)] text-white",

  /** Incomplete status indicator with neutral styling */
  statusIndicatorIncomplete:
    "border-[var(--border)] text-[var(--text-tertiary)]",

  /** Checkmark icon sizing */
  checkIcon: "w-4 h-4",

  // =============================================================================
  // FILE UPLOAD COMPONENTS
  // =============================================================================

  /** Drag-and-drop file upload area with hover effects */
  fileUpload: `group relative border-2 border-dashed border-[var(--border)] rounded-[var(--radius-lg)] p-8 text-center cursor-pointer transition-all duration-${ANIMATIONS.TRANSITION_DURATION} hover:border-[var(--primary)] hover:bg-[var(--primary-light)]`,

  /** Active state for file upload when file is selected */
  fileUploadActive: "border-[var(--primary)] bg-[var(--primary-light)]",

  /** Content layout within file upload area */
  fileUploadContent: "flex flex-col items-center space-y-3",

  /** File upload text with hover color change */
  fileUploadText:
    "font-medium text-[var(--text-primary)] group-hover:text-black transition-colors",

  /** Active file upload text when file is selected */
  fileUploadTextActive: "font-medium text-black transition-colors",

  /** File upload subtext with hover color change */
  fileUploadSubtext:
    "text-sm text-[var(--text-secondary)] group-hover:text-gray-700 transition-colors",

  /** Active file upload subtext when file is selected */
  fileUploadSubtextActive: "text-sm text-gray-700 transition-colors",

  /** Upload icon with hover color transition */
  uploadIcon:
    "w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors",

  /** Hidden file input overlay */
  fileInput: "absolute inset-0 w-full h-full opacity-0 cursor-pointer",

  // =============================================================================
  // FORM INPUTS
  // =============================================================================

  /** Standard text input with focus states */
  input: `w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--border-focus)] transition-all duration-${ANIMATIONS.TRANSITION_DURATION}`,

  /** Error state for input fields */
  inputError: "border-[var(--error)] focus:ring-[var(--error)]",

  /** Select dropdown styling */
  select: `w-full sm:w-auto min-w-[200px] px-2 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--border-focus)] transition-all duration-${ANIMATIONS.TRANSITION_DURATION}`,

  // =============================================================================
  // TEXTAREA COMPONENTS
  // =============================================================================

  /** Compact textarea for writing samples */
  textarea: `w-full h-[25vh] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--border-focus)] transition-all duration-${ANIMATIONS.TRANSITION_DURATION} custom-scrollbar`,

  /** Large textarea for cover letter editing */
  textareaLarge: `w-full h-[70vh] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--border-focus)] transition-all duration-${ANIMATIONS.TRANSITION_DURATION} custom-scrollbar`,

  // =============================================================================
  // WRITING SECTION
  // =============================================================================

  /** Writing section layout container */
  writingSection: "space-y-4",

  /** Writing textarea container */
  writingContainer: "w-full",

  // =============================================================================
  // BUTTONS
  // =============================================================================

  /** Button container with responsive layout */
  buttonContainer: "flex flex-col sm:flex-row gap-3 justify-center mt-6",

  /** Primary action button with full styling */
  buttonPrimary: `inline-flex items-center justify-center px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all duration-${ANIMATIONS.TRANSITION_DURATION} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`,

  /** Secondary button with outline styling */
  buttonSecondary: `inline-flex items-center justify-center px-6 py-3 bg-[var(--surface)] text-[var(--text-primary)] font-medium border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--surface-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all duration-${ANIMATIONS.TRANSITION_DURATION} cursor-pointer`,

  /** Text-only button styling */
  buttonText: `text-[var(--primary)] font-medium hover:text-[var(--primary-hover)] transition-colors duration-${ANIMATIONS.TRANSITION_DURATION} cursor-pointer`,

  // =============================================================================
  // LOADING & PROGRESS
  // =============================================================================

  /** Spinning loader animation */
  spinner:
    "animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full",

  /** Progress indicator container */
  progressContainer: "space-y-2",

  /** Progress bar background */
  progressBar: "w-full bg-[var(--surface-secondary)] rounded-full h-2",

  /** Progress bar fill with animation */
  progressFill: `bg-[var(--primary)] h-2 rounded-full transition-all duration-${ANIMATIONS.SLOW_TRANSITION}`,

  /** Progress text styling */
  progressText: "text-sm text-[var(--text-secondary)] text-center",
} as const

/**
 * @deprecated Use SVG_PATHS from constants.ts instead
 * Legacy SVG paths - will be removed in next version
 */
export const svgPaths = {
  checkmark:
    "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
  upload:
    "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
} as const
