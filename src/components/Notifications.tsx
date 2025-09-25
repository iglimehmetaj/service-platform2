"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

 const { data: session } = useSession();
 
 useEffect(() => {
  if (!session?.user?.id) return; // Wait until session is ready

  // Fetch existing notifications
  fetch("/api/notifications")
    .then((res) => res.json())
    .then((data) => {
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    });

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });

  const channelName = `private-user-${session.user.id}`;
  const channel = pusher.subscribe(channelName);

  channel.bind("new-notification", (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((count) => count + 1);
  });

  return () => {
    channel.unbind_all();
    pusher.unsubscribe(channelName);
    pusher.disconnect();
  };
}, [session]);


  const markAsRead = async (id: string) => {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2"
      >
        <Bell className="w-5 h-5 text-slate-400" />
        {unreadCount > 0 && (
          <span className="text-sm text-red-600 font-bold">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white border rounded shadow-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b cursor-pointer ${
                  n.read ? "bg-gray-100" : "bg-white font-semibold"
                }`}
                onClick={() => markAsRead(n.id)}
              >
                <p>{n.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
