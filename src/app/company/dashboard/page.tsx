// src/app/company/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { redirect } from "next/navigation";
import DashboardUI from "@/app/company/dashboard/DashboardUI";

export default async function CompanyDashboardPage() {
 const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "COMPANY") {
    redirect("/auth/company/login");
  }
  return (
  <DashboardUI />
  );
}
