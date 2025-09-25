// components/Header.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import Image from "next/image";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
console.log(session);
  const handleLoginClick = () => {
    const currentPath = window.location.pathname;
    // router.push(`/auth/client/login?callbackUrl=${currentPath}`);
    router.push(`/auth/signin`);

  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      <div
        className="flex items-center font-bold cursor-pointer pl-40 "
        onClick={() => router.push("/")}
      >
       <Image
          src="/images/logo.png"
  alt="Logo"
  width={100}
  height={100}
  className="object-contain" // Keep aspect ratio
          />
      </div>

      {session ? (
        session.user.role === "CLIENT" ? (
          <Link href="/client/dashboard">
            <div className="cursor-pointer flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              <UserIcon className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-800">
                {session.user.name}
              </span>
            </div>
          </Link>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        )
      ) : (
        <button
          onClick={handleLoginClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      )}
    </header>
  );
};

export default Header;
