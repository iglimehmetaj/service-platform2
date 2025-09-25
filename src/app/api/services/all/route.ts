import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req: NextRequest) {
  try {
    // Fetch all services, including category, photos, and company name
    const services = await prisma.service.findMany({
      include: {
        category: true,
        photos: true,
        company: {
          select: {
            name: true, // Include only the company name
          },
        },
      },
    });

    // Map the services to include the company name
    const servicesWithCompany = services.map(service => ({
      ...service,
      companyName: service.company.name, // Add the company name directly to the service object
    }));

    return NextResponse.json(servicesWithCompany, { status: 200 });
  } catch (error) {
    console.error("Error fetching all services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
