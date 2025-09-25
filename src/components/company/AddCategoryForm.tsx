// components/AddCategoryForm.tsx

import { ArrowLeft, Save } from "lucide-react";
import React from "react";

type CategoryWithParentName = {
  id: string;
  name: string;
  parent?: {
    name: string;
  } | null;
};

interface Props {
  formData: {
    name: string;
    parentId: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; parentId: string }>>;
  isSubmitting: boolean;
  allCategories: CategoryWithParentName[];
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AddCategoryForm: React.FC<Props> = ({
  formData,
  setFormData,
  isSubmitting,
  allCategories,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Shto Kategori të Re</h1>
          <p className="text-slate-600 mt-1">Krijo një kategori të re për shërbimet</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Emri i Kategorisë *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="p.sh. Kujdesi për Flokët"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kategoria Prind (Opsionale)
            </label>
            <select
              value={formData.parentId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, parentId: e.target.value }))
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isSubmitting}
            >
              <option value="">-- Kategori Kryesore --</option>
              {allCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.parent ? `${category.parent.name} → ${category.name}` : category.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-slate-500">
              Zgjedh një kategori prind nëse kjo kategori është një nënkategori
            </p>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Anulo
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span>Ruaj Kategorinë</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryForm;
