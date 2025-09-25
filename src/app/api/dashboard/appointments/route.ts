// app/api/dashboard/appointments/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      take: 10,
      orderBy: {
        startTime: 'desc'
      },
      include: {
        service: {
          select: {
            name: true
          }
        },
        client: {
          select: {
            name: true
          }
        }
      }
    });

    const formattedAppointments = appointments.map(app => ({
      id: app.id,
      clientName: app.client.name,
      serviceName: app.service.name,
      date: new Date(app.startTime).toLocaleDateString('sq-AL'),
      time: new Date(app.startTime).toLocaleTimeString('sq-AL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: app.status
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching appointments' },
      { status: 500 }
    );
  }
}