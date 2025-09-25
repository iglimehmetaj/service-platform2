//src\app\services\[id]\page.tsx


import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, MapPin, Clock, Users, Heart, Share2 } from "lucide-react";
import BookingModalClient from "@/reusable/BookingModalClient";
import ServiceMapWrapper from "@/components/home/ServiceMapWrapper";
import Header from "@/components/home/Header";
interface Service {
  company: any;
  id: string;
  name: string;
  description: string;
  price: string;
  photos: { url: string }[];
  companyName: string;
  category: { name: string };
  duration:any;
}

async function getService(id: string): Promise<Service | null> {
  const baseUrl = "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/services/${id}`, {
    next: { revalidate: 60 },
  });


  if (!res.ok) return null;

  return res.json();
}

export default async function ServiceDetailsPage(props: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = await props.params; // ✅ Await the params safely

  const service = await getService(id);
  if (!service) return notFound();

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative">
        {service.photos[0]?.url && (
          <div className="relative w-full h-[60vh] overflow-hidden">
            <img
              src={service.photos[0].url}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Action buttons overlay */}
            <div className="absolute top-6 right-6 flex gap-3">
              <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        )}
      </div>

      <main className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {service.category.name}
                    </span>
                  
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {service.name}-{service.company.name}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{service.company.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{service.price}</span>
                  <span className="text-lg text-gray-600">LEK</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Starting price</p>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">About this service</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {service.description}
                  </p>
                </div>
              </div>


            {service.company.latitude && service.company.longitude && (
  <ServiceMapWrapper
    latitude={Number(service.company.latitude)}
    longitude={Number(service.company.longitude)}
    companyName={service.company.name}
    address={service.company.address || ""}
  />
)}
           


          
              
            </div>

          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Book your appointment</h3>
                  <p className="text-gray-600 text-sm">Choose your preferred date and time</p>
                </div>
                
              

                <BookingModalClient serviceId={service.id} />
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500">
                    Free cancellation up to 24 hours before your appointment
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
      </main>

      
    </div>
    </>
  );
}