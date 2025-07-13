/**
 * Design System Constants
 *
 * Centralized design tokens inspired by Apple, Google, Figma, and Claude design systems.
 * These constants provide consistent spacing, typography, colors, and other design elements
 * throughout the CoverMe application.
 *
 * @fileoverview Design system constants for consistent UI theming
 * @version 1.0.0
 * @author CoverMe Team
 */

/**
 * SVG path constants for reusable icons
 */
export const SVG_PATHS = {
  /** Checkmark icon for completed states */
  CHECKMARK:
    "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",

  /** Upload cloud icon for file upload areas */
  UPLOAD:
    "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",

  /** Close/X icon for error states */
  CLOSE:
    "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",

  /** Download icon for file download actions */
  DOWNLOAD:
    "M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z",

  /** Computer monitor icon for setup instructions */
  MONITOR:
    "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",

  /** Warning triangle icon for alerts */
  WARNING:
    "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",

  /** Exclamation triangle icon for errors */
  EXCLAMATION_TRIANGLE:
    "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
} as const

/**
 * Application-specific constants
 */
export const APP_CONSTANTS = {
  /** Maximum file size for resume uploads (in MB) */
  MAX_FILE_SIZE_MB: 10,

  /** Accepted file types for resume upload */
  ACCEPTED_FILE_TYPES: [".txt"],

  /** Available OpenRouter models */
  OPENROUTER_MODELS: [
    "deepseek/deepseek-chat-v3-0324:free",
    "deepseek/deepseek-r1:free",
    "qwen/qwen3-235b-a22b:free",
  ],

  /** API endpoints */
  API_ENDPOINTS: {
    HEALTH: "/api/health",
    MODELS: "/api/models",
    GENERATE: "/api/generate-cover-letter",
  },
} as const

/**
 * Animation timing constants
 */
export const ANIMATIONS = {
  /** Standard transition duration */
  TRANSITION_DURATION: "200ms",

  /** Slower transition for complex animations */
  SLOW_TRANSITION: "300ms",

  /** Quick hover feedback */
  FAST_TRANSITION: "150ms",
} as const
