import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next"; // Import getServerSession
import { authOptions } from "@/app/lib/authOptions";  // Import your auth options (this is where you configure next-auth)

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

   const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Check role
  if (session.user.role !== "COMPANY" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  try {
    // Parse the incoming request body
    const body = await req.json();

    // Destructure necessary fields from the body
    const { name, description, price, categoryId, photos, duration } = body;

    // Retrieve the current session using getServerSession
    const session = await getServerSession(authOptions); // Get the session using your authOptions

    // If no session exists or companyId is not available in session, return error
    if (!session || !session.user?.companyId) {
      return NextResponse.json(
        { error: "Ju duhet të jeni të lidhur me një kompani për të krijuar shërbime." },
        { status: 401 } // Unauthorized
      );
    }

    const companyId = session.user.companyId; // Assuming the session contains the companyId

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { error: "Emri dhe çmimi janë të detyrueshme." },
        { status: 400 }
      );
    }

    // Price validation (ensure it is a valid number)
    if (isNaN(Number(price)) || Number(price) <= 0) {
      return NextResponse.json(
        { error: "Çmimi duhet të jetë një numër pozitiv." },
        { status: 400 }
      );
    }

    // Validate that category exists if provided
    let validCategory = null;
    if (categoryId) {
      validCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!validCategory) {
        return NextResponse.json(
          { error: "Kategoria nuk ekziston." },
          { status: 400 }
        );
      }
    }

    // Create the service record
    const service = await prisma.service.create({
      data: {
        name,
        description: description || "", // optional, so default to an empty string
        price: new Prisma.Decimal(price), // Convert price to Decimal for Prisma
        companyId, // Use companyId from the session
        categoryId: categoryId || null, // Allow null if no category is provided
        photos: photos
          ? { create: photos.map((url: string) => ({ url })) }
          : undefined, // Create ServicePhoto records, or skip if no photos are provided
        duration: Number(duration),
        },
    });

    // Return the created service
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Gabim në krijimin e shërbimit:", error);

    // Return generic error message for internal server error
    return NextResponse.json(
      { error: "Gabim i brendshëm gjatë krijimit të shërbimit." },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
   const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Check role
  if (session.user.role !== "COMPANY" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    // Retrieve the current session using getServerSession
    const session = await getServerSession(authOptions);

    // If no session exists or companyId is not available in session, return error
    if (!session || !session.user?.companyId) {
      return NextResponse.json(
        { error: "Ju duhet të jeni të lidhur me një kompani për të parë shërbimet." },
        { status: 401 } // Unauthorized
      );
    }

    const companyId = session.user.companyId; // Assuming the session contains the companyId

    // Query for services that belong to the companyId in the session
    const services = await prisma.service.findMany({
      where: {
        companyId: companyId, // Filter by companyId
      },
      include: {
        category: true, // Include category information if you need it
        photos: true, // Include related photos of the service
      },
    });

    // Return the services found
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Gabim në marrjen e shërbimeve:", error);

    // Return generic error message for internal server error
    return NextResponse.json(
      { error: "Gabim i brendshëm gjatë marrjes së shërbimeve." },
      { status: 500 }
    );
  }
}

