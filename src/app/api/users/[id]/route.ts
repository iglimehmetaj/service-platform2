import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const data = await req.json();
//     const companyId = params.id;

//     const updatedCompany = await prisma.company.update({
//       where: { id: companyId },
//       data: {
//         name: data.name,
//         description: data.description,
//         logo: data.logo,
//         location: data.location,
//         openingTime: data.openingTime,
//         closingTime: data.closingTime,
//       },
//     });

//     return NextResponse.json(updatedCompany);
//   } catch (error) {
//     console.error("Gabim në përditësimin e kompanisë:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "Përdoruesi u fshi me sukses" });
  } catch (error) {
    console.error("Gabim në fshirjen e perdoruesit:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
