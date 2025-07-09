import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/prisma"

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        company: true,
      },
    })
    return NextResponse.json(subscriptions)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching subscriptions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newSubscription = await prisma.subscription.create({
      data: {
        plan: data.plan,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        companyId: data.companyId,
      },
      include: {
        company: true,
      },
    })
    return NextResponse.json(newSubscription)
  } catch (error) {
    return NextResponse.json({ error: "Error creating subscription" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const updatedSubscription = await prisma.subscription.update({
      where: { id: data.id },
      data: {
        plan: data.plan,
        status: data.status,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      include: {
        company: true,
      },
    })
    return NextResponse.json(updatedSubscription)
  } catch (error) {
    return NextResponse.json({ error: "Error updating subscription" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    await prisma.subscription.delete({
      where: { id: parseInt(id) },
    })
    return NextResponse.json({ message: "Subscription deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting subscription" }, { status: 500 })
  }
}
