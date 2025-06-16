import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { SubscriptionType, SubscriptionStatus } from "./types"

// Combine Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to local string
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Calculate days until renewal
export function getDaysUntilRenewal(renewalDate: string): number {
  const today = new Date()
  const renewal = new Date(renewalDate)
  const diffTime = renewal.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Get subscription status based on renewal date
export function getSubscriptionStatus(renewalDate: string): SubscriptionStatus {
  const daysUntilRenewal = getDaysUntilRenewal(renewalDate)
  
  if (daysUntilRenewal < 0) {
    return "Vencido"
  } else if (daysUntilRenewal <= 30) {
    return "Próximo a renovar"
  } else {
    return "Activo"
  }
}

// Calculate next renewal date based on subscription type
export function calculateNextRenewal(startDate: string, type: SubscriptionType): string {
  const date = new Date(startDate)
  
  switch (type) {
    case "Anual":
      date.setFullYear(date.getFullYear() + 1)
      break
    case "Trimestral":
      date.setMonth(date.getMonth() + 3)
      break
    case "Mensual":
      date.setMonth(date.getMonth() + 1)
      break
  }
  
  return date.toISOString().split('T')[0]
}

// Format currency
export function formatCurrency(amount: string | number): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount
  
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(numericAmount)
}

// Validate RUC number (Peruvian tax ID)
export function isValidRUC(ruc: string): boolean {
  // Basic RUC validation for Peru
  if (!/^20\d{9}$/.test(ruc)) {
    return false
  }
  return true
}

// Validate DNI number (Peruvian national ID)
export function isValidDNI(dni: string): boolean {
  return /^\d{8}$/.test(dni)
}

// Validate email address
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate subscription period text
export function getSubscriptionPeriodText(type: SubscriptionType): string {
  switch (type) {
    case "Anual":
      return "1 año"
    case "Trimestral":
      return "3 meses"
    case "Mensual":
      return "1 mes"
    default:
      return ""
  }
}

// Get status color class for badges
export function getStatusColorClass(status: SubscriptionStatus): string {
  switch (status) {
    case "Activo":
      return "bg-green-100 text-green-800"
    case "Próximo a renovar":
      return "bg-yellow-100 text-yellow-800"
    case "Vencido":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
