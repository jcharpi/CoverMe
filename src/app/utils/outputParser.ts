/**
 * Output data parsing utilities
 * Handles parsing of server response data with fallback for backward compatibility
 */
export interface OutputData {
  summary: string
  hasAuthIssue: boolean
}

export const parseOutputData = (initialOutput: string): OutputData => {
  try {
    return JSON.parse(initialOutput)
  } catch {
    return { summary: initialOutput, hasAuthIssue: false }
  }
}
