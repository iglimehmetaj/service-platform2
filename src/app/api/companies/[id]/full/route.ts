import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions"; 

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Kompania nuk u gjet" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Gabim gjatë marrjes së kompanisë:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
