import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, Heart } from "lucide-react";

interface ServiceCardProps {
  service: {
    duration: any;
    id: string;
    name: string;
    description: string;
    price: string;
    category: { name: string };
    photos: { url: string }[];
    company: { name: string };
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link href={`/services/${service.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative">
        {/* Image Container */}
        <div className="relative w-full h-56 overflow-hidden">
          <img
            src={service.photos[0]?.url || "/images/defaultimage.jpg"}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-blue/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full shadow-sm">
              {service.category.name}
            </span>
          </div>
          
         
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {service.name}
          </h3>
          
          {/* Company info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{service.company.name}</span>
          </div>
          
          {/* Duration and capacity */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{service.duration} min</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>1 person</span>
          </div>
          
          {/* Price and booking */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">{service.price}</span>
              <span className="text-sm text-gray-600">LEK</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              Book Now
            </div>
          </div>
        </div>

        {/* Hover effect border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default ServiceCard;