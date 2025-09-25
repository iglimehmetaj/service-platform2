import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {

   const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Check role
  if (session.user.role !== "COMPANY" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  
  const serviceId = params.id;

  if (!serviceId) {
    return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const { name, description, price, categoryId, photos,duration } = body;

    // Update the main service fields
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: categoryId || null,
        photos: {
          deleteMany: {}, // Remove existing photos
          create: photos.map((photo: { url: string }) => ({
            url: photo.url,
          })),
        },
        duration: Number(duration),
      },
      include: {
        photos: true,
        category: true,
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

   const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    // ✅ Check role
    if (session.user.role !== "COMPANY" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

  try {
    const serviceId = params.id;

    // First, delete all photos related to the service
    await prisma.servicePhoto.deleteMany({
      where: { serviceId },
    });

    // Then, delete the service itself
    await prisma.service.delete({
      where: { id: serviceId },
    });

    return NextResponse.json({ message: "Shërbimi u fshi me sukses" });
  } catch (error) {
    console.error("Gabim në fshirjen e shërbimit:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // <- destructure `params` here directly
) {
  const { id } = params;

  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        company: {
          select: {
            name: true,
            location: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        photos: true,
      },
    });

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}