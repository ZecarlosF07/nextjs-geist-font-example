import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cámara de Comercio de Ica - ERP",
  description: "Sistema de gestión de suscripciones y socios de la Cámara de Comercio de Ica",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  )
}
