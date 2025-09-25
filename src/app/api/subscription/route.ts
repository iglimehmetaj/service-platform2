import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next"; // Import getServerSession
import { authOptions } from "@/app/lib/authOptions";  // Import your auth options (this is where you configure next-auth)

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // Get the current session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the user has the correct role
  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Parse the incoming request body
    const body = await req.json();

    // Destructure necessary fields from the body
    const { name, type, price, durationInDays, isActive, companyId } = body;

    // Validate required fields
    if (!name || !type || !price || !durationInDays || !companyId) {
      return NextResponse.json(
        { error: "All fields (name, type, price, durationInDays, companyId) are required." },
        { status: 400 }
      );
    }

    // Validate price to be a positive number
    if (isNaN(Number(price)) || Number(price) <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number." },
        { status: 400 }
      );
    }

    // Check if the companyId is valid
    const companyExists = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!companyExists) {
      return NextResponse.json(
        { error: "Company does not exist." },
        { status: 400 }
      );
    }

    // Create the subscription record in the database
    const subscription = await prisma.subscription.create({
      data: {
        name,
        type,
        price: new Prisma.Decimal(price).toNumber(),  // Convert Decimal to number
        durationInDays,
        isActive,
        company: {
          connect: { id: companyId },
        },
      },
    });

    // Return the created subscription
    return NextResponse.json(subscription, { status: 201 });

  } catch (error) {
    console.error("Error creating subscription:", error);

    // Return a generic error message for internal server errors
    return NextResponse.json(
      { error: "Internal server error while creating subscription." },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the user has the correct role (COMPANY or SUPER_ADMIN)
  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    let subscriptions;

    // If the user is a SUPER_ADMIN, get all subscriptions
    if (session.user.role === "SUPER_ADMIN") {
      subscriptions = await prisma.subscription.findMany();
    } else {
      // If the user is a COMPANY, get subscriptions specific to their company
      subscriptions = await prisma.subscription.findMany({
        where: {
          // Only apply the companyId filter if it exists
          companyId: session.user.companyId || undefined,
        },
      });
    }

    // Return the list of subscriptions
    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);

    return NextResponse.json(
      { error: "Internal server error while fetching subscriptions." },
      { status: 500 }
    );
  }
}

