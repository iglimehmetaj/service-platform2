import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  AlertCircle,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import AddCategoryForm from './AddCategoryForm';
import { toast } from 'react-hot-toast';
import { confirmToast } from '@/reusable/ConfirmToast';
import EditCategoryModal from './EditCategoryModal';
import { HashLoader } from 'react-spinners';


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

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string, name: string) => void;
  searchTerm: string;
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
  level?: number;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ 
  categories, 
  onEdit, 
  onDelete, 
  searchTerm,
  expandedItems,
  onToggleExpand,
  level = 0 
}) => {
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {filteredCategories.map((category) => (
        <div key={category.id} className="group">
          <div 
            className={`flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 ${
              level > 0 ? 'ml-6 border-l-4 border-l-blue-200' : ''
            }`}
          >
            <div className="flex items-center space-x-3 flex-1">
              {/* Expand/Collapse Button */}
              {category.children && category.children.length > 0 ? (
                <button
                  onClick={() => onToggleExpand(category.id)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  {expandedItems.has(category.id) ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              ) : (
                <div className="w-6 h-6" />
              )}

              {/* Category Icon */}
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {category.children && category.children.length > 0 ? (
                  expandedItems.has(category.id) ? (
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Folder className="w-5 h-5 text-blue-600" />
                  )
                ) : (
                  <FolderTree className="w-5 h-5 text-blue-600" />
                )}
              </div>

              {/* Category Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-lg">{category.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                  {category._count?.services !== undefined && (
                    <span>{category._count.services} shërbime</span>
                  )}
                  {category._count?.children !== undefined && category._count.children > 0 && (
                    <span>{category._count.children} nënkategori</span>
                  )}
                  {level > 0 && category.parent && (
                    <span className="text-blue-600">← {category.parent.name}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(category)}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edito kategorinë"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(category.id, category.name)}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Fshij kategorinë"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Children Categories */}
          {category.children && 
           category.children.length > 0 && 
           expandedItems.has(category.id) && (
            <div className="mt-2">
              <CategoryTree
                categories={category.children}
                onEdit={onEdit}
                onDelete={onDelete}
                searchTerm={searchTerm}
                expandedItems={expandedItems}
                onToggleExpand={onToggleExpand}
                level={level + 1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', parentId: '' });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Add form state
  const [formData, setFormData] = useState({
    name: '',
    parentId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]); // Flat list for dropdown

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Gabim në marrjen e kategorive");
      const data: Category[] = await res.json();
      
      // Separate root categories and all categories
      const rootCategories = data.filter(cat => !cat.parentId);
      setCategories(rootCategories);
      setAllCategories(data); // Keep flat list for dropdown
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Gabim i panjohur");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

const handleDelete = (id: string, name: string) => {
  confirmToast(
  `Je i sigurt që dëshiron ta fshish kategorinë "${name}"?`,
  async () => {
    await deleteCategory(id, name);
    await fetchCategories();
  }
);
};





const deleteCategory = async (id: string, name: string) => {
  const deleting = toast.loading('Duke fshirë...');

  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || 'Nuk mund të fshihet.');
    }

    toast.success(`Kategoria "${name}" u fshi me sukses.`, { id: deleting });

    // opsionale: rifresko të dhënat
  } catch (error: any) {
    toast.error(`Gabim: ${error.message}`, { id: deleting });
  }
};


 const handleEdit = (category: Category) => {
  setEditingCategory(category);
  setEditFormData({ name: category.name, parentId: category.parentId ?? '' });
};

const handleCloseModal = () => {
  setEditingCategory(null);
  setEditFormData({ name: '', parentId: '' });
  setIsSubmittingEdit(false);
};


const handleSubmitEdit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingCategory) return;

  setIsSubmittingEdit(true);
  try {
    const res = await fetch(`/api/categories/${editingCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFormData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Gabim në editimin e kategorisë');
    }

    toast.success(`Kategoria u përditësua me sukses!`);
    handleCloseModal();
    fetchCategories();
  } catch (error: any) {
    toast.error(`Gabim: ${error.message}`);
    setIsSubmittingEdit(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          parentId: formData.parentId || null
        }),
      });

      if (!response.ok) {
        throw new Error('Gabim në shtimin e kategorisë');
      }

      // Reset form and refresh data
      setFormData({ name: '', parentId: '' });
      setShowAddForm(false);
      await fetchCategories();
      
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Gabim në shtimin e kategorisë');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCategories = allCategories.length;
  const rootCategories = categories.length;
  const subCategories = totalCategories - rootCategories;

  

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
            <h1 className="text-3xl font-bold text-slate-800">Kategoritë</h1>
            <p className="text-slate-600 mt-1">Menaxho kategoritë e shërbimeve</p>
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

 if (showAddForm) {
  return (
    <AddCategoryForm
      formData={formData}
      setFormData={setFormData}
      isSubmitting={isSubmitting}
      allCategories={allCategories}
      onCancel={() => setShowAddForm(false)}
      onSubmit={handleSubmit}
    />
  );
}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Kategoritë</h1>
          <p className="text-slate-600 mt-1">Menaxho kategoritë e shërbimeve në strukturë hierarkike</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Shto Kategori</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Kërko kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderTree className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Kategori</p>
              <p className="text-2xl font-bold text-slate-800">{totalCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Kategori Kryesore</p>
              <p className="text-2xl font-bold text-slate-800">{rootCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Nënkategori</p>
              <p className="text-2xl font-bold text-slate-800">{subCategories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Tree */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <FolderTree className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {searchTerm ? "Nuk u gjetën rezultate" : "Nuk ka kategori"}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm 
              ? `Nuk ka kategori që përputhen me "${searchTerm}"`
              : "Nuk ka kategori për të shfaqur aktualisht."
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Kategorinë e Parë</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {searchTerm ? `${categories.length} rezultate për "${searchTerm}"` : `${totalCategories} kategori gjithsej`}
            </p>
            <button
              onClick={() => setExpandedItems(new Set(allCategories.map(c => c.id)))}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Hap të gjitha
            </button>
          </div>
          
          <CategoryTree
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchTerm={searchTerm}
            expandedItems={expandedItems}
            onToggleExpand={handleToggleExpand}
          />
        </div>
      )}

    <EditCategoryModal
  editingCategory={editingCategory}
  onClose={handleCloseModal}
  allCategories={allCategories}
  formData={editFormData}
  setFormData={setEditFormData}
  isSubmitting={isSubmittingEdit}
  onSubmit={handleSubmitEdit}
/>
    </div>

    
  );
}