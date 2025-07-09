"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "./Navigation"

function Header() {
  return (
    <header className="bg-white text-gray-800 p-4 shadow-sm flex items-center justify-between border-b">
      <nav className="w-full">
        <Navigation />
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-white text-gray-600 p-4 text-center border-t">
      &copy; {new Date().getFullYear()} Cámara de Comercio de Ica. Todos los derechos reservados.
    </footer>
  )
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/"

  return (
    <>
      {!isLoginPage && <Header />}
      <main className="flex-grow container mx-auto p-6">
        {children}
      </main>
      {!isLoginPage && <Footer />}
    </>
  )
}
