"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const AddCompanyForm = dynamic(() => import("@/components/admin/AddCompanyForm"), { ssr: false });
const  AddSubscriptionForm = dynamic(() => import("@/components/admin/AddSubscriptionForm"), { ssr: false });

export default function DashboardUI({ userName }: { userName: string }) {
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-300 flex flex-col p-4">
        <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
        <nav className="flex flex-col space-y-4 flex-grow">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`text-left px-3 py-2 rounded ${
              activeSection === "dashboard" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveSection("companies")}
            className={`text-left px-3 py-2 rounded ${
              activeSection === "companies" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Kompanitë
          </button>

          <button
            onClick={() => setActiveSection("addCompany")}
            className={`text-left px-3 py-2 rounded ${
              activeSection === "addCompany" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Shto Kompani
          </button>

           <button
            onClick={() => setActiveSection("addSubscription")}
            className={`text-left px-3 py-2 rounded ${
              activeSection === "addSubscription" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            Shto Subscription
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">

        {activeSection === "dashboard" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <p>Këtu mund të vendosësh statistikat ose përmbledhjet.</p>
          </section>
        )}

        {activeSection === "companies" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Lista e Kompanive</h2>
            <p>Lista e kompanive do të shfaqet këtu.</p>
          </section>
        )}

        {activeSection === "addCompany" && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Shto Kompani të Re</h2>
    <AddCompanyForm />
  </div>
)}

{activeSection === "addSubscription" && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Shto Abonim të Ri</h2>
    <AddSubscriptionForm />
  </div>
)}
      </main>
    </div>
  );
}
