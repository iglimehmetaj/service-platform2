"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Building2, 
  Plus, 
  CreditCard, 
  LogOut,
  Menu,
  X,
  Users,
  FolderTree
} from "lucide-react";
import CompanyList from "@/components/CompanyList";
import CategoryList from "@/components/company/CategoryList";

const AddCompanyForm = dynamic(() => import("@/components/admin/AddCompanyForm"), { ssr: false });
const AddSubscriptionForm = dynamic(() => import("@/components/admin/AddSubscriptionForm"), { ssr: false });
const UserList = dynamic(() => import("@/components/admin/UserList"), { ssr: false });
const AddUserForm = dynamic(() => import("@/components/admin/AddUserForm"), { ssr: false });

export default function DashboardUI({ userName }: { userName: string }) {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "companies",
      label: "Kompanitë",
      icon: Building2,
    },
    {
      id: "users",
      label: "Përdoruesit",
      icon: Users,
    },
    {
      id: "addCompany",
      label: "Shto Kompani",
      icon: Plus,
    },
     {
      id: "categories",
      label: "Kategoritë",
      icon: FolderTree,
    },
    {
      id: "addSubscription",
      label: "Shto Subscription",
      icon: CreditCard,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-slate-200"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
                <p className="text-sm text-slate-500">Welcome, {userName}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left
                    transition-all duration-200 group
                    ${isActive 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/superadmin/login" })}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left
                       text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600" />
              <span className="font-medium">Dil</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0 min-h-screen">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          {activeSection === "dashboard" && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
                  <p className="text-slate-600 mt-1">Mirësevini në panelin e administrimit</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Total Companies</h3>
                      <p className="text-2xl font-bold text-slate-900">24</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Total Users</h3>
                      <p className="text-2xl font-bold text-slate-900">42</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Active Subscriptions</h3>
                      <p className="text-2xl font-bold text-slate-900">18</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
                <p className="text-slate-600">Këtu mund të vendosësh statistikat ose përmbledhjet e fundit.</p>
              </div>
            </section>
          )}

          {activeSection === "companies" && (
            <section className="space-y-6">
              <CompanyList />
            </section>
          )}

          {activeSection === "users" && (
            <section className="space-y-6">
              <UserList />
            </section>
          )}

          {activeSection === "addCompany" && (
            <section className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Shto Kompani të Re</h1>
                <p className="text-slate-600 mt-1">Plotëso të dhënat për të shtuar një kompani të re</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <AddCompanyForm />
              </div>
            </section>
          )}

           {/* Category */}
                    {activeSection === "categories" && (
                      <section className="space-y-6">
                        <CategoryList />
                      </section>
                    )}

           {activeSection === "addSubscription" && 
           <AddSubscriptionForm />
           }
        </div>
      </main>
    </div>
  );
}