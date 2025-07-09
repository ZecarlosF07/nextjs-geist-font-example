"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard/companies", label: "Empresas" },
    { href: "/dashboard/subscriptions", label: "Suscripciones" },
  ]

  return (
    <aside className="w-64 bg-white border-r p-4 min-h-screen">
      <nav className="flex flex-col space-y-2">
        {links.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2 rounded hover:bg-gray-100 ${
                isActive ? "bg-green-100 font-semibold text-green-700" : "text-gray-700"
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
