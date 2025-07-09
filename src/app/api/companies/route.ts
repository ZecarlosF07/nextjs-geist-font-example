import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const ruc = url.searchParams.get("ruc") || undefined
    const businessName = url.searchParams.get("businessName") || undefined
    const status = url.searchParams.get("status") || undefined
    const sortField = url.searchParams.get("sortField") || undefined
    const sortOrder = url.searchParams.get("sortOrder") || undefined

    const where: any = {}

    if (ruc) {
      where.ruc = { contains: ruc, mode: "insensitive" }
    }
    if (businessName) {
      where.businessName = { contains: businessName, mode: "insensitive" }
    }
    if (status && status !== "all" && (status === "Activo" || status === "Inactivo")) {
      where.status = status
    }

    const orderBy: any = {}
    if (sortField && ["businessName", "tradeName", "ruc", "status"].includes(sortField)) {
      orderBy[sortField] = sortOrder === "desc" ? "desc" : "asc"
    }

    const companies = await prisma.company.findMany({
      where,
      orderBy,
      include: {
        representatives: true,
        areaContacts: true,
        subscriptions: true,
      },
    })
    return NextResponse.json(companies)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching companies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    if ('id' in data) {
      delete data.id
    }
    const existingCompany = await prisma.company.findUnique({
      where: { ruc: data.ruc },
    })
    if (existingCompany) {
      return NextResponse.json({ error: "Company with this RUC already exists" }, { status: 400 })
    }
    const { representatives, areaContacts, anniversaryDate, tags, ...companyData } = data
    const newCompany = await prisma.company.create({
      data: {
        ...companyData,
        anniversaryDate: anniversaryDate ? new Date(anniversaryDate) : null,
        tags: tags ?? [],
        representatives: {
          create: representatives ? representatives.map((rep: any) => ({
            ...rep,
            birthDate: rep.birthDate ? new Date(rep.birthDate) : null
          })) : []
        },
        areaContacts: {
          create: areaContacts || []
        }
      },
      include: {
        representatives: true,
        areaContacts: true,
        subscriptions: true,
      }
    })
    return NextResponse.json(newCompany)
  } catch (error) {
    return NextResponse.json({ error: "Error creating company" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id } = data
    if (!id) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    // If only updating tags
    if (Object.keys(data).length === 2 && 'id' in data && 'tags' in data) {
      // First get the company to ensure it exists
      const company = await prisma.company.findUnique({
        where: { id: Number(id) }
      })

      if (!company) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 })
      }

      // Update using Prisma's native array operations
      const updatedCompany = await prisma.$executeRaw`
        UPDATE "Company"
        SET "tags" = ${data.tags}::text[]
        WHERE "id" = ${Number(id)}
      `

      // Fetch the updated company
      const result = await prisma.company.findUnique({
        where: { id: Number(id) },
        include: {
          representatives: true,
          areaContacts: true,
          subscriptions: true,
        }
      })

      return NextResponse.json(result)
    }

    // Full company update
    const { representatives, areaContacts, anniversaryDate, tags, subscriptions, createdAt, updatedAt, id: companyId, ...companyData } = data

    // Remove id fields from nested representatives and areaContacts
    const cleanedRepresentatives = representatives ? representatives.map(({ id, companyId, createdAt, updatedAt, ...rest }: any) => ({
      ...rest,
      birthDate: rest.birthDate ? new Date(rest.birthDate) : null
    })) : undefined

    const cleanedAreaContacts = areaContacts ? areaContacts.map(({ id, companyId, createdAt, updatedAt, ...rest }: any) => ({
      ...rest
    })) : undefined

    const updatedCompany = await prisma.company.update({
      where: { id: Number(id) },
      data: {
        ...companyData,
        anniversaryDate: anniversaryDate ? new Date(anniversaryDate) : null,
        representatives: cleanedRepresentatives ? {
          deleteMany: {},
          create: cleanedRepresentatives
        } : undefined,
        areaContacts: cleanedAreaContacts ? {
          deleteMany: {},
          create: cleanedAreaContacts
        } : undefined,
      },
      include: {
        representatives: true,
        areaContacts: true,
        subscriptions: true,
      }
    })
    return NextResponse.json(updatedCompany)
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json({ error: "Error updating company" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }
    await prisma.company.delete({
      where: { id: parseInt(id) },
    })
    return NextResponse.json({ message: "Company deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting company" }, { status: 500 })
  }
}
