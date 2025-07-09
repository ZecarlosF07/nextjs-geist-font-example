"use client"

import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { Input } from "components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simple validation
      if (!formData.email || !formData.password) {
        throw new Error("Por favor complete todos los campos")
      }

      // In a real app, this would be an API call
      if (formData.email === "admin@test.com" && formData.password === "admin") {
        router.push("/dashboard")
      } else {
        throw new Error("Credenciales inválidas")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md p-6 space-y-6 fade-in">
        <div className="space-y-2 text-center">
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-4xl font-bold text-primary">CCI</span>
              <span className="text-xl font-medium text-muted-foreground">Cámara de Comercio de Ica</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Sistema ERP</h1>
              <p className="text-muted-foreground">
                Cámara de Comercio de Ica
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="admin@test.com"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </Card>
    </main>
  )
}
