"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  MapPin, 
  Clock, 
  Edit3, 
  Trash2, 
  Search,
  Plus,
  Image as ImageIcon,
  AlertCircle,
  X,
  Save
} from "lucide-react";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";

interface Company {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  location?: string | null;
  phone:string | null;
  email:string | null;
  address:string | null;
  latitude:string | null;
  longitude:string | null;
}

interface EditFormData {
  name: string;
  description: string;
  logo: string;
  location: string;
  phone:string | null;
  email:string | null;
  address:string | null;
  latitude:string | null;
  longitude:string | null;
}
export default function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    description: "",
    logo: "",
    location: "",
    email: "",
    phone: "",
    address:"",
    latitude:"",
    longitude:"",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function fetchCompanies() {
    try {
      const res = await fetch("/api/companies");
      if (!res.ok) throw new Error("Gabim në marrjen e kompanive");
      const data: Company[] = await res.json();
      setCompanies(data);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Gabim i panjohur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

const handleDelete = async (id: string, name: string) => {
  toast(
    (t) => (
      <div className="space-y-2">
        <p className="font-medium text-slate-800">
          Je i sigurt që dëshiron ta fshish kompaninë "<strong>{name}</strong>"?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Dismiss confirmation toast
              const loadingId = toast.loading("Duke fshirë kompaninë...");

              try {
                const response = await fetch(`/api/companies/${id}`, {
                  method: "DELETE",
                });

                if (!response.ok) throw new Error();

                setCompanies((prev) => prev.filter((c) => c.id !== id));
                toast.success("Kompania u fshi me sukses!", { id: loadingId });
              } catch {
                toast.error("Gabim në fshirjen e kompanisë", { id: loadingId });
              }
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Po, fshije
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100 transition"
          >
            Anulo
          </button>
        </div>
      </div>
    ),
    {
      duration: 10000, // Optional: auto-dismiss after 10s
      position: "top-center",
    }
  );
};

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setEditFormData({
      name: company.name || "",
      description: company.description || "",
      logo: company.logo || "",
      location: company.location || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      latitude: company.latitude || "",
      longitude: company.longitude || "",

    });
  };

  const handleCloseModal = () => {
    setEditingCompany(null);
    setEditFormData({
      name: "",
      description: "",
      logo: "",
      location: "",
      email: "",
      phone: "",
      address:"",
      latitude:"",
      longitude:"",
    });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/companies/${editingCompany.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
    ...editFormData,
    latitude: editFormData.latitude ? parseFloat(editFormData.latitude) : null,
    longitude: editFormData.longitude ? parseFloat(editFormData.longitude) : null,
  }),
      });
      toast.success("Kompani u përditësua me sukses!");

      
      if (!response.ok) {
        throw new Error('Gabim në përditësimin e kompanisë');
      }

      const updatedCompany = await response.json();
      
      // Update the companies list
      setCompanies(prev => 
        prev.map(company => 
          company.id === editingCompany.id ? updatedCompany : company
        )
      );

      handleCloseModal();
    } catch (error) {
      toast.error("Gabim në përditësimin e kompanisë.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function truncateWords(text: string, wordLimit: number) {
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
}

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Lista e Kompanive</h1>
            <p className="text-slate-600 mt-1">Menaxho të gjitha kompanitë e regjistruara</p>
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
      {/* Header */}
     

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Kërko kompani..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
        />
      </div>

    

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {searchTerm ? "Nuk u gjetën rezultate" : "Nuk ka kompani"}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm 
              ? `Nuk ka kompani që përputhen me "${searchTerm}"`
              : "Nuk ka kompani për të shfaqur aktualisht."
            }
          </p>
          {!searchTerm && (
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Shto Kompaninë e Parë</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Emri</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Përshkrimi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Vendndodhja</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Telefoni</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Veprime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.map(({ id, logo, name, description, location, email, phone,address,latitude,longitude }) => (
                <tr key={id} className="hover:bg-slate-50 transition-colors duration-200">
                  {/* Logo */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                      {logo ? (
                        <img src={logo} alt={`${name} logo`} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{name}</td>

                  {/* Description */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {description ? truncateWords(description, 6) : '-'}                 
                   </td>

                  {/* Location */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {location || '-'}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {email || '-'}
                  </td>

                  {/* Telefoni */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {phone || '-'}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit({ id, logo, name, description, location, email, phone,address,latitude,longitude })}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition"
                        aria-label={`Edito kompaninë ${name}`}
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edito</span>
                      </button>
                      <button
                        onClick={() => handleDelete(id, name)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                        aria-label={`Fshij kompaninë ${name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Fshij</span>
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
      {editingCompany && (
         <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 mx-4">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-800">Edito Kompaninë</h2>
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
                  Emri i Kompanisë *
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Shkruaj emrin e kompanisë"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Përshkrimi
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Shkruaj përshkrimin e kompanisë"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={editFormData.logo}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com/logo.png"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lokacioni
                </label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Shkruaj lokacionin"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email ?? ""}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Telefoni
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone ?? ""}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isSubmitting}
                  />
                </div>


                                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editFormData.address ?? ""}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isSubmitting}
                  />
                </div>

                                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={editFormData.latitude ?? ""}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isSubmitting}
                  />
                </div>

                                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={editFormData.longitude ?? ""}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isSubmitting}
                  />
                </div>
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
    </div>
  );
}