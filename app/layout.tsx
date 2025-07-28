import type React from "react"
import type { Metadata } from "next"
import { Chakra_Petch } from "next/font/google"
import "./globals.css"

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-chakra-petch",
})

export const metadata: Metadata = {
  title: "Dino Kršo - Full-Stack Developer",
  description:
    "Personal portfolio of Dino Kršo, a full-stack developer specializing in React, Node.js, and modern web technologies.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${chakraPetch.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
