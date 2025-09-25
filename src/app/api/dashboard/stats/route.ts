// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get current month and previous month dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const session = await getServerSession(authOptions);
    const company_Id = session?.user?.companyId;   

        if (!company_Id) {
  return NextResponse.json(
    { error: "companyId is required." },
    { status: 400 }
  );
}

    // Calculate total revenue
    const completedAppointments = await prisma.appointment.findMany({
      where: {
        status: 'COMPLETED',
        companyId:company_Id
      }
    });
    
    const totalRevenue = completedAppointments.reduce((sum, app) => {
      return sum + Number(app.price);
    }, 0);

    // Calculate monthly growth
    const currentMonthRevenue = completedAppointments
      .filter(app => new Date(app.startTime) >= startOfMonth)
      .reduce((sum, app) => sum + Number(app.price), 0);
    
    const prevMonthRevenue = completedAppointments
      .filter(app => new Date(app.startTime) >= startOfPrevMonth && new Date(app.startTime) <= endOfPrevMonth)
      .reduce((sum, app) => sum + Number(app.price), 0);
    
    const monthlyGrowth = prevMonthRevenue > 0 
      ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 
      : 0;

    // Count appointments this month
    const totalAppointments = await prisma.appointment.count({
      where: {
        startTime: {
          gte: startOfMonth
        },
        companyId:company_Id
      }
    });

    // Count services

    const totalServices = await prisma.service.count({
      where: {
        companyId: company_Id,
      },
    });

    // Count clients
    const uniqueClients = await prisma.appointment.groupBy({
  by: ['clientId'],
  where: {
    companyId: company_Id,
  },
});

const totalClients = uniqueClients.length;

    // Calculate average rating (if you had a rating system)
    const averageRating = 4.5; // Placeholder

    return NextResponse.json({
      totalRevenue,
      monthlyGrowth: monthlyGrowth.toFixed(1),
      totalAppointments,
      totalServices,
      totalClients,
      averageRating
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching dashboard stats' },
      { status: 500 }
    );
  }
}