"use client"

import React, { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Textarea } from "../../../components/ui/textarea"
import type { Company, Representative, AreaContact } from "../../../lib/types"
import { TagsDialog } from "../../../components/companies/TagsDialog"

const emptyRepresentative: Representative = {
  id: undefined,
  type: "LEGAL",
  name: "",
  position: "",
  email: "",
  dni: "",
  phone: "",
  birthDate: ""
}

const emptyAreaContact: AreaContact = {
  id: undefined,
  name: "",
  position: "",
  email: "",
  phone: "",
  area: ""
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTagsDialogOpen, setIsTagsDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    ruc: "",
    businessName: "",
    status: ""
  })
  const [sort, setSort] = useState({
    field: "",
    order: "asc"
  })
  const [formData, setFormData] = useState<Company>({
    id: 0,
    businessName: "",
    tradeName: "",
    ruc: "",
    fiscalAddress: "",
    activity: "",
    anniversaryDate: "",
    corporatePhone: "",
    corporateEmail: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    status: "Activo",
    representatives: emptyRepresentative ? [ {...emptyRepresentative} ] : [],
    areaContacts: emptyAreaContact ? [ {...emptyAreaContact} ] : []
  })

  useEffect(() => {
    fetchCompanies()
  }, [filters, sort])

  async function fetchCompanies() {
    try {
      const queryParams = new URLSearchParams()
      if (filters.ruc) queryParams.append("ruc", filters.ruc)
      if (filters.businessName) queryParams.append("businessName", filters.businessName)
      if (filters.status) queryParams.append("status", filters.status)
      if (sort.field) {
        queryParams.append("sortField", sort.field)
        queryParams.append("sortOrder", sort.order)
      }

      const res = await fetch(`/api/companies?${queryParams.toString()}`)
      const data = await res.json()
      setCompanies(data)
    } catch (error) {
      alert("Error fetching companies")
    }
  }

  function handleSort(field: string) {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc"
    }))
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  async function openDialog(company: Company | null = null) {
    if (company) {
      const anniversaryDate = company.anniversaryDate ? new Date(company.anniversaryDate).toISOString().split("T")[0] : ""
      const representatives = company.representatives && company.representatives.length > 0 ? company.representatives : [ {...emptyRepresentative} ]
      const areaContacts = company.areaContacts && company.areaContacts.length > 0 ? company.areaContacts : [ {...emptyAreaContact} ]
      setFormData({ ...company, anniversaryDate, representatives, areaContacts })
      setSelectedCompany(company)
    } else {
      setFormData({
        id: 0,
        businessName: "",
        tradeName: "",
        ruc: "",
        fiscalAddress: "",
        activity: "",
        anniversaryDate: "",
        corporatePhone: "",
        corporateEmail: "",
        facebookUrl: "",
        instagramUrl: "",
        tiktokUrl: "",
        status: "Activo",
        representatives: [ {...emptyRepresentative, type: "LEGAL"} ],
        areaContacts: [ {...emptyAreaContact} ]
      })
      setSelectedCompany(null)
    }
    setIsDialogOpen(true)
  }

  function closeDialog(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsDialogOpen(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleRepresentativeChange(index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => {
      const reps = [...(prev.representatives || [])]
      reps[index] = { ...reps[index], [name]: value }
      return { ...prev, representatives: reps }
    })
  }

  function handleAreaContactChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => {
      const contacts = [...(prev.areaContacts || [])]
      contacts[index] = { ...contacts[index], [name]: value }
      return { ...prev, areaContacts: contacts }
    })
  }

  function addRepresentative() {
    setFormData(prev => ({
      ...prev,
      representatives: [...(prev.representatives || []), {...emptyRepresentative}]
    }))
  }

  function removeRepresentative(index: number) {
    setFormData(prev => {
      const reps = [...(prev.representatives || [])]
      reps.splice(index, 1)
      return { ...prev, representatives: reps }
    })
  }

  function addAreaContact() {
    setFormData(prev => ({
      ...prev,
      areaContacts: [...(prev.areaContacts || []), {...emptyAreaContact}]
    }))
  }

  function removeAreaContact(index: number) {
    setFormData(prev => {
      const contacts = [...(prev.areaContacts || [])]
      contacts.splice(index, 1)
      return { ...prev, areaContacts: contacts }
    })
  }

  function openTagsDialog(company: Company) {
    setSelectedCompany(company)
    setIsTagsDialogOpen(true)
  }

  async function handleTagsSave(tags: string[]) {
    if (!selectedCompany) return
    try {
      const res = await fetch("/api/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedCompany.id, tags })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error updating tags")
      }
      alert("Tags updated successfully")
      setIsTagsDialogOpen(false)
      fetchCompanies()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Error updating tags")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const method = selectedCompany ? "PUT" : "POST"
      const url = "/api/companies"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error saving company")
      }
      alert(`Company ${selectedCompany ? "updated" : "created"} successfully`)
      closeDialog()
      fetchCompanies()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Error saving company")
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Está seguro de eliminar esta empresa?")) return
    try {
      const res = await fetch(`/api/companies?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error deleting company")
      }
      alert("Company deleted successfully")
      fetchCompanies()
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Error deleting company")
    }
  }

  function handleExportToExcel() {
    try {
      // Prepare data for export
      const exportData = companies.map(company => ({
        'Razón Social': company.businessName,
        'Nombre Comercial': company.tradeName || '',
        'RUC': company.ruc,
        'Dirección Fiscal': company.fiscalAddress,
        'Actividad': company.activity,
        'Estado': company.status,
        'Fecha de Aniversario': company.anniversaryDate || '',
        'Teléfono Corporativo': company.corporatePhone || '',
        'Email Corporativo': company.corporateEmail || '',
        'Facebook': company.facebookUrl || '',
        'Instagram': company.instagramUrl || '',
        'TikTok': company.tiktokUrl || '',
        'Etiquetas': company.tags ? company.tags.join(', ') : '',
        'Representantes': company.representatives ? company.representatives.map(rep => 
          `${rep.type}: ${rep.name} (${rep.position})`
        ).join(' | ') : '',
        'Contactos de Área': company.areaContacts ? company.areaContacts.map(contact => 
          `${contact.name} - ${contact.area} (${contact.position})`
        ).join(' | ') : ''
      }))

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Empresas")

      // Save file
      XLSX.writeFile(wb, "empresas.xlsx")
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Error al exportar a Excel')
    }
  }

  return (
    <main className="min-h-screen p-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary">Empresas</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleExportToExcel}>
              <i className="fas fa-file-excel mr-2"></i>
              Exportar a Excel
            </Button>
            <Button onClick={() => openDialog()}>Nueva Empresa</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="ruc">RUC</Label>
            <Input
              id="ruc"
              name="ruc"
              value={filters.ruc}
              onChange={handleFilterChange}
              placeholder="Buscar por RUC..."
            />
          </div>
          <div>
            <Label htmlFor="businessName">Razón Social</Label>
            <Input
              id="businessName"
              name="businessName"
              value={filters.businessName}
              onChange={handleFilterChange}
              placeholder="Buscar por razón social..."
            />
          </div>
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th 
                  className="p-2 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("businessName")}
                >
                  Razón Social {sort.field === "businessName" && (sort.order === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="p-2 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("tradeName")}
                >
                  Nombre Comercial {sort.field === "tradeName" && (sort.order === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="p-2 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("ruc")}
                >
                  RUC {sort.field === "ruc" && (sort.order === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="p-2 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("status")}
                >
                  Estado {sort.field === "status" && (sort.order === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-2 border-b border-gray-300 text-left">Etiquetas</th>
                <th className="p-2 border-b border-gray-300 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b border-gray-300">{company.businessName}</td>
                  <td className="p-2 border-b border-gray-300">{company.tradeName}</td>
                  <td className="p-2 border-b border-gray-300">{company.ruc}</td>
                  <td className="p-2 border-b border-gray-300">{company.status}</td>
                  <td className="p-2 border-b border-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {company.tags && company.tags.length > 0 ? (
                        company.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">Sin etiquetas</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 border-b border-gray-300 space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openDialog(company)}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(company.id)}>Eliminar</Button>
                    <Button variant="secondary" size="sm" onClick={() => openTagsDialog(company)}>Etiquetas</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedCompany ? "Editar Empresa" : "Nueva Empresa"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
              <Tabs defaultValue="company" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="company">Datos de la Empresa</TabsTrigger>
                  <TabsTrigger value="representatives">Representantes</TabsTrigger>
                  <TabsTrigger value="areaContacts">Contacto de Áreas</TabsTrigger>
                </TabsList>

                <TabsContent value="company" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Razón Social</Label>
                      <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="tradeName">Nombre Comercial</Label>
                      <Input id="tradeName" name="tradeName" value={formData.tradeName || ""} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="ruc">RUC</Label>
                      <Input id="ruc" name="ruc" value={formData.ruc} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="fiscalAddress">Dirección Fiscal</Label>
                      <Textarea id="fiscalAddress" name="fiscalAddress" value={formData.fiscalAddress} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="activity">Actividad</Label>
                      <Textarea id="activity" name="activity" value={formData.activity} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="anniversaryDate">Fecha de Aniversario</Label>
                      <Input id="anniversaryDate" name="anniversaryDate" type="date" value={formData.anniversaryDate || ""} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="corporatePhone">Teléfono Corporativo</Label>
                      <Input id="corporatePhone" name="corporatePhone" value={formData.corporatePhone || ""} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="corporateEmail">Email Corporativo</Label>
                      <Input id="corporateEmail" name="corporateEmail" type="email" value={formData.corporateEmail || ""} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="facebookUrl">Facebook</Label>
                      <Input id="facebookUrl" name="facebookUrl" value={formData.facebookUrl || ""} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="instagramUrl">Instagram</Label>
                      <Input id="instagramUrl" name="instagramUrl" value={formData.instagramUrl || ""} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="tiktokUrl">TikTok</Label>
                      <Input id="tiktokUrl" name="tiktokUrl" value={formData.tiktokUrl || ""} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <Select value={formData.status} onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Activo">Activo</SelectItem>
                          <SelectItem value="Inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="representatives" className="space-y-4">
                  {formData.representatives?.map((rep: Representative, index: number) => (
                    <Card key={index} className="p-4 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Tipo</Label>
                          <Select value={rep.type} onValueChange={(value: "LEGAL" | "CHAMBER" | "BUSINESS") => {
                            const newReps = [...(formData.representatives || [])]
                            newReps[index].type = value
                            setFormData(prev => ({ ...prev, representatives: newReps }))
                          }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LEGAL">Representante Legal</SelectItem>
                              <SelectItem value="CHAMBER">Representante ante la Cámara</SelectItem>
                              <SelectItem value="BUSINESS">Contacto de Negocios</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Nombre</Label>
                          <Input name="name" value={rep.name} onChange={e => handleRepresentativeChange(index, e)} />
                        </div>
                        <div>
                          <Label>Cargo</Label>
                          <Input name="position" value={rep.position} onChange={e => handleRepresentativeChange(index, e)} />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input name="email" type="email" value={rep.email || ""} onChange={e => handleRepresentativeChange(index, e)} />
                        </div>
                        <div>
                          <Label>DNI</Label>
                          <Input name="dni" value={rep.dni || ""} onChange={e => handleRepresentativeChange(index, e)} />
                        </div>
                        <div>
                          <Label>Teléfono</Label>
                          <Input name="phone" value={rep.phone || ""} onChange={e => handleRepresentativeChange(index, e)} />
                        </div>
                        <div>
                          <Label>Fecha de Nacimiento</Label>
                          <Input name="birthDate" type="date" value={rep.birthDate || ""} onChange={e => handleRepresentativeChange(index, e)} />
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => removeRepresentative(index)}>Eliminar</Button>
                    </Card>
                  ))}
                  <Button onClick={addRepresentative}>Agregar Representante</Button>
                </TabsContent>

                <TabsContent value="areaContacts" className="space-y-4">
                  {formData.areaContacts?.map((contact: AreaContact, index: number) => (
                    <Card key={index} className="p-4 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Nombre</Label>
                          <Input name="name" value={contact.name} onChange={e => handleAreaContactChange(index, e)} />
                        </div>
                        <div>
                          <Label>Cargo</Label>
                          <Input name="position" value={contact.position} onChange={e => handleAreaContactChange(index, e)} />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input name="email" type="email" value={contact.email || ""} onChange={e => handleAreaContactChange(index, e)} />
                        </div>
                        <div>
                          <Label>Teléfono</Label>
                          <Input name="phone" value={contact.phone || ""} onChange={e => handleAreaContactChange(index, e)} />
                        </div>
                        <div>
                          <Label>Área</Label>
                          <Input name="area" value={contact.area} onChange={e => handleAreaContactChange(index, e)} />
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => removeAreaContact(index)}>Eliminar</Button>
                    </Card>
                  ))}
                  <Button onClick={addAreaContact}>Agregar Contacto de Área</Button>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit">{selectedCompany ? "Actualizar" : "Crear"}</Button>
                <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <TagsDialog
          company={selectedCompany}
          isOpen={isTagsDialogOpen}
          onClose={() => setIsTagsDialogOpen(false)}
          onSave={handleTagsSave}
        />
      </div>
    </main>
  )
}
