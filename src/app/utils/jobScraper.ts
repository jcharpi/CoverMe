import { chromium, Page } from "playwright"

export interface JobScrapingResult {
  content: string
  hasAuthIssue: boolean
  error?: string
}

const AUTH_SELECTORS = [
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

const AUTH_TEXT_INDICATORS = [
  "sign in to continue",
  "log in to view",
  "please sign in",
  "authentication required",
  "login required",
  "you must be signed in",
  "access restricted",
  "please log in",
  "join linkedin",
  "sign in to linkedin",
  "welcome back",
]

const CONTENT_SELECTORS = [
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

const BROWSER_CONFIG = {
  headless: true,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
}

const TIMEOUTS = {
  navigation: 10000,
  dynamicContent: 2000,
}

const CONTENT_LIMITS = {
  minLength: 100,
  maxLength: 10000,
}

export function checkUrlForAuthIssues(jobUrl: string): boolean {
  console.log("=== URL AUTH CHECK DEBUG ===")
  console.log("Input URL:", jobUrl)
  
  try {
    const url = new URL(jobUrl)
    console.log("Parsed URL hostname:", url.hostname)
    console.log("Parsed URL pathname:", url.pathname)
    console.log("URL search params:", url.searchParams.toString())

    // LinkedIn job URLs that typically require auth
    if (url.hostname.includes("linkedin.com")) {
      console.log("Detected LinkedIn URL")
      
      const hasJobsView = url.pathname.includes("/jobs/view/")
      const hasJobsCollections = url.pathname.includes("/jobs/collections/")
      const hasCurrentJobId = url.searchParams.has("currentJobId")
      
      console.log("Has /jobs/view/:", hasJobsView)
      console.log("Has /jobs/collections/:", hasJobsCollections)
      console.log("Has currentJobId param:", hasCurrentJobId)
      
      // Standard LinkedIn job URLs that commonly redirect to auth
      if (hasJobsView || hasJobsCollections || hasCurrentJobId) {
        console.log("LinkedIn auth required: TRUE")
        console.log("=== END URL AUTH CHECK ===")
        return true
      }
    }

    // Other job boards that commonly require auth
    const authRequiredDomains = [
      "indeed.com",
      "glassdoor.com",
      "ziprecruiter.com",
    ]

    const matchedDomain = authRequiredDomains.find((domain) => url.hostname.includes(domain))
    if (matchedDomain) {
      console.log("Detected auth-required domain:", matchedDomain)
      
      const hasViewJob = url.pathname.includes("/viewjob")
      const hasJobPath = url.pathname.includes("/job/")
      const hasJkParam = url.searchParams.has("jk")
      
      console.log("Has /viewjob:", hasViewJob)
      console.log("Has /job/:", hasJobPath)
      console.log("Has jk param:", hasJkParam)
      
      // Check for specific patterns that indicate auth walls
      if (hasViewJob || hasJobPath || hasJkParam) {
        console.log("Other platform auth required: TRUE")
        console.log("=== END URL AUTH CHECK ===")
        return true
      }
    }

    console.log("No auth issues detected: FALSE")
    console.log("=== END URL AUTH CHECK ===")
    return false
  } catch (error) {
    console.log("URL parsing error:", error)
    console.log("=== END URL AUTH CHECK ===")
    return false
  }
}

export async function scrapeJobContent(
  jobUrl: string
): Promise<JobScrapingResult> {
  let browser

  try {
    browser = await chromium.launch({ headless: BROWSER_CONFIG.headless })
    const context = await browser.newContext({
      userAgent: BROWSER_CONFIG.userAgent,
    })
    const page = await context.newPage()

    await page.goto(jobUrl, {
      waitUntil: "domcontentloaded",
      timeout: TIMEOUTS.navigation,
    })

    await page.waitForTimeout(TIMEOUTS.dynamicContent)

    const authIssue = await detectAuthenticationIssues(page, jobUrl)

    if (authIssue.hasAuthIssue) {
      return {
        content: "",
        hasAuthIssue: true,
        error: "Authentication required to access job content",
      }
    }

    const content = await extractJobContent(page)

    return {
      content,
      hasAuthIssue: false,
    }
  } catch (error) {
    console.error("Job scraping error:", error)

    const errorMessage =
      error instanceof Error ? error.message.toLowerCase() : ""
    const isLikelyAuthError = [
      "timeout",
      "blocked",
      "forbidden",
      "unauthorized",
    ].some((term) => errorMessage.includes(term))

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

async function detectAuthenticationIssues(page: Page, jobUrl: string) {
  // Pre-check: URL-based auth detection for known problematic patterns
  const urlBasedAuthCheck = checkUrlForAuthIssues(jobUrl)
  if (urlBasedAuthCheck) {
    return { hasAuthIssue: true }
  }

  const pageText = (await page.textContent("body")) || ""

  const hasAuthSelector =
    (await page.locator(AUTH_SELECTORS.join(", ")).count()) > 0
  const hasAuthText = AUTH_TEXT_INDICATORS.some((indicator) =>
    pageText.toLowerCase().includes(indicator.toLowerCase())
  )

  const currentUrl = page.url()
  const originalDomain = new URL(jobUrl).hostname
  const currentDomain = new URL(currentUrl).hostname
  const isRedirectedToAuth =
    originalDomain !== currentDomain &&
    (currentUrl.includes("login") ||
      currentUrl.includes("signin") ||
      currentUrl.includes("auth"))

  // Additional LinkedIn-specific checks
  const isLinkedInAuthPage =
    currentUrl.includes("linkedin.com") &&
    (currentUrl.includes("authwall") ||
      currentUrl.includes("login") ||
      pageText.toLowerCase().includes("join linkedin") ||
      pageText.toLowerCase().includes("sign in to linkedin"))

  return {
    hasAuthIssue:
      hasAuthSelector ||
      hasAuthText ||
      isRedirectedToAuth ||
      isLinkedInAuthPage,
  }
}

async function extractJobContent(page: Page): Promise<string> {
  let content = ""

  // Try specific selectors first
  for (const selector of CONTENT_SELECTORS) {
    const element = page.locator(selector).first()
    if ((await element.count()) > 0) {
      content = (await element.textContent()) || ""
      if (content.trim().length > CONTENT_LIMITS.minLength) {
        break
      }
    }
  }

  // Fallback to body content
  if (!content || content.trim().length < CONTENT_LIMITS.minLength) {
    content = (await page.textContent("body")) || ""
  }

  // Clean and limit content
  return content
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim()
    .substring(0, CONTENT_LIMITS.maxLength)
}
