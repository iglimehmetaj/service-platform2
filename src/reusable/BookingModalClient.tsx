// src/reusable/BookingModalClient.tsx

"use client";

import { useState } from "react";
import BookingModal from "@/reusable/BookingModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BookingModalClientProps {
  serviceId: string;
}

export default function BookingModalClient({ serviceId }: BookingModalClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
    console.log(session)
const handleOpenModal = () => {
  if (
    (!session || session.user.role !== "CLIENT") &&
    status !== "loading"
  ) {
    const currentPath = window.location.pathname;
    router.push(`/auth/client/login?callbackUrl=${currentPath}`);
    return;
  }

  setIsOpen(true);
};


  return (
    <>
      <button
        onClick={handleOpenModal}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Rezervo Tani
      </button>

      <BookingModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        serviceId={serviceId} // ✅ pass serviceId to the modal
      />
    </>
  );
}
