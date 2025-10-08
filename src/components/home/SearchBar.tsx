import React, { useEffect, useRef, useState } from "react";
import {
  Home,
  Search,
  Layers,
  ChevronDown,
  MapPin,
  Filter,
} from "lucide-react";
import { cities } from "@/app/help/helper"; // Make sure this path is correct
import { useRouter } from 'next/navigation'; // for Next.js 13 app router

type Category = {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
};

const SearchBar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        const parents = data.filter((cat: Category) => cat.parentId === null);
        parents.forEach((parent: Category) => {
          parent.children = data.filter(
            (c: Category) => c.parentId === parent.id
          );
        });

        setCategories(parents);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        cityRef.current &&
        !cityRef.current.contains(event.target as Node)
      ) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
  setIsSearching(true);
  console.log({ selectedCategoryId, selectedCity });

  // Build query params string
  const params = new URLSearchParams();
  if (selectedCategoryId) params.append('category-id', selectedCategoryId);
  if (selectedCity) params.append('city', selectedCity);

  // Navigate to search page with query params
  router.push(`/search?${params.toString()}`);

  setTimeout(() => {
    setIsSearching(false);
  }, 1500);
};

  const selectedCategoryName = () => {
    if (!selectedCategoryId) return "All Categories";

    for (const main of categories) {
      if (main.id === selectedCategoryId) return main.name;
      if (main.children) {
        const child = main.children.find((c) => c.id === selectedCategoryId);
        if (child) return child.name;
      }
    }
    return "All Categories";
  };

  const selectedCityName = () => {
    if (!selectedCity) return "All Cities";
    return selectedCity;
  };

  return (
    
<div className="relative max-w-6xl mx-auto px-4 py-12 min-h-[80vh] flex flex-col ">
  {/* Top Text Section */}
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
      REZERVO LEHTËSISHT SHËRBIMIN TËND
    </h1>
    <p className="mt-4 text-lg md:text-xl text-black-600 max-w-2xl mx-auto">
   Thjesht, shpejt dhe pa stres!
    </p>
  </div>

      {/* Main search container - Removed overflow-hidden */}
      <div className="relative bg-white/90 backdrop-blur-lg border border-white/20 rounded-2xl ">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Selector */}
            {/* Category Selector */}
<div className="relative" ref={categoryRef}>
  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
    <Filter className="w-4 h-4 text-blue-500" />
    Category
  </label>
  <div className="relative">
    <button
      onClick={() => {
        setIsCategoryOpen((prev) => !prev);
        setIsCityOpen(false); // Close city dropdown if open
      }}
      className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
          <Layers className="w-4 h-4 text-blue-600" />
        </div>
        <span className="font-medium text-gray-700">
          {selectedCategoryName()}
        </span>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
          isCategoryOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {isCategoryOpen && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
        <div className="p-2">
          <button
            onClick={() => {
              setSelectedCategoryId("");
              setIsCategoryOpen(false);
            }}
            className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            All Categories
          </button>

          {categories.map((main) => (
            <div key={main.id}>
              {/* Parent category as a selectable button */}
              <button
                onClick={() => {
                  setSelectedCategoryId(main.id);
                  setIsCategoryOpen(false);
                }}
                className="w-full p-3 text-left hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-semibold bg-gray-50 mt-2"
              >
                {main.name}
              </button>

              {/* Render children indented */}
              {main.children && main.children.length > 0 && (
                <div className="ml-6">
                  {main.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        setSelectedCategoryId(child.id);
                        setIsCategoryOpen(false);
                      }}
                      className="w-full p-3 text-left hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>


            {/* City Selector */}
            <div className="relative" ref={cityRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                Location
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCityOpen((prev) => !prev);
                    setIsCategoryOpen(false); // Close category dropdown if open
                  }}
                  className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <Home className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      {selectedCityName()}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isCityOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCityOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setSelectedCity("");
                          setIsCityOpen(false);
                        }}
                        className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        All Cities
                      </button>
                      {cities.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => {
                            setSelectedCity(city.name);
                            setIsCityOpen(false);
                          }}
                          className="w-full p-3 text-left hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="relative w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative flex items-center justify-center gap-3">
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="font-semibold">Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span className="font-semibold">Search Now</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default SearchBar;