"use client";

import { useRouter, usePathname } from "next/navigation";
import { FiList, FiGrid, FiUser, FiLogOut } from "react-icons/fi";

export default function AsideMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Minhas Atividades",
      icon: <FiList className="text-xl" />,
      path: "/Ativity/My",
    },
    {
      label: "Atividades",
      icon: <FiGrid className="text-xl" />,
      path: "/Ativity/All",
    },
    {
      label: "Perfil",
      icon: <FiUser className="text-xl" />,
      path: "/profile",
    },
  ];

  return (
    <aside className="sticky top-20 h-[calc(100vh-80px)] w-60 bg-white shadow-lg rounded-2xl flex flex-col justify-between py-6 px-4 text-gray-800 ml-4">
      {/* Menu principal */}
      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-blue-600 text-white hover:bg-blue-800"
                    : "hover:bg-blue-100"
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Botão de logout */}
      <div>
        <button
          onClick={() => router.push("/login")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-100 text-red-600 transition-all cursor-pointer"
        >
          <FiLogOut className="text-xl" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
