import { useState, useEffect } from "react";
import ServiceForm from "../admin/ServiceForm";
import { X,} from 'lucide-react';
import toast from "react-hot-toast";
import { confirmToast } from '@/reusable/ConfirmToast';
import { HashLoader } from "react-spinners";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: {
    id: string;
    name: string;
    parentId: string | null;
  };
  photos: Photo[];
}


interface ServiceFormData {
  name: string;
  description?: string;
  price: string;
  categoryId: string; // Ensure this is defined
  photos: string[];  // Ensure this is defined
  duration:string;
}


interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  services?: any[]; // Service count or array
  _count?: {
    services: number;
    children: number;
  };
}

type Photo = {
  id?: string;
  url: string;
  serviceId?: string;
};

const ServicesManagement = () => {
   // Service form state
    const [serviceForm, setServiceForm] = useState<ServiceFormData>({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      photos: [],
      duration:'',
    });

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState<
    "services" | "addService" | "editService"
  >("services");
  const [loading, setLoading] = useState(true);

 type EditingServiceState = Service & { categoryId?: string };

  const [editingService, setEditingService] = useState<EditingServiceState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
        setLoading(true);

    try {
      const response = await fetch("/api/services");
      const data = await response.json();

      setServices(data);
      setFilteredServices(data);
          setLoading(false);

    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

      useEffect(() => {
        fetchServices();
      }, [activeSection]);

      useEffect(() => {
          const fetchCategories = async () => {
                setLoading(true);

            try {
              const response = await fetch('/api/categories'); 
              const data = await response.json();

              setCategories(data);
                  setLoading(false);

            } catch (error) {
              console.error('Error fetching categories:', error);
            }
          };
  
          fetchCategories();
        }, []); 
  
      useEffect(() => {
        const filtered = services.filter(
          (service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredServices(filtered);
      }, [searchTerm, services]);

      const handleEditService = (service: Service) => {
        setEditingService(service);
        setActiveSection("editService");
      };


        const deleteService = async (id: string, name: string) => {
  const deleting = toast.loading('Duke fshirë...');

  try {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || 'Nuk mund të fshihet.');
    }

    toast.success(`Shërbimi "${name}" u fshi me sukses.`, { id: deleting });

    // opsionale: rifresko të dhënat
  } catch (error: any) {
    toast.error(`Gabim: ${error.message}`, { id: deleting });
  }
};




        const handleDeleteService =  (id: string, name: string) => {
      confirmToast(
        `Je i sigurt që dëshiron ta fshish kategorinë "${name}"?`,
        async () => {
          await deleteService(id, name);
          await fetchServices();
        }
      );
      };



        const handleSaveEdit = async () => {
        if (!editingService) return;

        const payload = {
          name: editingService.name,
          description: editingService.description,
          price: editingService.price.toString(),
          categoryId: editingService.categoryId || null,
          photos: editingService.photos.map((photo) => ({
            url: photo.url,
          })),
          duration: editingService.duration,

        };



        try {
          const response = await fetch(`/api/services/${editingService.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error("Failed to update service:", error);
            return;
          }

          setEditingService(null);
          setActiveSection("services");
         toast.success(`Shërbimi "${name}" u përditësua me sukses.`);

        } catch (err) {
          console.error("Error updating service:", err);
        }
      };




    const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      try {
        const response = await fetch("/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: serviceForm.name,
            description: serviceForm.description,
            price: serviceForm.price,
            categoryId: serviceForm.categoryId,
            photos: serviceForm.photos,
            duration:serviceForm.duration,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Handle success (e.g., redirect or show success message)
        toast.success(`Shërbimi i ri u krijua me sukses!`);
        setActiveSection("services");
        } else {
          // Handle error
    toast.error(`Gabim: ${data.error}`);

        }
      } catch (error) {

    toast.error(`Gabim gjatë ruajtjes së shërbimit.`);

      }
    };

    const flattenCategories = (
    cats: Category[],
    prefix = ""
      ): Array<{ id: string; name: string; key: string }> => {
    let result: Array<{ id: string; name: string; key: string }> = [];

    cats.forEach((cat) => {
      const displayName = prefix ? `${prefix} → ${cat.name}` : cat.name;
      const key = prefix ? `${prefix}-${cat.id}` : cat.id;

      result.push({ id: cat.id, name: displayName, key });

      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children, displayName));
      }
    });

    return result;
  };

  const flatCategories = flattenCategories(categories);

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
  
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const res = await fetch("/api/upload-photo", {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error || "Ngarkimi i fotos dështoi.");
        }
  
       setEditingService((prev) =>prev ? {
                          ...prev,
                          photos: [...prev.photos, { url: data.url }],
                          }: null 
                        );
      } catch (err) {
        console.error(err);
        alert("Ngarkimi i fotos dështoi. Ju lutemi provoni përsëri.");
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
    <section className="space-y-6">
      {/* Header and add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Shërbimet</h1>
          <p className="text-slate-600 mt-1">
            Menaxho të gjitha shërbimet e kompanisë
          </p>
        </div>
        {activeSection === "services" && (
          <button
            onClick={() => setActiveSection("addService")}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <span className="w-4 h-4">+</span>
            <span>Shto Shërbim</span>
          </button>
        )}
      </div>

      {/* Search bar (only show in services section) */}
      {activeSection === "services" && filteredServices.length > 0 && (
       
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
         
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Kërko shërbime..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
       
          </div>
        </div>
      )}

     {/* Services List */}
      {activeSection === "services" && (
        <div className="overflow-x-auto">
          {filteredServices.length === 0 ? (
            <div className="p-6 text-center bg-red-100 text-black-800 rounded-lg shadow-md">
              <p className="text-lg font-semibold">Nuk ka shërbime të disponueshme.</p>
              <p className="mt-2 text-sm text-black-700">
                Ju lutemi shtoni një shërbim të ri duke klikuar "Shto Shërbim".
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-xl shadow-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Emri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kategoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Çmimi</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Veprime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition">
                    {/* Foto */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.photos && service.photos.length > 0 ? (
                        <img
                          src={service.photos[0].url}
                          alt={service.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          No Img
                        </div>
                      )}
                    </td>

                    {/* Emri */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                      {service.name}
                    </td>

                    {/* Kategoria */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {service.category.name}
                      </span>
                    </td>

                    {/* Çmimi */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                      {service.price} L
                    </td>

                    {/* Veprimet */}
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                      >
                        Edito
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id, service.name)}
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        Fshij
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}



      {/* Add Service Section */}
      {activeSection === "addService" && (

        <ServiceForm
  serviceForm={serviceForm}
  setServiceForm={setServiceForm}
  categories={categories} // Pass the categories here
  isSubmitting={isSubmitting}
  editingService={!!editingService}
  onSubmit={handleServiceSubmit}
  onCancel={() => {
    setActiveSection("services");
    setEditingService(null);
    setServiceForm({
      name: "",
      description: "",
      price: "",
      categoryId: "", // Reset categoryId instead of category
      photos: [] ,// Reset photos,
      duration:'',
    });
  }}
/>
      )}

      {/* Edit Service Section (replaces modal) */}
      {activeSection === "editService" && editingService && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200  mx-auto">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Edito Shërbimin
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Emri i Shërbimit
              </label>
              <input
                type="text"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={editingService.name}
                onChange={(e) =>
                  setEditingService({ ...editingService, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Përshkrimi
              </label>
              <textarea
                className="w-full p-2 border border-slate-300 rounded-lg"
                rows={3}
                value={editingService.description}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Çmimi (L)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={editingService.price}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
               <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kategoria
              </label>

                                  <select
              value={editingService?.categoryId || ""}
              onChange={(e) =>
                setEditingService((prev) =>
                  prev ? { ...prev, categoryId: e.target.value } : null
                )
              }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={isSubmitting}
            >
                  <option value="">Zgjidh një kategori</option>
                    {flatCategories
                                      .filter(
                                        (category, index, self) =>
                                          self.findIndex((cat) => cat.id === category.id) ===
                                          index
                                      )
                                      .map((category) => (
                                        <option key={category.key} value={category.id}>
                                          {category.name}
                                        </option>
                                      ))}
            </select>
           
           
           {/* kohezgjatja */}

           
            </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                 Kohëzgjatja
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={editingService.duration}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                        duration: e.target.value,
                    })
                  }
                />
              </div>                           

            
            </div>


            {editingService.photos && (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      Foto
    </label>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {editingService.photos.map((photo, index) => (
        <div key={index} className="relative group">
          <img
            src={photo.url}
            alt={`Foto ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg border border-slate-300"
          />
          <button
            type="button"
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              const updatedPhotos = editingService.photos.filter((_, i) => i !== index);
              setEditingService({ ...editingService, photos: updatedPhotos });
            }}
            title="Hiq foton"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Add New Photo Button */}
      <label
        htmlFor="add-photo"
        className="flex items-center justify-center w-full h-40 border-2 border-dashed border-slate-400 rounded-lg cursor-pointer text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
        title="Shto Foto të Re"
      >
        <span className="text-5xl leading-none select-none">+</span>
      </label>
    </div>

    {/* Hidden File Input */}
    <input
      id="add-photo"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
    />
  </div>
)}

          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => {
                setActiveSection("services");
                setEditingService(null);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors"
            >
              Anulo
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Ruaj Ndryshimet
            </button>
          </div>
        </div>


   

      )}
    </section>
  );
};

export default ServicesManagement;
