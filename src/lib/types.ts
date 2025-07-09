export interface Representative {
  id?: number;
  companyId?: number;
  name: string;
  type: "LEGAL" | "CHAMBER" | "BUSINESS";
  position: string;
  email?: string | null;
  dni?: string | null;
  phone?: string | null;
  birthDate?: string | null;
}

export interface AreaContact {
  id?: number;
  companyId?: number;
  name: string;
  position: string;
  email?: string | null;
  phone?: string | null;
  area: string;
}

export interface Company {
  id: number;
  businessName: string;
  tradeName?: string | null;
  ruc: string;
  fiscalAddress: string;
  activity: string;
  anniversaryDate?: string | null;
  corporatePhone?: string | null;
  corporateEmail?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  status: string;
  representatives?: Representative[];
  areaContacts?: AreaContact[];
  tags?: string[]
}

export interface FormData {
  id: number;
  businessName: string;
  tradeName: string;
  ruc: string;
  fiscalAddress: string;
  activity: string;
  anniversaryDate: string;
  corporatePhone: string;
  corporateEmail: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  status: string;
  representatives: Representative[];
  areaContacts: AreaContact[];
}

export interface Subscription {
  id: number
  company: string
  type: "Anual" | "Trimestral" | "Mensual"
  startDate: string
  nextRenewal: string
  status: "Activo" | "Próximo a renovar" | "Vencido"
  amount: string
}

export type SubscriptionType = "Anual" | "Trimestral" | "Mensual"
export type SubscriptionStatus = "Activo" | "Próximo a renovar" | "Vencido"
