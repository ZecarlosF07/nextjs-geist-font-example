import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        generatedDate: 'desc'
      }
    })
    return NextResponse.json(reports)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newReport = await prisma.report.create({
      data: {
        title: data.title,
        status: data.status || "Generado"
      }
    })
    return NextResponse.json(newReport)
  } catch (error) {
    return NextResponse.json({ error: "Error creating report" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const updatedReport = await prisma.report.update({
      where: { id: data.id },
      data: {
        title: data.title,
        status: data.status
      }
    })
    return NextResponse.json(updatedReport)
  } catch (error) {
    return NextResponse.json({ error: "Error updating report" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    await prisma.report.delete({
      where: { id: parseInt(id) }
    })
    return NextResponse.json({ message: "Report deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting report" }, { status: 500 })
  }
}
