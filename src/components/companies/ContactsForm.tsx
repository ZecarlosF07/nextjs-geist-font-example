"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Representative, AreaContact } from "@/lib/types"

interface ContactsFormProps {
  representatives: Representative[]
  areaContacts: AreaContact[]
  onUpdateRepresentatives: (representatives: Representative[]) => void
  onUpdateAreaContacts: (areaContacts: AreaContact[]) => void
}

export function ContactsForm({
  representatives,
  areaContacts,
  onUpdateRepresentatives,
  onUpdateAreaContacts,
}: ContactsFormProps) {
  const addRepresentative = () => {
    onUpdateRepresentatives([
      ...representatives,
      {
        name: "",
        type: "LEGAL" as const,
        position: "",
        email: null,
        dni: null,
        phone: null,
        birthDate: null,
      },
    ])
  }

  const updateRepresentative = (index: number, field: keyof Representative, value: string) => {
    const newRepresentatives = [...representatives]
    // Handle special case for required fields which shouldn't be null
    if (field === 'type' || field === 'name' || field === 'position') {
      newRepresentatives[index] = { ...newRepresentatives[index], [field]: value }
    } else {
      newRepresentatives[index] = { ...newRepresentatives[index], [field]: value || null }
    }
    onUpdateRepresentatives(newRepresentatives)
  }

  const removeRepresentative = (index: number) => {
    onUpdateRepresentatives(representatives.filter((_, i) => i !== index))
  }

  const addAreaContact = () => {
    onUpdateAreaContacts([
      ...areaContacts,
      {
        name: "",
        position: "",
        email: null,
        phone: null,
        area: "",
      },
    ])
  }

  const updateAreaContact = (index: number, field: keyof AreaContact, value: string) => {
    const newAreaContacts = [...areaContacts]
    // Handle required fields that shouldn't be null
    if (field === 'name' || field === 'position' || field === 'area') {
      newAreaContacts[index] = { ...newAreaContacts[index], [field]: value }
    } else {
      newAreaContacts[index] = { ...newAreaContacts[index], [field]: value || null }
    }
    onUpdateAreaContacts(newAreaContacts)
  }

  const removeAreaContact = (index: number) => {
    onUpdateAreaContacts(areaContacts.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Representantes</h3>
        {representatives.map((rep, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Representante {index + 1}</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeRepresentative(index)}
              >
                Eliminar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={rep.type}
                  onValueChange={(value) => updateRepresentative(index, "type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEGAL">Legal</SelectItem>
                    <SelectItem value="CHAMBER">Cámara</SelectItem>
                    <SelectItem value="BUSINESS">Negocios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={rep.name}
                  onChange={(e) => updateRepresentative(index, "name", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  value={rep.position}
                  onChange={(e) => updateRepresentative(index, "position", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>DNI</Label>
                <Input
                  value={rep.dni || ""}
                  onChange={(e) => updateRepresentative(index, "dni", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={rep.email || ""}
                  onChange={(e) => updateRepresentative(index, "email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input
                  value={rep.phone || ""}
                  onChange={(e) => updateRepresentative(index, "phone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Fecha de Nacimiento
                <span className="text-sm text-muted-foreground ml-2">(dd/mm/aaaa)</span>
              </Label>
              <Input
                type="date"
                value={rep.birthDate || ""}
                onChange={(e) => updateRepresentative(index, "birthDate", e.target.value)}
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addRepresentative}>
          Agregar Representante
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Contactos de Área</h3>
        {areaContacts.map((contact, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Contacto {index + 1}</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeAreaContact(index)}
              >
                Eliminar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Área</Label>
                <Select
                  value={contact.area}
                  onValueChange={(value) => updateAreaContact(index, "area", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gerencia General">Gerencia General</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Ventas">Ventas</SelectItem>
                    <SelectItem value="Contabilidad">Contabilidad y Finanzas</SelectItem>
                    <SelectItem value="RRHH">Recursos Humanos</SelectItem>
                    <SelectItem value="Administración">Asistente Administrativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => updateAreaContact(index, "name", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  value={contact.position}
                  onChange={(e) => updateAreaContact(index, "position", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={contact.email || ""}
                  onChange={(e) => updateAreaContact(index, "email", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={contact.phone || ""}
                onChange={(e) => updateAreaContact(index, "phone", e.target.value)}
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addAreaContact}>
          Agregar Contacto de Área
        </Button>
      </div>
    </div>
  )
}
