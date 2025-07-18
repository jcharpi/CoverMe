/**
 * AI service for cover letter generation utilities
 * Contains prompt templates and text processing functions
 */

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
2. LENGTH: about 300-350 words total
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
