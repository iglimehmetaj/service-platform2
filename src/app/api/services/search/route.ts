import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category-id");
    const city = searchParams.get("city");

    // 🔍 If no filters are provided, return all services
    if (!categoryId && !city) {
      return NextResponse.json(
        { error: "At least one of category-id or city must be provided." },
        { status: 400 }
      );
    }

    // 🧠 Optional: Handle parent category by fetching child categories
    const categoryIds: string[] = [];

    if (categoryId) {
      categoryIds.push(categoryId);

      const children = await prisma.category.findMany({
        where: { parentId: categoryId },
        select: { id: true },
      });

      categoryIds.push(...children.map((c) => c.id));
    }

    // 🔍 Query services
    const services = await prisma.service.findMany({
        where: {
        ...(categoryIds.length > 0 && {
            categoryId: { in: categoryIds },
        }),
        ...(city && {
            company: {
            location: {
                contains: city, // use contains for partial match
                // mode: "insensitive" ❌ remove this
            },
            },
        }),
        },
      include: {
        company: true,
        category: true,
        photos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching services." },
      { status: 500 }
    );
  }
}
