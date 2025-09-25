"use client";

import { useState } from "react";
import { User, Mail, Lock, Save, AlertCircle, CheckCircle } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface ClientRegisterFormProps {
  onSuccess?: (newUser: any) => void;
  onCancel?: () => void;
}

export default function ClientRegisterForm({ onSuccess, onCancel }: ClientRegisterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // POST to your /api/users route (make sure it accepts client creation)
      const response = await fetch("/api/user-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "CLIENT" }), // role fixed as CLIENT
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error registering client");
      }

      const newUser = await response.json();
      setMessage({ type: "success", text: "Klienti u regjistrua me sukses!" });

      if (onSuccess) onSuccess(newUser);

      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Një gabim i panjohur ndodhi",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message) setMessage(null);
  };

  return (
    <div className="max-w-md mx-auto">
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <p className={`${message.type === "success" ? "text-green-800" : "text-red-800"}`}>
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Emri i Plotë *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white"
              placeholder="Shkruaj emrin e plotë"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white"
              placeholder="Shkruaj email-in"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Fjalëkalimi *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white"
              placeholder="Shkruaj fjalëkalimin"
              required
              minLength={6}
              disabled={isSubmitting}
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">Fjalëkalimi duhet të ketë të paktën 6 karaktere</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
            >
              Anulo
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Regjistrohet...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Regjistro Klientin</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
