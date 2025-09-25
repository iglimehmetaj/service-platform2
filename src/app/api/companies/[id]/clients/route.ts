// src/app/api/companies/[id]/clients/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: companyId } = await params;
  console.log("Company id", companyId);

  if (!companyId) {
    return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
  }

  try {
    const rawClients = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        appointments: {
          some: {
            companyId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        appointments: {
          where: {
            companyId,
          },
          select: {
            status: true,
          },
        },
      },
    });

    // Transform: count statuses
    const clients = rawClients.map(client => {
      const statusCountMap: Record<string, number> = {};

      for (const app of client.appointments) {
        const status = app.status;
        statusCountMap[status] = (statusCountMap[status] || 0) + 1;
      }

      return {
        id: client.id,
        name: client.name,
        email: client.email,
        appointmentsCount: client.appointments.length,
        appointmentStatuses: statusCountMap,
      };
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
