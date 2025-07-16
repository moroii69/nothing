import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Crimson_Text } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-crimson",
})

export const metadata: Metadata = {
  title: "nothing - A Meditation on Stillness",
  description: "Do nothing. Move nothing. Think nothing. A zen game about the art of being still.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable} ${crimson.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
