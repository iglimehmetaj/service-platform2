import React from "react";
import ServiceCard from "./ServiceCard";
import { Search } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  category: { name: string };
  photos: { url: string }[];
  company: { name: string };
  duration: any;
}

interface ServicesCarouselProps {
  services?: Service[];
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  loading?: boolean;
}

const ServicesCarousel: React.FC<ServicesCarouselProps> = ({
  services = [],
  title = "Të gjitha shërbimet",
  showHeader = true,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No services found
        </h3>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {showHeader && (
        <div className="mb-6 px-4 sm:px-8 md:px-12">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 text-left">
            {title}
          </h2>
        </div>
      )}

      <div className="px-4 sm:px-8 md:px-12">
        <Swiper
          modules={[Navigation]}
          navigation={true}
          spaceBetween={20}
          slidesPerView={4}
          slidesPerGroup={4}
          breakpoints={{
            320: { slidesPerView: 1, slidesPerGroup: 1 },
            640: { slidesPerView: 1, slidesPerGroup: 1 },
            768: { slidesPerView: 2, slidesPerGroup: 2 },
            1024: { slidesPerView: 3, slidesPerGroup: 3 },
            1280: { slidesPerView: 4, slidesPerGroup: 4 },
          }}
        >
          {services.map((service) => (
            <SwiperSlide key={service.id}>
              <ServiceCard service={service} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ServicesCarousel;
