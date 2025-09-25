import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";  // Import your auth options (this is where you configure next-auth)
import pusher from "@/app/lib/pusher";


const prisma = new PrismaClient();


// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   if (session.user.role !== "CLIENT" && session.user.role !== "SUPER_ADMIN") {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   try {
//     const body = await req.json();
//     const { serviceId, startTime, endTime, notes } = body;

//     if (!serviceId || !startTime) {
//       return NextResponse.json({ error: "serviceId and startTime are required" }, { status: 400 });
//     }

//     const start = new Date(startTime);
//     if (isNaN(start.getTime())) {
//       return NextResponse.json({ error: "Invalid startTime" }, { status: 400 });
//     }

//     let end: Date | null = null;
//     if (endTime) {
//       end = new Date(endTime);
//       if (isNaN(end.getTime())) {
//         return NextResponse.json({ error: "Invalid endTime" }, { status: 400 });
//       }
//     }

//     // Fetch the service to get the companyId and price
//     const service = await prisma.service.findUnique({
//       where: { id: serviceId },
//       select: { companyId: true, price: true },
//     });

//     if (!service) {
//       return NextResponse.json({ error: "Service not found" }, { status: 404 });
//     }

//     const clientId = session.user.id;
//     const companyId = service.companyId;

//     // Explicitly convert the price to a Prisma.Decimal
//     const price = new Prisma.Decimal(service.price.toFixed(2));

//     // Create the appointment with the price
//     const appointment = await prisma.appointment.create({
//       data: {
//         serviceId,
//         clientId,
//         companyId,
//         startTime: start,
//         endTime: end,
//         notes,
//         status: "PENDING",
//         price: price, // Explicitly cast price to Prisma.Decimal
//       },
//     });

//     return NextResponse.json(appointment, { status: 201 });
//   } catch (error) {
//     console.error("Error creating appointment:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "CLIENT" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { serviceId, startTime, notes } = body;

    if (!serviceId || !startTime) {
      return NextResponse.json({ error: "serviceId and startTime are required" }, { status: 400 });
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: "Invalid startTime" }, { status: 400 });
    }

    // ✅ Fetch the service to get the companyId, price, and duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        companyId: true,
        price: true,
        duration: true, // in minutes
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // ✅ Calculate endTime: startTime + duration
    const end = new Date(start.getTime() + service.duration * 60 * 1000); // duration in minutes

    const clientId = session.user.id;
    const companyId = service.companyId;

    const price = new Prisma.Decimal(service.price.toFixed(2));

    const appointment = await prisma.appointment.create({
      data: {
        serviceId,
        clientId,
        companyId,
        startTime: start,
        endTime: end,
        notes,
        status: "PENDING",
        price,
      },
    });

    // ✅ Notify company admins
    const companyAdmins = await prisma.user.findMany({
      where: {
        companyId,
        role: "COMPANY",
      },
      select: { id: true },
    });

    for (const admin of companyAdmins) {
      const notification = await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "NEW_APPOINTMENT",
          message: `A new appointment has been created by client.`,
          relatedId: appointment.id,
        },
      });

      await pusher.trigger(
        `private-user-${admin.id}`,
        "new-notification",
        notification
      );
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clientId = session.user.id;
    const companyId = session.user.companyId;

    // If the user is a client, fetch only their appointments
    if (session.user.role === "CLIENT") {
      const appointments = await prisma.appointment.findMany({
        where: { clientId },
        orderBy: { startTime: 'asc' },
        include: {
          service: { // Including the related service information
            select: {
              name: true, 
              price: true
            }
          },
          client: { // Including the related user (client) information
            select: {
              name: true,
              email: true,
            }
          },
          company: { // Including the related company information
            select: {
              name: true,
              location: true,
            }
          }
        },
      });
      return NextResponse.json(appointments);
    }

    // If the user is a company admin or super admin, fetch all appointments for clients in their company
    if (session.user.role === "SUPER_ADMIN" || session.user.role === "COMPANY") {
      if (!companyId) {
        return NextResponse.json({ error: "Company ID is missing" }, { status: 400 });
      }

      const appointments = await prisma.appointment.findMany({
        where: { companyId },
        orderBy: { startTime: 'asc' },
        include: {
          service: { // Including the related service information
            select: {
              name: true, 
              price: true
            }
          },
          client: { // Including the related user (client) information
            select: {
              name: true,
              email: true,
            }
          },
          company: { // Including the related company information
            select: {
              name: true,
              location: true,
            }
          }
        },
      });

      return NextResponse.json(appointments);
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// export async function GET(req: NextRequest) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // Parse URL params
//   const url = new URL(req.url);
//   const page = Number(url.searchParams.get("page") ?? "1");
//   const limit = Number(url.searchParams.get("limit") ?? "10");
//   const skip = (page - 1) * limit;

//   try {
//     const clientId = session.user.id;
//     const companyId = session.user.companyId;

//     let where = {};
//     if (session.user.role === "CLIENT") {
//       where = { clientId };
//     } else if (session.user.role === "SUPER_ADMIN" || session.user.role === "COMPANY") {
//       if (!companyId) {
//         return NextResponse.json({ error: "Company ID is missing" }, { status: 400 });
//       }
//       where = { companyId };
//     } else {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     // Get total count for pagination info
//     const total = await prisma.appointment.count({ where });

//     // Fetch paginated appointments
//     const appointments = await prisma.appointment.findMany({
//       where,
//       orderBy: { startTime: "asc" },
//       skip,
//       take: limit,
//       include: {
//         service: { select: { name: true, price: true } },
//         client: { select: { name: true, email: true } },
//         company: { select: { name: true, location: true } },
//       },
//     });

//     return NextResponse.json({
//       appointments,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }