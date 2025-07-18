/**
 * API route for fetching available OpenRouter models
 */
import { NextResponse } from "next/server"

const DEEPSEEK_CHAT = "deepseek/deepseek-chat-v3-0324:free"
const DEEPSEEK_R1 = "deepseek/deepseek-r1:free"
const MISTRAL_SMALL_24B = "mistralai/mistral-small-3.1-24b-instruct:free"
const QWEN_235B = "qwen/qwen3-235b-a22b:free"

const OPENROUTER_FREE_MODELS = [DEEPSEEK_CHAT, DEEPSEEK_R1, MISTRAL_SMALL_24B, QWEN_235B]

export async function GET() {
  try {
    return NextResponse.json({
      models: OPENROUTER_FREE_MODELS,
    })
  } catch (error) {
    console.error("Failed to fetch models:", error)
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    )
  }
}
