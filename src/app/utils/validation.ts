/**
 * Validation utilities for input fields
 * Provides URL validation and combined input validation (URL or "general")
 */
export const isValidLink = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidInput = (input: string): boolean => {
  const trimmed = input.trim()
  return isValidLink(trimmed) || trimmed.toLowerCase() === "general"
}
