import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newCompany = await prisma.company.create({
      data: {
        name: data.name,
        description: data.description,
        logo: data.logo,
        location: data.location,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
      },
    });

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error("Gabim në krijimin e kompanisë:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
