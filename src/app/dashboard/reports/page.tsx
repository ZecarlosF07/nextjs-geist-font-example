"use client"

import { Button } from "components/ui/button"
import { Card } from "components/ui/card"

export default function ReportsPage() {
  const reports = [
    {
      title: "Reporte de Socios",
      description: "Estado de membresías y pagos de socios",
      category: "Socios",
      formats: ["PDF", "Excel"],
      icon: "📊",
    },
    {
      title: "Reporte de Eventos",
      description: "Participación y resultados de eventos",
      category: "Eventos",
      formats: ["PDF", "Excel"],
      icon: "📅",
    },
    {
      title: "Reporte de Capacitaciones",
      description: "Asistencia y evaluaciones de capacitaciones",
      category: "Capacitaciones",
      formats: ["PDF"],
      icon: "📚",
    },
    {
      title: "Reporte de Certificados",
      description: "Certificados emitidos y en proceso",
      category: "Certificados",
      formats: ["PDF", "Excel"],
      icon: "📜",
    },
    {
      title: "Reporte Financiero",
      description: "Ingresos y egresos mensuales",
      category: "Finanzas",
      formats: ["PDF", "Excel"],
      icon: "💰",
    },
    {
      title: "Estadísticas de Sectores",
      description: "Distribución de socios por sector económico",
      category: "Análisis",
      formats: ["PDF", "Excel"],
      icon: "📈",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Reportes</h1>
        <p className="text-muted-foreground">
          Generación de reportes y estadísticas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{report.icon}</span>
                <div>
                  <h3 className="font-semibold text-primary">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.category}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
              <div className="flex items-center justify-between pt-4">
                <div className="flex space-x-2">
                  {report.formats.map((format) => (
                    <span
                      key={format}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {format}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  Generar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
