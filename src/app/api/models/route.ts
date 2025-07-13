/**
 * API route for fetching available OpenRouter models
 */
import { NextResponse } from 'next/server'

const OPENROUTER_FREE_MODELS = [
  'deepseek/deepseek-r1-0528:free',
  'deepseek/deepseek-chat:free',
  'google/gemma-3-27b-it:free',
  'qwen/qwen3-235b-a22b:free',
  'mistralai/mistral-nemo:free'
]

export async function GET() {
  try {
    return NextResponse.json({
      models: OPENROUTER_FREE_MODELS
    })
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}