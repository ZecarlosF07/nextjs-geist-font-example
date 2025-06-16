import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      orderBy: {
        date: 'asc'
      }
    })
    return NextResponse.json(trainings)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching trainings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newTraining = await prisma.training.create({
      data: {
        title: data.title,
        instructor: data.instructor,
        date: new Date(data.date),
        status: data.status || "Programado"
      }
    })
    return NextResponse.json(newTraining)
  } catch (error) {
    return NextResponse.json({ error: "Error creating training" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const updatedTraining = await prisma.training.update({
      where: { id: data.id },
      data: {
        title: data.title,
        instructor: data.instructor,
        date: new Date(data.date),
        status: data.status
      }
    })
    return NextResponse.json(updatedTraining)
  } catch (error) {
    return NextResponse.json({ error: "Error updating training" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    await prisma.training.delete({
      where: { id: parseInt(id) }
    })
    return NextResponse.json({ message: "Training deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting training" }, { status: 500 })
  }
}
