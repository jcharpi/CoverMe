/**
 * Main Input Component
 *
 * The primary interface for cover letter generation in the CoverMe application.
 * Manages the complete user workflow from file upload to AI generation, featuring:
 *
 * - Step-by-step form with visual progress indicators
 * - Resume file upload with validation (TXT files only)
 * - Job link input with real-time URL validation
 * - Optional writing sample for style matching
 * - AI model selection and processing states
 * - Ollama setup guidance when no models are available
 *
 * State Management:
 * - File upload state and validation
 * - Form input values and validation states
 * - AI processing status and error handling
 * - Model availability and selection
 *
 * @component
 * @example
 * ```tsx
 * <Input />
 * ```
 *
 * @fileoverview Main cover letter generation interface component
 * @version 1.0.0
 * @author CoverMe Team
 */
"use client"

import { useState } from "react"
import { styles } from "./styles"
import Output from "./output"
import ModelSelector from "./components/ModelSelector"
import FileUploadField from "./components/FileUploadField"
import LinkInputField from "./components/LinkInputField"
import WritingSampleSection from "./components/WritingSampleSection"
import ServerError from "./components/ServerError"
import { useModels } from "./hooks/useModels"
import { isValidInput } from "./utils/validation"
import {
	checkBackendHealth,
	generateCoverLetter,
	createFormData,
} from "./services/api"

export default function Input() {
	// State management
	const [resumeFile, setResumeFile] = useState<File | null>(null)
	const [linkUrl, setLinkUrl] = useState("")
	const [writingSample, setWritingSample] = useState("")
	const [isProcessing, setIsProcessing] = useState(false)
	const [aiOutput, setAiOutput] = useState("")

	// Custom hooks
	const { availableModels, selectedModel, setSelectedModel } = useModels()

	// Event handlers
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			setResumeFile(file)
		}
	}

	const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLinkUrl(event.target.value)
	}

	const handleWritingChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setWritingSample(event.target.value)
	}

	const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedModel(event.target.value)
	}

	const handleError = (error: unknown): void => {
		console.error("Error details:", error)
		const errorMessage = error instanceof Error ? error.message : String(error)
		if (errorMessage.includes("fetch")) {
			alert(
				"Cannot connect to backend server. Make sure it's running on port 3001."
			)
		} else {
			alert(`Error: ${errorMessage}`)
		}
	}

	// Computed values
	const bothFieldsCompleted =
		resumeFile && linkUrl.trim() && isValidInput(linkUrl)

	const handleCreate = async () => {
		if (!resumeFile) return

		setIsProcessing(true)
		try {
			await checkBackendHealth()
			const formData = createFormData(
				resumeFile,
				writingSample,
				selectedModel,
				linkUrl
			)
			const result = await generateCoverLetter(formData)
			setAiOutput(JSON.stringify(result))
		} catch (error) {
			handleError(error)
		} finally {
			setIsProcessing(false)
		}
	}

	// Navigation functions
	const resetToHome = () => {
		setAiOutput("")
		setResumeFile(null)
		setLinkUrl("")
		setWritingSample("")
	}

	// Conditional rendering
	if (aiOutput) {
		return <Output initialOutput={aiOutput} onCreateAnother={resetToHome} />
	}

	// Show setup message if no models are available
	if (availableModels.length === 0) {
		return (
			<div className={styles.container}>
				<header className={styles.header}>
					<div>
						<h1 className={styles.title}>CoverMe</h1>
						<p className={styles.subtitle}>
							Generate personalized cover letters with AI
						</p>
					</div>
				</header>
				<main className={styles.mainContent}>
					<ServerError />
				</main>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			{/* Header */}
			<header className={styles.header}>
				<div>
					<h1 className={styles.title}>CoverMe</h1>
					<p className={styles.subtitle}>
						Generate personalized cover letters with AI
					</p>
				</div>
				<ModelSelector
					availableModels={availableModels}
					selectedModel={selectedModel}
					onModelChange={handleModelChange}
				/>
			</header>

			{/* Main Content */}
			<main className={styles.mainContent}>
				<div className={styles.fieldContainer}>
					<FileUploadField
						resumeFile={resumeFile}
						onFileUpload={handleFileUpload}
					/>

					<LinkInputField
						linkUrl={linkUrl}
						onLinkChange={handleLinkChange}
						isValid={isValidInput(linkUrl)}
					/>

					{bothFieldsCompleted && (
						<WritingSampleSection
							writingSample={writingSample}
							onWritingChange={handleWritingChange}
							onCreateClick={handleCreate}
							isProcessing={isProcessing}
						/>
					)}
				</div>
			</main>
		</div>
	)
}
