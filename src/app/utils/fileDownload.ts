/**
 * File download utility for cover letters
 * Creates and triggers download of text content as a file
 */
export const downloadTextAsFile = (
  content: string,
  filename: string = "cover-letter.txt"
): void => {
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const downloadLink = document.createElement("a")
  downloadLink.href = url
  downloadLink.download = filename
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}
