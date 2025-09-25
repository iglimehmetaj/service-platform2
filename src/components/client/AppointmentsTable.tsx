import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Filter, Edit3, Trash2 } from "lucide-react";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import Notifications from "../Notifications";
import { HashLoader } from "react-spinners";

export interface Appointment {
  name: any;
  client: any;
  startTime: any;
  company: any;
  service: any;
  id: string;
  serviceName: string;
  clientName: string;
  companyName: string;
  date: string;
  time: string;
  price: number;
  status: string;
}

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get session data (including the user role)
  const { data: session } = useSession();

  // Debounce search input to reduce unnecessary filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Memoize the date formatting function
  const formatAppointmentDate = useCallback((timee: string | number | Date) => {
    if (!timee) return '';

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const appointmentDate = new Date(timee);
    const time2 = appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    ) {
      return `Today, ${time2}`;
    }
    else if (
      appointmentDate.getDate() === tomorrow.getDate() &&
      appointmentDate.getMonth() === tomorrow.getMonth() &&
      appointmentDate.getFullYear() === tomorrow.getFullYear()
    ) {
      return `Tomorrow, ${time2}`;
    }
    else {
      const day = appointmentDate.getDate().toString().padStart(2, '0');
      const month = (appointmentDate.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month} ${time2}`;
    }
  }, []);

  // Fetch appointments with error handling
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch("/api/appointments");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Memoize filtered appointments to prevent unnecessary recalculations
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Filter by status
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(appointment => appointment.status === selectedStatus);
    }

    // Filter by search query
    if (debouncedSearchQuery !== "") {
      if (session?.user?.role === "CLIENT") {
        filtered = filtered.filter((appointment) =>
          appointment.service?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          appointment.company?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      } else {
        filtered = filtered.filter((appointment) =>
          appointment.client?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          appointment.service?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      }
    }

    return filtered;
  }, [appointments, selectedStatus, debouncedSearchQuery, session]);

  const updateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, status: updatedAppointment.status }
              : appointment
          )
        );
      } else {
        console.error("Failed to update appointment status");
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update appointment status. Please try again.");
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

  if (error) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Takimet e mia</h1>
            <p className="text-slate-600 mt-1">Shiko dhe menaxho të gjitha takimet e tua</p>
          </div>
          <Notifications/>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reload
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Takimet e mia</h1>
          <p className="text-slate-600 mt-1">Shiko dhe menaxho të gjitha takimet e tua</p>
        </div>
       
        <Notifications/>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={session?.user?.role === "CLIENT" ? "Kërko me emrin e shërbimit ose kompanisë" : "Kërko me emrin e klientit ose shërbimit"}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="text-slate-400 w-4 h-4" />
          <select
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">Të gjitha statuset</option>
            <option value="PENDING">Në pritje</option>
            <option value="CONFIRMED">Konfirmuar</option>
            <option value="COMPLETED">Përfunduar</option>
            <option value="CANCELLED">Anuluar</option>
            <option value="NO_SHOW">Mos-shfaqje</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {session?.user?.role === "CLIENT" ? (
                  <>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Shërbimi</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Kompania</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Data & Ora</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Çmimi</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Statusi</th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Emri i Klientit</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Shërbimi</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Data & Ora</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Çmimi</th>
                    <th className="text-left px-6 py-4 font-medium text-slate-700">Statusi</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50">
                    {session?.user?.role === "CLIENT" ? (
                      <>
                        <td className="px-6 py-4 text-slate-800">{appointment.service?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-800">{appointment.company?.name || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-slate-800">{formatAppointmentDate(appointment.startTime)}</p>                        
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">{appointment.price} L</td>
                        <td className="px-6 py-4">
                          <select
                            className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700
                              hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                              ${appointment.status === 'PENDING' ? 'bg-gray-100' :
                                appointment.status === 'CONFIRMED' ? 'bg-green-100' :
                                appointment.status === 'COMPLETED' ? 'bg-blue-100' :
                                appointment.status === 'CANCELLED' ? 'bg-red-100' :
                                appointment.status === 'NO_SHOW' ? 'bg-yellow-100' : 'bg-white'}
                            `}
                            value={appointment.status}
                            onChange={(e) => updateStatus(appointment.id, e.target.value)}
                          >
                            <option value="PENDING" className="text-gray-600">Në pritje</option>
                            <option value="CONFIRMED" className="text-green-600">Konfirmuar</option>
                            <option value="COMPLETED" className="text-blue-600">Përfunduar</option>
                            <option value="CANCELLED" className="text-red-600">Anuluar</option>
                            <option value="NO_SHOW" className="text-yellow-600">Mos-shfaqje</option>
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-slate-800">{appointment.client?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-800">{appointment.service?.name || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-slate-800">{formatAppointmentDate(appointment.startTime)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">{appointment.price} L</td>
                        <td className="px-6 py-4">
                          <select
                            className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700
                              hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                              ${appointment.status === 'PENDING' ? 'bg-gray-100' :
                                appointment.status === 'CONFIRMED' ? 'bg-green-100' :
                                appointment.status === 'COMPLETED' ? 'bg-blue-100' :
                                appointment.status === 'CANCELLED' ? 'bg-red-100' :
                                appointment.status === 'NO_SHOW' ? 'bg-yellow-100' : 'bg-white'}
                            `}
                            value={appointment.status}
                            onChange={(e) => updateStatus(appointment.id, e.target.value)}
                          >
                            <option value="PENDING" className="text-gray-600">Në pritje</option>
                            <option value="CONFIRMED" className="text-green-600">Konfirmuar</option>
                            <option value="COMPLETED" className="text-blue-600">Përfunduar</option>
                            <option value="CANCELLED" className="text-red-600">Anuluar</option>
                            <option value="NO_SHOW" className="text-yellow-600">Mos-shfaqje</option>
                          </select>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={5} 
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    {appointments.length === 0 
                      ? "Nuk keni asnjë takim të planifikuar." 
                      : "Nuk u gjet asnjë takim me këto kritere kërkimi."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AppointmentsTable;