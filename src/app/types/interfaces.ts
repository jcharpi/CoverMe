/**
 * TypeScript Interface Definitions
 *
 * Centralized type definitions for the CoverMe application components and data structures.
 * These interfaces ensure type safety and provide clear contracts for component props,
 * API responses, and internal data structures.
 *
 * @fileoverview Type definitions for CoverMe application
 * @version 1.0.0
 * @author CoverMe Team
 */

/**
 * Props for file upload field component
 */
export interface FileUploadFieldProps {
  /** Currently selected resume file */
  resumeFile: File | null
  /** Handler for file upload events */
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Props for link input field component
 */
export interface LinkInputFieldProps {
  /** Current job link URL value */
  linkUrl: string
  /** Handler for link input changes */
  onLinkChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether the current input is valid */
  isValid: boolean
}

/**
 * Props for writing sample section component
 */
export interface WritingSampleSectionProps {
  /** Current writing sample text */
  writingSample: string
  /** Handler for writing sample text changes */
  onWritingChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  /** Handler for create button click */
  onCreateClick: () => void
  /** Whether the cover letter is currently being processed */
  isProcessing: boolean
}

/**
 * Props for model selector component
 */
export interface ModelSelectorProps {
  /** List of available AI models */
  availableModels: string[]
  /** Currently selected model */
  selectedModel: string
  /** Handler for model selection changes */
  onModelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

/**
 * Props for output component
 */
export interface OutputProps {
  /** Initial AI-generated output */
  initialOutput: string
  /** Handler for creating another cover letter */
  onCreateAnother: () => void
}

/**
 * Return type for useModels hook
 */
export interface UseModelsReturn {
  /** List of available AI models */
  availableModels: string[]
  /** Currently selected model */
  selectedModel: string
  /** Function to update selected model */
  setSelectedModel: (model: string) => void
}

/**
 * Parsed output data structure
 */
export interface ParsedOutputData {
  /** The main cover letter content */
  summary: string
  /** Whether there was an authentication issue during job scraping */
  hasAuthIssue: boolean
}

/**
 * API response for health check
 */
export interface HealthResponse {
  /** Status message from backend */
  status: string
}

/**
 * API response for models endpoint
 */
export interface ModelsResponse {
  /** Array of available model names */
  models: string[]
}

/**
 * API response for cover letter generation
 */
export interface CoverLetterResponse {
  /** Generated cover letter content */
  summary: string
  /** Whether there was an authentication issue */
  hasAuthIssue: boolean
}

/**
 * API error response structure
 */
export interface ErrorResponse {
  /** Error message */
  error: string
}
