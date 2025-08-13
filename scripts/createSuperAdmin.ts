// scripts/createSuperAdmin.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "superadmin@gmail.com";
  const password = "superadmin12345"; // choose your password

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Super Admin created:", user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());