"use client"
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CalendarDays, 
  UserCheck,
  LogOut,
  Search,
  Filter,
  Edit3,
  Trash2,
  Bell,
  MessageCircle
} from 'lucide-react';
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import AppointmentsTable from '@/components/client/AppointmentsTable';
import ProfileForm from '@/components/client/ProfileForm';
import ChatList from '@/components/chat/ChatList';
import ChatView from '@/components/chat/ChatView';

interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
}

interface ProfileFormProps {
  name?: string;
  email?: string;
}
export default function ClientDashboard() {
  const [activeSection, setActiveSection] = useState<string>("appointments");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { data: session, status } = useSession();
  console.log("session", session);

const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleChatClick = (chatId: string) => {
    setSelectedChatId(chatId);
  };


  const menuItems = [
    { id: "appointments", label: "Takimet e mia", icon: CalendarDays },
    { id: "profile", label: "Profili", icon: UserCheck },
    { id: "chat", label: "Chat", icon: MessageCircle },

  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

 

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-slate-200"
      >
        {sidebarOpen ? <span className="w-5 h-5">X</span> : <span className="w-5 h-5">☰</span>}
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
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{session?.user?.name || 'Client'}</h2>
                <p className="text-sm text-slate-500">Klient Dashboard</p>
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
              onClick={() => signOut({ callbackUrl: "/" })}
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
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          
          {/* Appointments Section */}
          {activeSection === "appointments" && (

                  <AppointmentsTable />

          )}

          {/* Profile Section */}
          {activeSection === "profile" && (

      <ProfileForm 
  // name={session?.user?.name ?? ''} 
  // email={session?.user?.email ?? ''} 
/>
          )}


          {/* Appointments Section */}
         {activeSection === "chat" && (
  <div className="flex h-screen bg-gray-50">
    <ChatList 
      onChatClick={handleChatClick} 
      selectedChatId={selectedChatId}
    />
    <div className="flex-1">
      {selectedChatId ? (
        <ChatView 
          chatId={selectedChatId} 
          onBack={() => setSelectedChatId('')}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Messages</h3>
            <p className="text-gray-600 max-w-md">
              Select a conversation from the sidebar to start chatting with your clients and colleagues.
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
)}
         
        </div>
      </main>
    </div>
  );
}