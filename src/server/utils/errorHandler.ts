import { Response } from "express"

export function handleError(
  res: Response,
  error: unknown,
  message: string
): void {
  console.error(message, error)
  const errorMessage = error instanceof Error ? error.message : "Unknown error"
  res.status(500).json({
    error: message,
    details: errorMessage,
  })
}
