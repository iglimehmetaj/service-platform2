// components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, CalendarDays, Package, Users, Star, Bell,
  Filter, Calendar
} from 'lucide-react';
import Notifications from '../Notifications';
import RevenueChart from '../charts/RevenueChart';
import AppointmentsChart from '../charts/AppointmentsChart';
import ClipLoader from "react-spinners/ClipLoader";
import  {HashLoader}  from 'react-spinners';



interface Stats {
  totalRevenue: number;
  monthlyGrowth: number;
  totalAppointments: number;
  totalServices: number;
  totalClients: number;
  averageRating: number;
}

interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
}

type TimePeriod = 'week' | 'month';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalAppointments: 0,
    totalServices: 0,
    totalClients: 0,
    averageRating: 0
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, appointmentsRes, servicesRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/appointments'),
          fetch('/api/dashboard/services')
        ]);

        const statsData = await statsRes.json();
        const appointmentsData = await appointmentsRes.json();
        const servicesData = await servicesRes.json();

        setStats(statsData);
        setAppointments(appointmentsData);
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

            if (loading) {
            return (
                <div className="flex justify-center items-center min-h-[50vh]">
                <div className="flex flex-col items-center space-y-4">
                    <HashLoader size={80} color="#3B82F6" />
                    <p className="text-slate-500 text-sm">Duke ngarkuar të dhënat...</p>
                </div>
                </div>
            );
            }



  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Mirësevini në panelin e menaxhimit të kompanisë</p>
        </div>
        <Notifications />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Të Ardhurat</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalRevenue.toLocaleString()} L</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{stats.monthlyGrowth}% këtë muaj
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Takimet</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalAppointments}</p>
              <p className="text-sm text-slate-500 mt-1">Këtë muaj</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Shërbimet</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalServices}</p>
              <p className="text-sm text-slate-500 mt-1">Aktive</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Klientët</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalClients}</p>
              <p className="text-sm text-slate-500 flex items-center mt-1">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {stats.averageRating} vlerësim
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section for Charts */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Filtro të Dhënat</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select 
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Javore</option>
                <option value="month">Mujore</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueChart timePeriod={timePeriod} selectedDate={selectedDate} />
          <AppointmentsChart timePeriod={timePeriod} selectedDate={selectedDate} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Takimet e Fundit</h3>
          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">{appointment.clientName}</p>
                  <p className="text-sm text-slate-600">{appointment.serviceName}</p>
                  <p className="text-sm text-slate-500">{appointment.date} në {appointment.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Shërbimet më të Kërkuara</h3>
          <div className="space-y-4">
            {services.slice(0, 5).map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">{service.name}</p>
                  <p className="text-sm text-slate-600">{service.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">{service.price} L</p>
                  <p className="text-sm text-green-600">Aktiv</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}