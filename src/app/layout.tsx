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
