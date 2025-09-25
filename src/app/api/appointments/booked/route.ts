//src\app\api\appointments\booked\route.ts

import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");

  if (!serviceId) {
    return NextResponse.json({ error: "Missing serviceId" }, { status: 400 });
  }

  const appointments = await prisma.appointment.findMany({
  where: { 
    serviceId, 
    status: {
      in: ['PENDING', 'CONFIRMED', 'COMPLETED'] // Include these statuses
    }
  },
  select: { startTime: true, endTime: true },
});

  return NextResponse.json(appointments);
}