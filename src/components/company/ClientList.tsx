"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Search, Users } from "lucide-react";
import { HashLoader } from "react-spinners";

interface Client {
  id: string;
  name: string;
  email: string;
  appointmentsCount: number;
  appointmentStatuses: Record<string, number>;
}

export default function ClientList() {
  const { data: session, status } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const companyId = session?.user?.companyId as string | undefined;

  async function fetchClients() {
    if (!companyId) {
      setError("Company ID not found in session");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/companies/${companyId}/clients`);
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data: Client[] = await res.json();
      setClients(data);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated" && companyId) {
      fetchClients();
    } else if (status === "unauthenticated") {
      setError("You must be logged in to see clients");
      setLoading(false);
    }
  }, [status, companyId]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            if (error)
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded max-w-xl mx-auto my-8">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Lista e Klientëve</h1>

      {/* Search Bar */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Kërko klientin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
        />
      </div>

      {/* Clients Table or Empty State */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {searchTerm ? "Nuk u gjetën klientë." : "Nuk ka klientë për t'u shfaqur."}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm
              ? `Nuk ka klientë që përputhen me "${searchTerm}"`
              : "Klientët do të shfaqen këtu sapo të krijohen."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full bg-white divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Emri</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Terminet</th>
               
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-slate-50 transition-colors duration-150 cursor-default"
                  title={Object.entries(client.appointmentStatuses)
                    .map(([status, count]) => `${status}: ${count}`)
                    .join(", ")}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{client.appointmentsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
