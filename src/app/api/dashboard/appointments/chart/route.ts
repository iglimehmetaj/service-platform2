// app/api/dashboard/appointments/chart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';
    const dateParam = searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();

    let labels: string[] = [];
    let values: number[] = [];

    if (period === 'week') {
      // Get start and end of the week
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
      endOfWeek.setHours(23, 59, 59, 999);

      // Generate labels for each day of the week
      const days = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];
      labels = days;

      // Initialize values array with zeros
      values = new Array(7).fill(0);

      // Fetch appointments for the week
      const appointments = await prisma.appointment.findMany({
        where: {
          startTime: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },
        select: {
          startTime: true,
        },
      });

      // Count appointments by day
      appointments.forEach((appointment) => {
        const dayOfWeek = new Date(appointment.startTime).getDay();
        values[dayOfWeek] += 1;
      });
    } else {
      // Month view
      const year = date.getFullYear();
      const month = date.getMonth();
      
      // Get the number of days in the month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Generate labels for each day of the month
      labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      
      // Initialize values array with zeros
      values = new Array(daysInMonth).fill(0);

      // Fetch appointments for the month
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const appointments = await prisma.appointment.findMany({
        where: {
          startTime: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        select: {
          startTime: true,
        },
      });

      // Count appointments by day
      appointments.forEach((appointment) => {
        const dayOfMonth = new Date(appointment.startTime).getDate();
        values[dayOfMonth - 1] += 1;
      });
    }

    return NextResponse.json({ labels, values });
  } catch (error) {
    console.error('Error fetching appointment chart data:', error);
    return NextResponse.json(
      { error: 'Error fetching appointment chart data' },
      { status: 500 }
    );
  }
}