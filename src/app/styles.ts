export const styles = {
  // Layout
  container: "min-h-screen font-sans",
  header: "p-8",
  mainContent: "flex flex-col px-8 space-y-6",

  // Typography
  title: "text-2xl font-semibold text-white",
  sectionHeading: "text-xl font-semibold text-white",

  // Form Fields
  fieldContainer: "flex items-center space-x-4",

  // Checkbox/Circle indicators
  circle: "w-6 h-6 rounded-full border-2 flex items-center justify-center",
  checkIcon: "w-4 h-4",

  // File upload
  fileUpload:
    "flex items-center space-x-3 cursor-pointer transition-colors duration-200 px-6 py-4 rounded-lg",
  fileUploadText: "font-medium",
  uploadIcon: "w-5 h-5 text-white",
  fileInput: "hidden",

  // URL input
  urlInput:
    "bg-transparent outline-none text-white font-medium placeholder-white placeholder-opacity-40 px-6 py-4 rounded-lg",

  // Writing section
  writingSection: "mt-6 space-y-4",
  writingContainer: "w-full",
  textarea:
    "w-full h-[50vh] bg-gray-800 rounded-lg px-6 py-4 text-white font-medium placeholder-white/50 resize-none outline-none custom-scrollbar",
  textareaLarge:
    "w-full h-[70vh] bg-gray-800 rounded-lg px-6 py-4 text-white font-medium placeholder-white/50 resize-none outline-none custom-scrollbar",

  // Button
  buttonContainer: "flex justify-center my-12",
  button:
    "bg-white text-gray-800 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer",
} as const

export const svgPaths = {
  checkmark:
    "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
  upload:
    "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
} as const
