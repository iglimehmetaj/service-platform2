// scripts/createClient.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "client@example.com";
  const password = "Igli123456"; // choose your password

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "Client User",
      email,
      password: hashedPassword,
      role: "CLIENT", // role for client user
    },
  });

  console.log("Client user created:", user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
