import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { redirect } from "next/navigation";
import DashboardUI from "./DashboardUI";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "SUPER_ADMIN") {
    redirect("/admin/login");
  }

  return <DashboardUI userName={session.user?.name || "Super Admin"} />;
}
