// scripts/createCategories.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ✅ Kategoritë kryesore
  const parentCategories = await prisma.category.createMany({
    data: [
      { name: "Shëndet" },
      { name: "Teknologji" },
      { name: "Bukuri" },
    ],
  });

  console.log("Kategori prind krijuara.");

  // 🔍 Merr kategoritë pas krijimit
  const health = await prisma.category.findFirst({ where: { name: "Shëndet" } });
  const tech = await prisma.category.findFirst({ where: { name: "Teknologji" } });

  // ✅ Nën-kategori për "Shëndet"
  if (health) {
    await prisma.category.createMany({
      data: [
        { name: "Dentist", parentId: health.id },
        { name: "Psikolog", parentId: health.id },
        { name: "Fizioterapi", parentId: health.id },
      ],
    });
    console.log("Nën-kategori për 'Shëndet' u krijuan.");
  }

  // ✅ Nën-kategori për "Teknologji"
  if (tech) {
    await prisma.category.createMany({
      data: [
        { name: "Riparim Laptopësh", parentId: tech.id },
        { name: "Konsulencë IT", parentId: tech.id },
      ],
    });
    console.log("Nën-kategori për 'Teknologji' u krijuan.");
  }

  console.log("Kategoritë u krijuan me sukses.");
}

main()
  .catch((e) => {
    console.error("❌ Error gjatë krijimit të kategorive:", e);
  })
  .finally(() => prisma.$disconnect());
