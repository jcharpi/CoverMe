/**
 * Root Layout Component
 *
 * The main layout component for the CoverMe application. This component defines the
 * HTML structure, metadata, and global styles for the entire application. It sets up
 * the Inter font family and provides the basic page structure that wraps all other
 * components.
 *
 * Features:
 * - Configures Inter font with CSS variables
 * - Sets application metadata (title, description)
 * - Provides responsive font styling with antialiasing
 * - Defines the root HTML structure for Next.js
 *
 * @fileoverview Next.js root layout with metadata and font configuration
 * @version 1.0.0
 * @author CoverMe Team
 */

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "CoverMe - AI Cover Letter Generator",
	description: "Generate personalized cover letters with AI",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} antialiased font-sans`}>
				{children}
			</body>
		</html>
	)
}
