// scripts/createCompanyUser.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "companyuser@gmail.com";
  const password = "companyuser12345"; // your desired password
  const hashedPassword = await bcrypt.hash(password, 10);

  const companyId = "cmecy4kg40000up7cmapu43p6"; // Kompani 2's ID

  const user = await prisma.user.create({
    data: {
      name: "Company Admin",
      email,
      password: hashedPassword,
      role: "COMPANY",
      companyId, // 👈 this links the user to the company
    },
  });

  console.log("Company user created:", user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
