// app/api/dashboard/services/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      take: 10,
      orderBy: {
        appointments: {
          _count: 'desc'
        }
      },
      include: {
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            appointments: true
          }
        }
      }
    });

    const formattedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      category: service.category?.name || 'Uncategorized',
      price: service.price.toString()
    }));

    return NextResponse.json(formattedServices);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching services' },
      { status: 500 }
    );
  }
}