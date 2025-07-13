import { chromium } from "playwright"

export async function scrapeJobPosting(url: string): Promise<string> {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  })

  const page = await context.newPage()

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })

    const isAuthPage = await page.evaluate(() => {
      const authIndicators = [
        "sign in",
        "sign up",
        "log in",
        "login",
        "register",
      ]
      const pageText = document.body.innerText.toLowerCase()
      return (
        authIndicators.some((indicator) => pageText.includes(indicator)) &&
        pageText.length < 1000
      )
    })

    if (isAuthPage && url.includes("linkedin.com")) {
      return "LinkedIn requires authentication. Please use a company careers page or 'general'."
    }

    await page.waitForTimeout(2000)

    const textContent = await page.evaluate(() => {
      const elementsToRemove = document.querySelectorAll(
        "script, style, nav, header, footer, .nav, .header, .footer, .advertisement, .ads"
      )
      elementsToRemove.forEach((el) => el.remove())

      const contentSelectors = [
        ".job-description",
        ".job-content",
        ".posting-content",
        ".job-details",
        "main",
        ".main-content",
        "article",
      ]

      for (const selector of contentSelectors) {
        const element = document.querySelector(selector)
        if (
          element &&
          element.textContent &&
          element.textContent.trim().length > 100
        ) {
          return element.textContent.trim()
        }
      }

      return document.body.innerText.trim()
    })

    return textContent
  } finally {
    await browser.close()
  }
}
