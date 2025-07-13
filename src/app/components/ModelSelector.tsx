/**
 * Dropdown component for selecting AI models
 * Displays available Ollama models and handles model selection
 */
import { styles } from "../styles"

interface ModelSelectorProps {
  availableModels: string[]
  selectedModel: string
  onModelChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function ModelSelector({
  availableModels,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  if (availableModels.length === 0) return null

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
            {model}
          </option>
        ))}
      </select>
    </div>
  )
}
