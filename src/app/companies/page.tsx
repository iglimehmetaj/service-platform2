"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

interface Company {
  id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  // Fetch companies data from the API
  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await fetch('/api/companies');
      const data: Company[] = await res.json();
      if(data){
      console.log(data);
      }else {
        console.log("error")
      }
      setCompanies(data);
    };

    fetchCompanies();
  }, []);

  return (
    <div>
      <Header />  {/* Your header component */}
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold text-center mb-8">Our Companies</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
                <Link href={`/companies/${company.id}`}>
                    <div className="text-center cursor-pointer">
                      <h2 className="text-xl font-semibold text-gray-800">{company.name}</h2>
                      <p className="text-gray-500">{company.location}</p>
                      <p className="text-gray-600 mt-2">{company.description.slice(0, 100)}...</p>
                      <div className="mt-4 text-blue-500">View More</div>
                    </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />  {/* Your footer component */}
    </div>
  );
};

export default Companies;
