/**
 * Multer configuration for file uploads
 * Handles resume file upload with validation for .txt files only
 */
import multer from "multer"
import { Request } from "express"

export const upload: multer.Multer = multer({
  storage: multer.memoryStorage(),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype === "text/plain") {
      cb(null, true)
    } else {
      cb(new Error("Only .txt files are allowed"))
    }
  },
})
