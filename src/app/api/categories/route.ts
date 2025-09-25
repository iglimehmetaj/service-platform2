// pages/api/categories.ts

import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // 🔐 Get session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // ✅ Optional: check role (only COMPANY and SUPER_ADMIN can access)
  if (session.user.role !== "COMPANY" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, parentId } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Emri është i kërkuar." },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Gabim gjatë krijimit të kategorisë:", error);
    return NextResponse.json(
      { error: "Gabim i brendshëm i serverit" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     const categories = await prisma.category.findMany({
//       include: {
//         children: true,
//       },
//     });
//     return NextResponse.json(categories);
//   } catch (error) {
//     console.error("Gabim në marrjen e kategorive:", error);
//     return NextResponse.json(
//       { error: "Gabim në server" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  // 🔐 Get session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // ✅ Optional: check role (example: only COMPANY and SUPER_ADMIN can access)
  if (session.user.role !== "COMPANY" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "CLIENT") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Gabim në marrjen e kategorive:", error);
    return NextResponse.json(
      { error: "Gabim në server" },
      { status: 500 }
    );
  }
}