'use client';

import { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

interface ContactOptionsProps {
  phone: string;
}

export default function ContactOptions({ phone }: ContactOptionsProps) {
  const [open, setOpen] = useState(false);

  const phoneNumber = phone.replace(/\s+/g, ''); // Remove spaces

  return (
    <div className="relative inline-block">
      {/* Main Button */}
      <button
        onClick={() => setOpen(!open)}
        className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/30 px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Kontakto
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md z-50">
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
          >
            <Phone className="w-4 h-4 mr-2" />
            Thirrje telefonike
          </a>
          <a
            href={`https://wa.me/${phoneNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat në WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
