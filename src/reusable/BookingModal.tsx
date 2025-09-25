"use client";

import React, { useEffect, useState, useCallback } from "react";
import ReactModal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BookingModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  serviceId: string; 
}

interface BookedSlot {
  startTime: string;
  endTime: string | null;
}

export default function BookingModal({ isOpen, onRequestClose, serviceId }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    ReactModal.setAppElement("body");
  }, []);

  // Fetch booked time slots when modal opens
  useEffect(() => {
    if (isOpen && serviceId) {
      fetchBookedSlots();
    }
  }, [isOpen, serviceId]);

  const fetchBookedSlots = async () => {
    setFetchingSlots(true);
    try {
      const res = await fetch(`/api/appointments/booked?serviceId=${serviceId}`);
      if (res.ok) {
        const data = await res.json();
        setBookedSlots(data);
      }
    } catch (error) {
      console.error("Failed to fetch booked slots:", error);
    } finally {
      setFetchingSlots(false);
    }
  };

const isTimeSlotBooked = useCallback((time: Date) => {
  return bookedSlots.some(slot => {
    // Convert API UTC times to local time
    const startTime = new Date(slot.startTime);
    const endTime = slot.endTime ? new Date(slot.endTime) : null;

    const localStartTime = new Date(startTime.getTime() + startTime.getTimezoneOffset() * 60000);
    const localEndTime = endTime
      ? new Date(endTime.getTime() + endTime.getTimezoneOffset() * 60000)
      : new Date(localStartTime.getTime() + 60 * 60000); // default 1h if no endTime

    // Calculate service duration
    const serviceDurationMs = localEndTime.getTime() - localStartTime.getTime();

    // The potential booking must *not* overlap any part of the booked slot
    // So, time + duration must not fall into the range [start, end)
    const potentialEndTime = new Date(time.getTime() + serviceDurationMs);

    return (
      potentialEndTime > localStartTime && time < localEndTime
    );
  });
}, [bookedSlots]);


  // Function to apply class names to time slots
  const getTimeClassName = useCallback((time: Date) => {
    const isBooked = isTimeSlotBooked(time);
    return isBooked 
      ? "react-datepicker__time-list-item--disabled bg-red-100 text-red-700 cursor-not-allowed" 
      : "bg-green-100 text-green-700 cursor-pointer";
  }, [isTimeSlotBooked]);

  const handleBooking = async () => {
    if (!selectedDate) {
    toast.error("Please select a date and time.");

      return;
    }

    if (isTimeSlotBooked(selectedDate)) {
    toast.error("This time slot is already booked. Please select another time.");

      return;
    }

    if (!session) {
      router.push("/auth/client/login");
      return;
    }

    setLoading(true);
    try {
      const localDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
      
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          startTime: localDate.toISOString(),
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
            toast.error(`Error: ${data.error || "Something went wrong"}`);
        
        return;
      }

          toast.success("Appointment created successfully!");
      
      onRequestClose();
    } catch (err) {
      console.error(err);

          toast.error("Failed to create appointment.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Book Service"
      className="relative w-full max-w-lg mx-auto mt-20 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30 outline-none transform transition-all duration-300 scale-100"
      overlayClassName="fixed inset-0 bg-black/60 flex justify-center items-center z-50 transition-opacity duration-300"
    >
      {/* Close Button */}
      <button
        onClick={onRequestClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
          Book Your Service
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Select a date and time that works for you.
        </p>
        {fetchingSlots && (
          <p className="text-sm text-blue-500 mb-2">Loading availability...</p>
        )}
      </div>

      {/* Date Picker */}
      <div className="flex justify-center">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="MMMM d, yyyy h:mm aa"
          inline
          filterTime={(time) => !isTimeSlotBooked(time)}
          calendarClassName="rounded-xl shadow-lg border border-gray-200 bg-white/95 backdrop-blur-md custom-datepicker"
          dayClassName={(date) => {
            const baseClasses = "text-sm rounded-md transition-colors";
            // Check if any time on this day is booked
            const hasBookedSlots = bookedSlots.some(slot => {
              const slotDate = new Date(slot.startTime);
              const localSlotDate = new Date(slotDate.getTime() + slotDate.getTimezoneOffset() * 60000);
              return localSlotDate.toDateString() === date.toDateString();
            });
            
            if (date.getDay() === 0) return `${baseClasses} text-red-500`;
            if (hasBookedSlots) return `${baseClasses} bg-red-50`;
            return `${baseClasses} hover:bg-blue-100`;
          }}
          timeClassName={getTimeClassName}
        />
      </div>

      {/* Note */}
      <div className="mt-4">
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          Note (optional)
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a note for the appointment..."
          className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
        />
      </div>

      {/* Selected Time Display */}
      {selectedDate && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Selected: {selectedDate.toLocaleString()}
          {isTimeSlotBooked(selectedDate) && (
            <span className="text-red-600 font-medium"> - This time slot is booked</span>
          )}
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-4 flex justify-center items-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 border border-green-300 mr-1"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 border border-red-300 mr-1"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={onRequestClose}
          className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-100 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleBooking}
          disabled={loading || !selectedDate || isTimeSlotBooked(selectedDate)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </ReactModal>
  );
}