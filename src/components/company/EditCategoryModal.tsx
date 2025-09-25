import React from "react";
import { ArrowLeft, Save, X } from "lucide-react";

type CategoryWithParentName = {
  id: string;
  name: string;
  parent?: { name: string } | null;
};

interface Props {
  editingCategory: CategoryWithParentName | null;
  isSubmitting: boolean;
  formData: { name: string; parentId: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; parentId: string }>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  allCategories: CategoryWithParentName[];
}

const EditCategoryModal: React.FC<Props> = ({
  editingCategory,
  isSubmitting,
  formData,
  setFormData,
  onClose,
  onSubmit,
  allCategories,
}) => {
  if (!editingCategory) return null;

  return (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Edito Kategorinë</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Emri i Kategorisë *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Emri i kategorisë"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Kategoria Prind (Opsionale)</label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isSubmitting}
            >
              <option value="">-- Kategori Kryesore --</option>
              {allCategories
                .filter((cat) => cat.id !== editingCategory.id) // mos e lejojmë veten prind
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.parent ? `${category.parent.name} → ${category.name}` : category.name}
                  </option>
                ))}
            </select>
            <p className="mt-2 text-sm text-slate-500">
              Zgjedh një kategori prind nëse kjo kategori është një nënkategori
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Po ruhet...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Ruaj Ndryshimet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
