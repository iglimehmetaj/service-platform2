"use client";

import ServicesCarousel from "@/components/home/ServicesCarousel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import Header from "@/components/home/Header";
import SearchBar from "@/components/home/SearchBar";
import Footer from "@/components/home/Footer";

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

export default function HomePage() {

    const [services, setServices] = useState<Service[]>([]);


  const router = useRouter();




  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/all"); // Fetch data from your API
        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
    <Header/>

      {/* Banner with search and 4 sections */}
      <section >
    
       <SearchBar/>

     
        
      </section>

           <ServicesCarousel services={services} />
            <br/>
            <br/>
            <br/>
           <Footer/>

    </div>
  );
}
