// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { authOptions } from "@/app/lib/authOptions";
// import { getServerSession } from "next-auth";

// const prisma = new PrismaClient();

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   // Get session from NextAuth
//   const session = await getServerSession(authOptions);

//   // Check if user is logged in
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // Check role for permission (COMPANY or SUPER_ADMIN)
//   if (session.user.role !== "COMPANY" && session.user.role !== "CLIENT") {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   // Get the appointment ID from the URL params
//   const appointmentId = params.id;

//   if (!appointmentId) {
//     return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
//   }

//   try {
//     // Parse the request body to get the new status
//     const body = await req.json();
//     const { status } = body;

//     // Validate the status value
//     if (!["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"].includes(status)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     // Update the appointment status in the database
//     const updatedAppointment = await prisma.appointment.update({
//       where: { id: appointmentId },
//       data: { status },
//     });

//     // Return the updated appointment
//     return NextResponse.json(updatedAppointment);
//   } catch (error) {
//     console.error("Error updating appointment status:", error);
//     return NextResponse.json({ error: "Failed to update appointment status" }, { status: 500 });
//   }
// }

// src/app/api/appointments/[id]/route.ts



import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import pusher from "@/app/lib/pusher";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointmentId = params.id;
  const body = await req.json();
  const { status } = body;

  if (!["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    // 1. Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        client: true,  // get client user
        company: {
          include: {
            users: true, // get all users in company (admins)
          },
        },
      },
    });

    const isByCompany = session.user.role === "COMPANY" || session.user.role === "SUPER_ADMIN";
    const isByClient = session.user.role === "CLIENT";

    // 2. Notify the OTHER party
    if (isByCompany) {
      // Notify the CLIENT
      const notification = await prisma.notification.create({
        data: {
          userId: updatedAppointment.clientId,
          type: "STATUS_CHANGE",
          message: `Statusi i takimit tuaj është ndryshuar në "${status}" nga kompania.`,
          relatedId: updatedAppointment.id,
        },
      });

      await pusher.trigger(`private-user-${updatedAppointment.clientId}`, "new-notification", notification);
    }

    if (isByClient) {
      // Notify all COMPANY ADMINS in that company
      const admins = updatedAppointment.company.users.filter(
        (user) => user.role === "COMPANY" && user.id !== session.user.id
      );

      await Promise.all(
        admins.map(async (admin) => {
          const notification = await prisma.notification.create({
            data: {
              userId: admin.id,
              type: "STATUS_CHANGE",
              message: `Klienti ka ndryshuar statusin e takimit në "${status}".`,
              relatedId: updatedAppointment.id,
            },
          });

          await pusher.trigger(`private-user-${admin.id}`, "new-notification", notification);
        })
      );
    }

    return NextResponse.json(updatedAppointment, { status: 200 });

  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}
