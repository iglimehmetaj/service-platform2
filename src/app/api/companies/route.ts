import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions"; 

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
        address: data.address,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
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

export async function GET() {
 const session = await getServerSession(authOptions);
  // Kontroll nëse përdoruesi është loguar
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Kontroll nëse përdoruesi ka rolin e duhur
  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const companies = await prisma.company.findMany();
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Gabim në marrjen e kompanive:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
