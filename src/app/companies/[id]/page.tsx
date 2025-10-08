import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Phone, Mail, LocateIcon } from "lucide-react";
import ContactOptions from "@/reusable/ContactOptions";
import ServiceMapWrapper from "@/components/home/ServiceMapWrapper";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: number;
  categoryId: string;
}

interface Company {
  id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  services: Service[];
}

async function getCompany(id: string): Promise<Company | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/${id}/full`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function CompanyPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const company = await getCompany(id);
  console.log(company);
  if (!company) {
    notFound();
  }

  const formatPrice = (price: string) => `${price} €`;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ""}` : `${minutes}m`;
  };

  return (
    <>
    <Header/>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center shadow-md">
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={96}
                  height={96}
                  className="rounded-2xl object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                  {company.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {company.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{company.location}</span>
                </div>
                {company.address && (
                  <div className="flex items-center space-x-1">
                    <LocateIcon className="w-4 h-4" />
                    <span>{company.address}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{company.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-3 mt-4 md:mt-0 items-center">
              <ContactOptions phone={company.phone} />
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Shërbimet ({company.services.length})
                </h2>
              </div>


              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {company.services.map((service) => (
                      <div
                        key={service.id}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {service.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {service.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {formatPrice(service.price)}
                            </span>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {formatDuration(service.duration)}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                            I disponueshëm
                          </span>
                          <Link
          href={`/services/${service.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Zgjidh
        </Link>
                        </div>
                      </div>
                      ))}
              </div>

            </div>

            {/* Description + Map Section */}
            {(company.description || (company.latitude && company.longitude)) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {company.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{company.description}</p>
                )}

                {company.latitude && company.longitude && (
                  <ServiceMapWrapper
                    latitude={Number(company.latitude)}
                    longitude={Number(company.longitude)}
                    companyName={company.name}
                    address={company.address || ""}
                  />
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Kontakt</h3>
              <div className="space-y-3">
                {company.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{company.phone}</span>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{company.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {company.address || company.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Orari i Punës</h3>
              <div className="space-y-2 text-sm">
                {["E Hënë - E Premte", "E Shtunë", "E Diel"].map((day) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{day}</span>
                    <span className="text-gray-900 dark:text-white">08:00 - 20:00</span>
                  </div>
                ))}
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>

  );
}
