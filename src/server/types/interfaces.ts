import { Request } from "express"

export interface ResumeRequest extends Request {
  file?: Express.Multer.File
}

export interface SummaryResponse {
  summary: string
  hasAuthIssue?: boolean
}

export interface ErrorResponse {
  error: string
  details?: string
}

export interface HealthResponse {
  status: string
}
