"use client";

import { useRouter } from "next/navigation";

export default function LoginChoicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Login as</h1>

      <div className="flex space-x-6">
        <button
          onClick={() => router.push("/company/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Company
        </button>

        <button
          onClick={() => router.push("/client/login")}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Client
        </button>
      </div>

      <p className="mt-8 text-gray-500">
        Superadmin access only via <code>/admin/login</code>
      </p>
    </div>
  );
}
