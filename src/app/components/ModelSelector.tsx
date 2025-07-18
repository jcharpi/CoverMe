/**
 * Model Selector Component
 *
 * A dropdown component for selecting available OpenRouter AI models. Displays in the header
 * and allows users to choose which model to use for cover letter generation. Automatically
 * hides when no models are available.
 *
 * @component
 * @example
 * ```tsx
 * <ModelSelector
 *   availableModels={availableModels}
 *   selectedModel={selectedModel}
 *   onModelChange={handleModelChange}
 * />
 * ```
 *
 * @fileoverview AI model selection dropdown component
 * @version 1.0.0
 * @author CoverMe Team
 */

import { styles } from "../styles"
import type { ModelSelectorProps } from "../types/interfaces"

export default function ModelSelector({
	availableModels,
	selectedModel,
	onModelChange,
}: ModelSelectorProps) {
	if (availableModels.length === 0) return null

	const formatModelName = (model: string) => {
		// Extract text between first slash and colon, then format
		const match = model.match(/\/([^:]+)/)
		if (match) {
			return match[1]
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		}
		return model
	}

	return (
		<div className="flex items-center space-x-2">
			<label className="text-sm font-medium text-[var(--text-secondary)]">
				Model:
			</label>
			<select
				value={selectedModel}
				onChange={onModelChange}
				className={styles.select}
			>
				{availableModels.map((model) => (
					<option key={model} value={model}>
						{formatModelName(model)}
					</option>
				))}
			</select>
		</div>
	)
}
