"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "ERP Cámara Ica" },
  ]

  return (
    <nav className="flex space-x-6 items-center">
      {links.map(({ href, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm font-medium hover:text-green-600 ${
              isActive ? "text-green-600 border-b-2 border-green-600" : "text-gray-700"
            }`}
          >
            {label}
          </Link>
        )
      })}
      <button className="ml-auto text-sm font-medium text-gray-700 hover:text-red-600">
        Cerrar Sesión
      </button>
    </nav>
  )
}
