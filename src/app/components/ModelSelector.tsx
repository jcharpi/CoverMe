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
    <div style={{ position: "absolute", top: "20px", right: "20px" }}>
      <select
        value={selectedModel}
        onChange={onModelChange}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: "2px solid white",
          backgroundColor: "white",
          color: "black",
          fontSize: "14px",
          fontWeight: "500",
          outline: "none",
          cursor: "pointer",
        }}
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
