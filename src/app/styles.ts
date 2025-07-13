export const styles = {
  // Layout
  container: "min-h-screen bg-[var(--background)] font-sans",
  header: "flex items-center justify-between p-6 sm:p-8",
  mainContent: "flex flex-col max-w-4xl mx-auto px-6 sm:px-8 space-y-8 pb-16",

  // Typography
  title: "text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight",
  subtitle: "text-lg text-[var(--text-secondary)] mt-2",
  sectionHeading: "text-xl font-semibold text-[var(--text-primary)] mb-4",
  label: "text-sm font-medium text-[var(--text-primary)] mb-2 block",
  helperText: "text-sm text-[var(--text-secondary)] mt-1",

  // Cards and surfaces
  card: "bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]",
  cardCompact: "bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-sm)]",

  // Form Fields
  fieldContainer: "space-y-6",
  inputGroup: "space-y-2",

  // Status indicators
  statusIndicator: "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
  statusIndicatorComplete: "bg-[var(--success)] border-[var(--success)] text-white",
  statusIndicatorIncomplete: "border-[var(--border)] text-[var(--text-tertiary)]",
  checkIcon: "w-4 h-4",

  // File upload
  fileUpload: "group relative border-2 border-dashed border-[var(--border)] rounded-[var(--radius-lg)] p-8 text-center cursor-pointer transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary-light)]",
  fileUploadActive: "border-[var(--primary)] bg-[var(--primary-light)]",
  fileUploadContent: "flex flex-col items-center space-y-3",
  fileUploadText: "font-medium text-[var(--text-primary)] group-hover:text-black transition-colors",
  fileUploadTextActive: "font-medium text-black transition-colors",
  fileUploadSubtext: "text-sm text-[var(--text-secondary)] group-hover:text-gray-700 transition-colors",
  fileUploadSubtextActive: "text-sm text-gray-700 transition-colors",
  uploadIcon: "w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors",
  fileInput: "absolute inset-0 w-full h-full opacity-0 cursor-pointer",

  // Text inputs
  input: "w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--border-focus)] transition-all duration-200",
  inputError: "border-[var(--error)] focus:ring-[var(--error)]",

  // Writing section
  writingSection: "space-y-4",
  writingContainer: "w-full",
  textarea: "w-full h-[50vh] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--border-focus)] transition-all duration-200 custom-scrollbar",
  textareaLarge: "w-full h-[70vh] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--border-focus)] transition-all duration-200 custom-scrollbar",

  // Buttons
  buttonContainer: "flex flex-col sm:flex-row gap-3 justify-center mt-8",
  buttonPrimary: "inline-flex items-center justify-center px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
  buttonSecondary: "inline-flex items-center justify-center px-6 py-3 bg-[var(--surface)] text-[var(--text-primary)] font-medium border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--surface-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-all duration-200",
  buttonText: "text-[var(--primary)] font-medium hover:text-[var(--primary-hover)] transition-colors duration-200",

  // Loading states
  spinner: "animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full",

  // Model selector
  select: "w-full sm:w-auto min-w-[200px] px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--border-focus)] transition-all duration-200",

  // Progress indicators
  progressContainer: "space-y-2",
  progressBar: "w-full bg-[var(--surface-secondary)] rounded-full h-2",
  progressFill: "bg-[var(--primary)] h-2 rounded-full transition-all duration-300",
  progressText: "text-sm text-[var(--text-secondary)] text-center",
} as const

export const svgPaths = {
  checkmark:
    "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
  upload:
    "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
} as const
