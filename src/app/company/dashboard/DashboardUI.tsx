"use client"
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Package,
  UserCheck,
  CalendarDays,
  Bell,
  LogOut,
  FolderTree
} from 'lucide-react';
import { signOut } from "next-auth/react";

import ServicesList from '@/components/company/ServicesList';
import { useSession } from "next-auth/react";
import AppointmentsTable from '@/components/client/AppointmentsTable';
import Notifications from '@/components/Notifications';
import ClientList from '@/components/company/ClientList';
import DashboardStats from '@/components/company/DashboardStats';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
    photos: string[];
}

type Appointment = {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
};

interface CompanyStats {
  totalRevenue: number;
  totalAppointments: number;
  totalServices: number;
  totalClients: number;
  monthlyGrowth: number;
  averageRating: number;
}

interface ServiceFormData {
  name: string;
  description?: string;
  price: string;
  categoryId: string; // Ensure this is defined
  photos: string[];  // Ensure this is defined
}



export default function CompanyDashboard() {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<CompanyStats>({
    totalRevenue: 15420,
    totalAppointments: 156,
    totalServices: 12,
    totalClients: 89,
    monthlyGrowth: 12.5,
    averageRating: 4.8
  });

    const [companyName, setCompanyName] = useState<string | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);





  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "services", label: "Shërbimet", icon: Package },
    { id: "appointments", label: "Takimet", icon: CalendarDays },
    { id: "clients", label: "Klientët", icon: Users },
    { id: "settings", label: "Cilësimet", icon: Settings },
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (!session?.user?.companyId) return;

    fetch(`/api/company/${session.user.companyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setCompanyName(data.name);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch company name:", err);
      });
  }, [session]);


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-slate-200"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Package className="w-5 h-5" />}
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{companyName}</h2>
                <p className="text-sm text-slate-500">Dashboard Menaxhimi</p>
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

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-slate-200 space-y-2">
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-800">{session?.user?.name}</p>
                <p className="text-sm text-slate-500">{session?.user?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/auth/company/login" })}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left
                                   text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group">
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
     <main className="flex-1  overflow-y-auto h-screen ">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          
          {/* Dashboard Overview */}
          {activeSection === "dashboard" && (
            // <section className="space-y-8">
            //   <div className="flex items-center justify-between">
            //     <div>
            //       <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            //       <p className="text-slate-600 mt-1">Mirësevini në panelin e menaxhimit të kompanisë</p>
            //     </div>
            //     {/* <div className="flex items-center space-x-2">
            //       <Bell className="w-5 h-5 text-slate-400" />
            //       <span className="text-sm text-slate-600">3 njoftimet e reja</span>
            //     </div> */}

            //     <Notifications />
            //   </div>
              
            //   {/* Stats Cards */}
            //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            //     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            //       <div className="flex items-center justify-between">
            //         <div>
            //           <p className="text-sm font-medium text-slate-600">Të Ardhurat</p>
            //           <p className="text-2xl font-bold text-slate-900">{stats.totalRevenue.toLocaleString()} L</p>
            //           <p className="text-sm text-green-600 flex items-center mt-1">
            //             <TrendingUp className="w-4 h-4 mr-1" />
            //             +{stats.monthlyGrowth}% këtë muaj
            //           </p>
            //         </div>
            //         <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            //           <DollarSign className="w-6 h-6 text-green-600" />
            //         </div>
            //       </div>
            //     </div>

            //     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            //       <div className="flex items-center justify-between">
            //         <div>
            //           <p className="text-sm font-medium text-slate-600">Takimet</p>
            //           <p className="text-2xl font-bold text-slate-900">{stats.totalAppointments}</p>
            //           <p className="text-sm text-slate-500 mt-1">Këtë muaj</p>
            //         </div>
            //         <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            //           <CalendarDays className="w-6 h-6 text-blue-600" />
            //         </div>
            //       </div>
            //     </div>

            //     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            //       <div className="flex items-center justify-between">
            //         <div>
            //           <p className="text-sm font-medium text-slate-600">Shërbimet</p>
            //           <p className="text-2xl font-bold text-slate-900">{stats.totalServices}</p>
            //           <p className="text-sm text-slate-500 mt-1">Aktive</p>
            //         </div>
            //         <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            //           <Package className="w-6 h-6 text-purple-600" />
            //         </div>
            //       </div>
            //     </div>

            //     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            //       <div className="flex items-center justify-between">
            //         <div>
            //           <p className="text-sm font-medium text-slate-600">Klientët</p>
            //           <p className="text-2xl font-bold text-slate-900">{stats.totalClients}</p>
            //           <p className="text-sm text-slate-500 flex items-center mt-1">
            //             <Star className="w-4 h-4 mr-1 text-yellow-500" />
            //             {stats.averageRating} vlerësim
            //           </p>
            //         </div>
            //         <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            //           <Users className="w-6 h-6 text-orange-600" />
            //         </div>
            //       </div>
            //     </div>
            //   </div>

            //   {/* Recent Activity */}
            //   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            //     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            //       <h3 className="text-lg font-semibold text-slate-800 mb-4">Takimet e Fundit</h3>
            //       <div className="space-y-4">
            //         {appointments.slice(0, 5).map((appointment) => (
            //           <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            //             <div>
            //               <p className="font-medium text-slate-800">{appointment.clientName}</p>
            //               <p className="text-sm text-slate-600">{appointment.serviceName}</p>
            //               <p className="text-sm text-slate-500">{appointment.date} në {appointment.time}</p>
            //             </div>
            //             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
            //               {appointment.status}
            //             </span>
            //           </div>
            //         ))}
            //       </div>
            //     </div>

            //     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            //       <h3 className="text-lg font-semibold text-slate-800 mb-4">Shërbimet më të Kërkuara</h3>
            //       <div className="space-y-4">
            //         {services.slice(0, 5).map((service) => (
            //           <div key={service.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            //             <div>
            //               <p className="font-medium text-slate-800">{service.name}</p>
            //               <p className="text-sm text-slate-600">{service.category}</p>
            //             </div>
            //             <div className="text-right">
            //               <p className="font-bold text-slate-800">{service.price} L</p>
            //               <p className="text-sm text-green-600">Aktiv</p>
            //             </div>
            //           </div>
            //         ))}
            //       </div>
            //     </div>
            //   </div>
            // </section>

            <DashboardStats/>
          )}

          {/* Services List */}
          {activeSection === "services" && (
           <ServicesList/>
          )}

          {/* Appointments */}
          {activeSection === "appointments" && (
         <AppointmentsTable />

          )}

         
          {/* Clients */}
          {activeSection === "clients" && (
            <ClientList />
          )}

          {/* Settings */}
          {activeSection === "settings" && (
            <section className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Cilësimet</h1>
                <p className="text-slate-600 mt-1">Menaxho cilësimet e kompanisë</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Informacionet e Kompanisë</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Emri i Kompanisë</label>
                      <input type="text" defaultValue="Kompania Ime" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input type="email" defaultValue="info@kompania.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Telefoni</label>
                      <input type="tel" defaultValue="+355 69 123 4567" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Adresa</label>
                      <textarea defaultValue="Rruga e Durrësit, Tiranë" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows={3} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Cilësime të Tjera</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">Njoftimet me email</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">Njoftimet SMS</span>
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">Rezervime online</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Gjuha e sistemit</label>
                      <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                        <option>Shqip</option>
                        <option>English</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Ruaj Ndryshimet</span>
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}