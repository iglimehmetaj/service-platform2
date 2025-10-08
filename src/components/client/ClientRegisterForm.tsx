"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Save, AlertCircle, CheckCircle, Home } from "lucide-react";
import Link from "next/link";

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

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "CLIENT" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error registering client");
      }

      const newUser = await response.json();
      setMessage({ type: "success", text: "Klienti u regjistrua me sukses!" });

      if (onSuccess) onSuccess(newUser);
      setFormData({ name: "", email: "", password: "" });

      // Optional: redirect or do something else after successful register
      // router.push("/client/login");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-blue-100 px-6 py-12 relative">
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        type="button"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-blue-200 overflow-hidden">
        <div className="px-10 py-8">
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-md">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-2">Register Client</h2>
            <p className="text-blue-700 text-base font-medium">Create your client account</p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full pl-14 pr-5 py-4 border border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-400 focus:border-transparent transition duration-300 text-blue-900 placeholder-blue-400 bg-blue-50"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full pl-14 pr-5 py-4 border border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-400 focus:border-transparent transition duration-300 text-blue-900 placeholder-blue-400 bg-blue-50"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock className="h-6 w-6 text-blue-400" />
              </div>
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pl-14 pr-5 py-4 border border-blue-300 rounded-2xl focus:ring-4 focus:ring-blue-400 focus:border-transparent transition duration-300 text-blue-900 placeholder-blue-400 bg-blue-50"
                required
                minLength={6}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white font-extrabold py-4 rounded-2xl hover:from-blue-900 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Register Client</span>
                </>
              )}
            </button>
          </form>

         

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="mt-4 w-full border border-blue-300 text-blue-700 font-semibold py-3 rounded-2xl hover:bg-blue-100 transition duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
