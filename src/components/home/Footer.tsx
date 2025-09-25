// /Footer.jsx

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-600">
        
        {/* Logo Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
             <Image
                      src="/images/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain" // Keep aspect ratio
                      />
          </div>
          <p className="text-gray-500">Leading platform for beauty and wellness bookings.</p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600 transition">About Us</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Careers</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Blog</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Press</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600 transition">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Cancellations</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Services</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-600 transition">Hair & Beauty</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Wellness & Spa</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Fitness</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Massage</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-400 py-4 border-t border-gray-200">
        &copy; {new Date().getFullYear()} MyCompany. All rights reserved.
      </div>
    </footer>
  );
}
