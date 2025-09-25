import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/authOptions";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const companyId = params.id;

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: data.name,
        description: data.description,
        logo: data.logo,
        location: data.location,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Gabim në përditësimin e kompanisë:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const companyId = params.id;

//     await prisma.company.delete({
//       where: { id: companyId },
//     });

//     return NextResponse.json({ message: "Kompania u fshi me sukses" });
//   } catch (error) {
//     console.error("Gabim në fshirjen e kompanisë:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const companyId = params.id;

    // 1. Delete appointments first
    await prisma.appointment.deleteMany({
      where: { companyId },
    });

    // 2. Delete services (and related photos)
    await prisma.servicePhoto.deleteMany({
      where: { service: { companyId } },
    });
    await prisma.service.deleteMany({
      where: { companyId },
    });

    // 3. Delete users
    await prisma.user.deleteMany({
      where: { companyId },
    });

    // 4. Finally delete the company
    await prisma.company.delete({
      where: { id: companyId },
    });

    return NextResponse.json({ message: "Kompania u fshi me sukses dhe të dhënat e lidhura" });
  } catch (error) {
    console.error("Gabim në fshirjen e kompanisë:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


//

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = params.id;

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}