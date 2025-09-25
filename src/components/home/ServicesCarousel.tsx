import React from "react";
import ServiceCard from "./ServiceCard";
import { Grid, List, Filter, Search } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  category: { name: string };
  photos: { url: string }[];
  company: { name: string };
  duration:any
}

interface ServicesGridProps {
  services: Service[];
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ 
  services, 
  title = "Available Services",
  subtitle = "Discover and book professional services near you",
  showHeader = true 
}) => {
  return (
    <div className="w-full">
      {/* Header Section */}
      {showHeader && (
        <div className="mb-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Title and subtitle */}
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>

            
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No services found
              </h3>
              
            </div>
          )}
        </div>
      </div>

      {/* Load more section */}
      {services.length > 0 && services.length >= 12 && (
        <div className="text-center mt-12 px-4">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Load More Services
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesGrid;