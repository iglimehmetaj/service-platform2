import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

    const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Check role
  if (session.user.role !== "COMPANY" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const categoryId = params.id;

    // Përditëso kategorinë në Prisma
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        parentId: data.parentId || null, // nëse nuk ka parentId, e vendos null
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Gabim në përditësimin e kategorisë:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Check role
  if (session.user.role !== "COMPANY" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const categoryId = params.id;

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Kategoria u fshi me sukses" });
  } catch (error) {
    console.error("Gabim në fshirjen e kategoris:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
