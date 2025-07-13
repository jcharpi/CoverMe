/**
 * AI service for job posting parsing and cover letter generation
 * Integrates with Ollama for AI-powered text processing and generation
 */
import { Ollama } from "ollama"
import { OLLAMA_HOST } from "../config/constants"

const ollama: Ollama = new Ollama({ host: OLLAMA_HOST })

export async function parseJobPosting(
  rawJobContent: string,
  model: string
): Promise<string> {
  try {
    const parsePrompt = `
You are a job posting parser. Extract and organize the key information from this job posting into a clean, structured format.

Focus on extracting:
1. Job Title and Company
2. Key Responsibilities/Duties
3. Required Skills and Qualifications
4. Preferred Skills and Experience
5. Company Information/Culture
6. Benefits and Compensation (if mentioned)
7. Location and Work Arrangement

Remove any:
- Repetitive text
- Legal disclaimers
- Application instructions
- Navigation text
- Irrelevant website content

Format the output as a clean, organized summary that highlights the most important information for writing a cover letter.

Raw Job Posting Content:
${rawJobContent}

Provide a clean, well-structured summary:
`

    const response = await ollama.chat({
      model: model,
      messages: [{ role: "user", content: parsePrompt }],
    })

    return removeThinkingTags(response.message.content)
  } catch (error) {
    console.error("Failed to parse job posting with AI:", error)
    return rawJobContent // Return raw content as fallback
  }
}

export function createCoverLetterPrompt(
  resumeContent: string,
  writingSample: string,
  stanfordGuideContent: string,
  jobContent: string = "",
  isGeneral: boolean = false
): string {
  const writingSampleSection = writingSample
    ? `

Writing Sample for Style Reference:
${writingSample}

STYLE INSTRUCTION: Analyze the writing sample above and mimic the applicant's writing style, tone, and voice in the cover letter. Match their level of formality, sentence structure, and personal expression while maintaining professionalism.`
    : ""

  const jobSection = isGeneral
    ? `

JOB TYPE: General cover letter - Do not reference specific company names, positions, or job requirements. Write a versatile cover letter that highlights the applicant's overall qualifications and can be adapted for various opportunities.`
    : jobContent
    ? `

Job Posting Content:
${jobContent}

JOB INSTRUCTION: Analyze the job posting above and tailor the cover letter specifically to this position. Reference specific requirements, company information, and role details mentioned in the posting.`
    : ""

  return `
You are a professional cover letter writer. Follow these STRICT requirements:
${writingSampleSection}
${jobSection}

1. STRUCTURE: Write EXACTLY 3 paragraphs (no more, no less)
2. LENGTH: 300-400 words total
3. FORMAT: Write only the cover letter body (no header)
4. PARAGRAPH BREAKDOWN:
   - Paragraph 1: Opening (state intent, position, brief introduction)
   - Paragraph 2: Qualifications (majority of content - highlight relevant skills/experience)
   - Paragraph 3: Closing (follow-up plan, thank you)

Stanford Cover Letter Guide:
${stanfordGuideContent}

Applicant's Resume:
${resumeContent}

CRITICAL: Write EXACTLY 3 paragraphs for the cover letter body. Do not include any header or signature. Each paragraph should be separated by a blank line.`
}

export function removeThinkingTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()
}

export { ollama }
