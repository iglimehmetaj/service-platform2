'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Building2, CreditCard, Calendar, DollarSign, Check, X, Plus, Sparkles } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface SubscriptionFormData {
  name: string;
  type: 'REGULAR' | 'SUPERIOR';
  price: number;
  durationInDays: number;
  isActive: boolean;
  companyId: string;
}

const AddSubscriptionForm = () => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    type: 'REGULAR',
    price: 0,
    durationInDays: 30,
    isActive: true,
    companyId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        setError('Failed to load companies');
      }
    };
    fetchCompanies();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

   const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    setFormData({
      name: '',
      type: 'REGULAR',
      price: 0,
      durationInDays: 30,
      isActive: true,
      companyId: '',
    });

    alert('Subscription created successfully');
  } catch (err) {
    setError((err as Error).message);
  } finally {
    setLoading(false);
  }
};

  const getDurationText = (days: number) => {
    if (days === 30) return '1 Month';
    if (days === 90) return '3 Months';
    if (days === 365) return '1 Year';
    return `${days} Days`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Subscription</h1>
            <p className="text-gray-600 text-lg">Design and configure subscription plans for your business</p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Subscription Setup</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span>Review & Activate</span>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <X className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 font-medium">Subscription created successfully!</p>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Subscription Details
            </h2>
            <p className="text-gray-600 mt-1">Configure your subscription plan settings</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Subscription Name */}
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Subscription Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Premium Business Plan"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300"
                  />
                </div>

                {/* Subscription Type */}
                <div className="group">
                  <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subscription Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.type === 'REGULAR' 
                        ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="type"
                        value="REGULAR"
                        checked={formData.type === 'REGULAR'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">Regular</div>
                        <div className="text-sm text-gray-600">Standard features</div>
                      </div>
                      {formData.type === 'REGULAR' && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                    </label>
                    
                    <label className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.type === 'SUPERIOR' 
                        ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-100' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="type"
                        value="SUPERIOR"
                        checked={formData.type === 'SUPERIOR'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">Superior</div>
                        <div className="text-sm text-gray-600">Premium features</div>
                      </div>
                      {formData.type === 'SUPERIOR' && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Company Selection */}
                <div className="group">
                  <label htmlFor="companyId" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-green-600" />
                    Company
                  </label>
                  <select
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300 appearance-none"
                  >
                    <option value="" disabled>Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Price */}
                <div className="group">
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">€</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="group">
                  <label htmlFor="durationInDays" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Duration
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      id="durationInDays"
                      name="durationInDays"
                      value={formData.durationInDays}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="30"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 bg-gray-50 hover:bg-white group-hover:border-gray-300"
                    />
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <strong>Duration:</strong> {getDurationText(formData.durationInDays)}
                    </div>
                  </div>
                </div>

                {/* Active Status */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status
                  </label>
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.isActive 
                      ? 'border-green-500 bg-green-50 ring-4 ring-green-100' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                  }`}>
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Active Subscription</div>
                      <div className="text-sm text-gray-600">
                        {formData.isActive ? 'Available for purchase' : 'Hidden from customers'}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            <strong>Preview:</strong> {formData.name || 'Unnamed Subscription'} • €{formData.price} • {getDurationText(formData.durationInDays)}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFormData({
                name: '',
                type: 'REGULAR',
                price: 0,
                durationInDays: 30,
                isActive: true,
                companyId: '',
              })}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Reset Form
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Subscription
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSubscriptionForm;