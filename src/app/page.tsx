"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLoginClick = () => {
  router.push("/login");
};

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 shadow-md bg-white">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          {/* Replace with your logo */}
          <img src="/logo.png" alt="Logo" className="h-8" />
        </div>

        <button
          onClick={handleLoginClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </header>

      {/* Banner with search and 4 sections */}
      <section className="bg-gray-100 p-8">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <input
            type="search"
            placeholder="Search services..."
            className="w-full p-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Four Sections */}
        
      </section>

      {/* Services Section */}
      <section className="flex-grow p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Our Services</h2>

        {/* Example list/grid of services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {["Service A", "Service B", "Service C", "Service D", "Service E"].map((service, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2">{service}</h3>
              <p className="text-gray-600">Brief description of {service.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
