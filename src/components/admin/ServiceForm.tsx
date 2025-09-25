"use client";

import React, { useRef } from "react";
import { Save, Upload, X } from "lucide-react";

interface ServiceFormData {
  name: string;
  description?: string;
  price: string;
  categoryId: string;
  photos: string[];
  duration: string; 
}

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
}

interface Props {
  serviceForm: ServiceFormData;
  setServiceForm: React.Dispatch<React.SetStateAction<ServiceFormData>>;
  categories: Category[];
  isSubmitting: boolean;
  editingService: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<Props> = ({
  serviceForm,
  setServiceForm,
  categories,
  isSubmitting,
  editingService,
  onSubmit,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

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

      setServiceForm((prev) => ({
        ...prev,
        photos: [...prev.photos, data.url],
      }));
    } catch (err) {
      console.error(err);
      alert("Ngarkimi i fotos dështoi. Ju lutemi provoni përsëri.");
    }
  };

  const removePhoto = (index: number) => {
    setServiceForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">
              {editingService ? "Edito Shërbimin" : "Shto Shërbim të Ri"}
            </h1>
            <p className="text-slate-600 mt-2">
              {editingService
                ? "Përditëso të dhënat e shërbimit"
                : "Plotëso të dhënat për të shtuar një shërbim të ri"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Emri */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emri i Shërbimit *
                </label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Emri"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Përshkrimi */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Përshkrimi
                </label>
                <textarea
                  value={serviceForm.description || ""}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Përshkruaj shërbimin..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* Çmimi dhe Kategoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Çmimi (Lekë) *
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={serviceForm.price}
                    onChange={(e) =>
                      setServiceForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                   
                    required
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kategoria
                  </label>
                  <select
                    value={serviceForm.categoryId}
                    required
                    onChange={(e) =>
                      setServiceForm((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <option value="">Zgjedh kategorinë (opsionale)</option>
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
                </div>


                {/* Kohezgjatja*/}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kohëzgjatja
                  </label>
                  <input
                    type="text"
                   
                    value={serviceForm.duration}
                    onChange={(e) =>
                      setServiceForm((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                   
                    required
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Fotot */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fotot e Shërbimit
                </label>
                <div className="space-y-3">
                  {serviceForm.photos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {serviceForm.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f1f5f9'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%2394a3b8'%3EFoto%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            disabled={isSubmitting}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                    disabled={isSubmitting}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Shto Foto nga Pajisja</span>
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    disabled={isSubmitting}
                  />

                  <p className="text-sm text-slate-500">
                    Mund të shtosh disa foto për shërbimin tënd
                  </p>
                </div>
              </div>

              {/* Butonat */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 font-medium"
                  disabled={isSubmitting}
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Po ruhet...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>
                        {editingService ? "Përditëso" : "Ruaj"} Shërbimin
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServiceForm;
