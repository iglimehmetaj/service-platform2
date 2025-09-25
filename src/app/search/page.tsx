'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Star, MapPin, Clock, Heart, Filter, Grid, List, ChevronDown } from 'lucide-react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import Link from "next/link";

// Lazy-load map to avoid SSR issues
const Map = dynamic(() => import('@/components/search/Map'), { ssr: false });

type Service = {
  id: string;
  name: string;
  price: string;
  description?: string;
  photos: { id: string; url: string }[];
  category: {
    id: string;
    name: string;
    parentId?: string | null;
  };
  company: {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    address: string;
  };
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const categoryId = searchParams.get('category-id');

  const [services, setServices] = useState<Service[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/services/search?city=${city || ''}&category-id=${categoryId || ''}`);
        const data = await res.json();
        console.log(data);
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchResults();
  }, [city, categoryId]);

 

  const ServiceCard = ({ service }: { service: Service }) => (
    <Link href={`/services/${service.id}`} className="group block">

    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:scale-[1.02]">
      <div className="relative">
        <img
          src={service.photos[0]?.url || '/placeholder.png'}
          alt={service.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            €{service.price}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {service.name}
            </h3>
            <p className="text-gray-600 text-sm font-medium">{service.company.name}</p>
          </div>
         
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>{service.company.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <Clock className="w-4 h-4" />
          <span>Available today</span>
        </div>
        
        {service.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
        )}
        
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg">
          Book Now
        </button>
      </div>
    </div>
    </Link>
  );

  const ServiceListItem = ({ service }: { service: Service }) => (
    <Link href={`/services/${service.id}`} className="group block">

    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="flex">
        <div className="relative w-32 h-32 flex-shrink-0">
          <img
            src={service.photos[0]?.url || '/placeholder.png'}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

        </div>
        
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm font-medium">{service.company.name}</p>
            </div>
            <div className="text-right">
              
              <span className="text-xl font-bold text-gray-900">€{service.price}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{service.company.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Available today</span>
            </div>
          </div>
          
          {service.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
          )}
          
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:shadow-lg">
            Book Now
          </button>
        </div>
      </div>
    </div>
    </Link>
  );

  return (
    <>
      <Header />
      
      {/* Search Results Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {city ? `Services in ${city}` : 'Search Results'}
              </h1>
              <p className="text-gray-600">
                {services.length} services found
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Nearest</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
          
    
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Services List */}
          <div className="lg:col-span-2">
            {services.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {services.map((service) => (
                  viewMode === 'grid' ? (
                    <ServiceCard key={service.id} service={service} />
                  ) : (
                    <ServiceListItem key={service.id} service={service} />
                  )
                ))}
              </div>
            )}
          </div>

          {/* Right: Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Map View</h3>
                </div>
                <div className="h-96">
                  <Map services={services} />
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