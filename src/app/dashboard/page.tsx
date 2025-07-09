"use client"

import React from "react"
import { Sidebar } from "../../components/layout/Sidebar"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const data = {
  labels: ["Empresas", "Suscripciones", "Eventos", "Capacitaciones"],
  datasets: [
    {
      label: "Cantidad",
      data: [12, 19, 3, 5],
      backgroundColor: "rgba(34,197,94,0.7)",
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Resumen de la Cámara de Comercio de Ica",
    },
  },
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow p-6 bg-white">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Dashboard</h1>
        <p className="text-green-600 mb-8">
          Bienvenido al panel de control. Seleccione una opción para continuar.
        </p>
        <div className="max-w-4xl">
          <Bar options={options} data={data} />
        </div>
      </main>
    </div>
  )
}