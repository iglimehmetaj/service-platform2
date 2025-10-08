import React from "react";
import Image from "next/image";

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
    <a href={`/services/${service.id}`} className="group block max-w-md mx-auto">
      <div
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 relative w-full"
        style={{ minWidth: "320px", maxWidth: "400px" }}
      >
        {/* Image */}
        <div className="relative w-full h-60 overflow-hidden">
          <Image
  src={service.photos[0]?.url || "/images/defaultimage.jpg"}
  alt={service.name}
  layout="fill"
  objectFit="cover"
  className="transition-transform duration-[2000ms] ease-in-out group-hover:scale-110"
  priority
/>
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-sm">
              {service.category.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2">
            {service.name}
          </h3>
          <div className="text-sm text-gray-600">{service.company.name}</div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{service.duration} min</span>
            <span>1 person</span>
          </div>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-lg font-bold text-gray-900">{service.price}</span>
            <span className="text-sm text-gray-600">LEK</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ServiceCard;
