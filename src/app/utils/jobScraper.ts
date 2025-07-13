import { chromium } from "playwright"

export interface JobScrapingResult {
  content: string
  hasAuthIssue: boolean
  error?: string
}

export async function scrapeJobContent(
  jobUrl: string
): Promise<JobScrapingResult> {
  let browser

  try {
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    })
    const page = await context.newPage()

    // Set a reasonable timeout
    await page.goto(jobUrl, { waitUntil: "domcontentloaded", timeout: 10000 })

    // Wait a bit for dynamic content to load
    await page.waitForTimeout(2000)

    // Check for common authentication indicators
    const authSelectors = [
      'input[type="password"]',
      'button[type="submit"]:has-text("Sign in")',
      'button[type="submit"]:has-text("Log in")',
      'button[type="submit"]:has-text("Login")',
      'a[href*="login"]',
      'a[href*="signin"]',
      'form[action*="login"]',
      'form[action*="signin"]',
      ".login-form",
      ".signin-form",
      '[data-testid*="login"]',
      '[data-testid*="signin"]',
    ]

    // Check for text-based auth indicators
    const pageText = (await page.textContent("body")) || ""
    const authTextIndicators = [
      "sign in to continue",
      "log in to view",
      "please sign in",
      "authentication required",
      "login required",
      "you must be signed in",
      "access restricted",
      "please log in",
    ]

    const hasAuthSelector =
      (await page.locator(authSelectors.join(", ")).count()) > 0
    const hasAuthText = authTextIndicators.some((indicator) =>
      pageText.toLowerCase().includes(indicator.toLowerCase())
    )

    // Check if we're redirected to a different domain (common for auth)
    const currentUrl = page.url()
    const originalDomain = new URL(jobUrl).hostname
    const currentDomain = new URL(currentUrl).hostname
    const isRedirectedToAuth =
      originalDomain !== currentDomain &&
      (currentUrl.includes("login") ||
        currentUrl.includes("signin") ||
        currentUrl.includes("auth"))

    const hasAuthIssue = hasAuthSelector || hasAuthText || isRedirectedToAuth

    if (hasAuthIssue) {
      return {
        content: "",
        hasAuthIssue: true,
        error: "Authentication required to access job content",
      }
    }

    // Extract job content from common selectors
    const contentSelectors = [
      '[data-testid="job-description"]',
      ".job-description",
      ".job-details",
      ".job-content",
      ".description",
      '[class*="description"]',
      '[class*="job-detail"]',
      "main",
      ".content",
      "article",
    ]

    let content = ""
    for (const selector of contentSelectors) {
      const element = page.locator(selector).first()
      if ((await element.count()) > 0) {
        content = (await element.textContent()) || ""
        if (content.trim().length > 100) {
          break
        }
      }
    }

    // Fallback to body content if specific selectors don't work
    if (!content || content.trim().length < 100) {
      content = (await page.textContent("body")) || ""
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim()
      .substring(0, 5000) // Limit content length

    return {
      content,
      hasAuthIssue: false,
    }
  } catch (error) {
    console.error("Job scraping error:", error)

    // Check if error might be due to auth requirements
    const errorMessage =
      error instanceof Error ? error.message.toLowerCase() : ""
    const isLikelyAuthError =
      errorMessage.includes("timeout") ||
      errorMessage.includes("blocked") ||
      errorMessage.includes("forbidden") ||
      errorMessage.includes("unauthorized")

    return {
      content: "",
      hasAuthIssue: isLikelyAuthError,
      error: error instanceof Error ? error.message : "Unknown scraping error",
    }
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
