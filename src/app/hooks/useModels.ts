/**
 * Custom hook for managing available AI models
 * Fetches and manages the list of available Ollama models
 */
import { useState, useEffect } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export function useModels() {
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("")

  const fetchAvailableModels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models`)
      if (response.ok) {
        const data = await response.json()
        setAvailableModels(data.models)
        if (data.models.length > 0) {
          setSelectedModel(data.models[0])
        }
      }
    } catch (error) {
      console.error("Failed to fetch models:", error)
    }
  }

  useEffect(() => {
    fetchAvailableModels()
  }, [])

  return {
    availableModels,
    selectedModel,
    setSelectedModel,
  }
}
