"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function Navigation() {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Socios", href: "/companies" },
    { name: "Suscripciones", href: "/subscriptions" },
    { name: "Eventos", href: "/events" },
    { name: "Capacitaciones", href: "/training" },
    { name: "Certificados", href: "/certificates" },
    { name: "Reportes", href: "/reports" },
  ]

  return (
    <nav className="bg-white border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary">CCI</span>
                <span className="text-sm font-medium text-muted-foreground">Cámara de Comercio</span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    pathname === item.href
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                pathname === item.href
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-l-4 border-transparent"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
