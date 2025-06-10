"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut } from "react-icons/fi";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    router.push("/login");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-black to-blue-900 bg-clip-text text-transparent font-montserrat">
          Activity
        </div>
      </div>
    </header>
  );
}
