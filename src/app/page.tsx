"use client"

import { useState } from "react"

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [writingSample, setWritingSample] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(event.target.value)
  }

  const handleWritingChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setWritingSample(event.target.value)
  }

  const bothFieldsCompleted = resumeFile && linkUrl.trim()

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "#4ACA7A" }}
    >
      {/* Header */}
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-white">CoverMe</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col px-8 space-y-6">
        {/* Resume Upload Field */}
        <div className="flex items-center space-x-4">
          <div
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
            style={{
              borderColor: resumeFile ? "white" : "white",
              backgroundColor: resumeFile ? "white" : "transparent",
            }}
          >
            {resumeFile ? (
              <svg
                className="w-4 h-4"
                style={{ color: "#10b981" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : null}
          </div>
          <label className="flex items-center space-x-3 cursor-pointer transition-colors duration-200 px-6 py-4 rounded-lg">
            <span
              className={`font-medium ${
                resumeFile ? "text-white" : "text-white text-opacity-50"
              }`}
            >
              {resumeFile ? resumeFile.name : "Upload resume"}
            </span>
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Link Paste Field */}
        <div className="flex items-center space-x-4">
          <div
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: linkUrl.trim() ? "white" : "white",
              backgroundColor: linkUrl.trim() ? "white" : "transparent",
            }}
          >
            {linkUrl.trim() ? (
              <svg
                className="w-4 h-4"
                style={{ color: "#10b981" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : null}
          </div>
          <input
            type="url"
            placeholder="Paste Job Link"
            value={linkUrl}
            onChange={handleLinkChange}
            className="bg-transparent outline-none text-white font-medium placeholder-white placeholder-opacity-40 px-6 py-4 rounded-lg"
            style={{
              width: linkUrl
                ? `${Math.min(
                    linkUrl.length * 8 + 100,
                    window.innerWidth * 0.5
                  )}px`
                : "175px",
            }}
          />
        </div>

        {/* Writing Sample Section - Only show when both fields are completed */}
        {bothFieldsCompleted && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Tell us about your writing style
            </h2>
            <div className="w-full">
              <textarea
                value={writingSample}
                onChange={handleWritingChange}
                placeholder="Write as much or as little as you'd like, or paste a sample of your writing. The more you write, the more likely your cover letter will match your unique voice and style."
                className="w-full h-[60vh] bg-gray-800 border border-[#85F4A6]/30 rounded-lg px-6 py-4 text-white font-medium placeholder-white/50 resize-none outline-none custom-scrollbar"
              />
            </div>
            <div className="flex justify-center my-12">
              <button className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
