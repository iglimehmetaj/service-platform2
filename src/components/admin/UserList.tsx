"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Mail, 
  Building2, 
  Edit3, 
  Trash2, 
  Search,
  Plus,
  User as UserIcon,
  AlertCircle,
  X,
  Save,
  Shield,
  UserCheck,
  ArrowLeft
} from "lucide-react";
import AddUserForm from "./AddUserForm";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { HashLoader } from "react-spinners";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COMPANY' | 'CLIENT';
  companyId?: string | null;
  createdAt: string;
  Company?: {
    id: string;
    name: string;
  } | null;
}

interface Company {
  id: string;
  name: string;
}

type EnrichedUser = User & {
  companyName: string;
};

interface EditFormData {
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COMPANY' | 'CLIENT';
  companyId: string;
}

export default function UserList() {
const [users, setUsers] = useState<EnrichedUser[]>([]);
const [filterByRole, setFilterByRole] = useState<string | null>(null);
const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    email: "",
    role: "CLIENT",
    companyId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  async function fetchUsersAndCompanies() {
  try {
    const [usersRes, companiesRes] = await Promise.all([
      fetch("/api/users"),
      fetch("/api/companies"),
    ]);

    if (!usersRes.ok) throw new Error("Gabim në marrjen e përdoruesve");
    if (!companiesRes.ok) throw new Error("Gabim në marrjen e kompanive");

    const users: User[] = await usersRes.json();
    const companies: Company[] = await companiesRes.json();

    // Bashkimi i të dhënave: gjej emrin e kompanisë për çdo user
    const companiesMap = new Map(companies.map(c => [c.id, c.name]));

    const enrichedUsers: EnrichedUser[] = users.map(user => ({
  ...user,
  companyName: user.companyId ? companiesMap.get(user.companyId) || "Pa kompani" : "Pa kompani"
}));

    setCompanies(companies); 
    setUsers(enrichedUsers); 
  } catch (e: unknown) {
    if (e instanceof Error) setError(e.message);
    else setError("Gabim i panjohur");
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {

    fetchUsersAndCompanies();
  }, []);

const handleDelete = async (id: string, name: string) => {
  if (confirm(`Je i sigurt që dëshiron ta fshish kompaninë "${name}"?`)) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gabim në fshirjen e kompanisë");
      }

      // Nëse fshirja ka qenë e suksesshme, përditëso listën lokale:
      setUsers((prev) => prev.filter((c) => c.id !== id));
      alert("Kompania u fshi me sukses!");
    } catch (error) {
      console.error("Gabim në fshirjen e kompanisë:", error);
      alert("Gabim në fshirjen e kompanisë. Provoni përsëri.");
    }
  }
};

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "CLIENT",
      companyId: user.companyId || ""
    });
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setEditFormData({
      name: "",
      email: "",
      role: "CLIENT",
      companyId: ""
    });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error('Gabim në përditësimin e përdoruesit');
      }

      const updatedUser = await response.json();
      
      // Update the users list
      setUsers(prev => 
        prev.map(user => 
          user.id === editingUser.id ? updatedUser : user
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Gabim në përditësimin e përdoruesit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
  const matchesSearch =
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesRole = filterByRole ? user.role === filterByRole : true;

  return matchesSearch && matchesRole;
});

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'COMPANY':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-3 h-3" />;
      case 'CLIENT':
        return <UserCheck className="w-3 h-3" />;
      default:
        return <UserIcon className="w-3 h-3" />;
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Lista e Përdoruesve</h1>
            <p className="text-slate-600 mt-1">Menaxho të gjithë përdoruesit e sistemit</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Gabim në ngarkimin e të dhënave</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

 return (
  <div className="space-y-6">
    {showAddUserForm ? (
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">Shto Përdorues</h1>
         


           <button
            onClick={() => setShowAddUserForm(false)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kthehu mbrapa</span>
          </button>
        </div>

        <AddUserForm
          onSuccess={(newUser) => {
            setUsers(prev => [...prev, newUser]);  // opsional, nëse ruan users lokal
            setShowAddUserForm(false);
          }}
          onCancel={() => setShowAddUserForm(false)}
        />
      </>
    ) : (
      <>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Lista e Përdoruesve</h1>
            <p className="text-slate-600 mt-1">Menaxho të gjithë përdoruesit e sistemit</p>
          </div>
          <button
            onClick={() => setShowAddUserForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Shto Përdorues</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Përdorues</p>
                <p className="text-2xl font-bold text-slate-800">{users.length}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setFilterByRole(prev => prev === 'SUPER_ADMIN' ? null : 'SUPER_ADMIN')}
            className={`cursor-pointer bg-white rounded-xl p-4 border border-slate-200 hover:shadow transition ${
              filterByRole === 'SUPER_ADMIN' ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Administratorë</p>
                <p className="text-2xl font-bold text-slate-800">
                  {users.filter(u => u.role === 'SUPER_ADMIN').length}
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setFilterByRole(prev => prev === 'COMPANY' ? null : 'COMPANY')}
            className={`cursor-pointer bg-white rounded-xl p-4 border border-slate-200 hover:shadow transition ${
              filterByRole === 'COMPANY' ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Kompani</p>
                <p className="text-2xl font-bold text-slate-800">
                  {users.filter(u => u.role === 'COMPANY').length}
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setFilterByRole(prev => prev === 'CLIENT' ? null : 'CLIENT')}
            className={`cursor-pointer bg-white rounded-xl p-4 border border-slate-200 hover:shadow transition ${
              filterByRole === 'CLIENT' ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Klientë</p>
                <p className="text-2xl font-bold text-slate-800">
                  {users.filter(u => u.role === 'CLIENT').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-t-2 border-slate-200" />

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Kërko përdorues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          />
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {searchTerm ? "Nuk u gjetën rezultate" : "Nuk ka përdorues"}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm
                ? `Nuk ka përdorues që përputhen me "${searchTerm}"`
                : "Nuk ka përdorues për të shfaqur aktualisht."}
            </p>
            {!searchTerm && (
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Shto Përdoruesin e Parë</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Emri</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Roli</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Kompania</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Veprime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="truncate">{user.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span>{user.role}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate">{user.email}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.companyName || '-'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition"
                          aria-label={`Edito përdoruesin ${user.name}`}
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="text-sm">Edito</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                          aria-label={`Fshij përdoruesin ${user.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Fshij</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Edito Përdoruesin</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
               <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emri *
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Shkruaj emrin e përdoruesit"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Shkruaj email-in"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Roli *
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value as 'SUPER_ADMIN' | 'CLIENT' }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={isSubmitting}
                >
                  <option value="CLIENT">Klient</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kompania
                </label>
                <select
                  value={editFormData.companyId}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, companyId: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={isSubmitting}
                >
                  <option value="">Zgjedh kompaninë (opsionale)</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex space-x-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Po ruhet...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Ruaj Ndryshimet</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            </div>
          </div>
        )}
      </>
    )}
  </div>
);

}