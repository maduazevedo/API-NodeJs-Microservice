"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import AsideMenu from "@/app/components/AsideMenu";
import MainContent from "@/app/components/MainContent";

interface User {
  avatar: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token não encontrado.");
    return;
  }

  fetch("http://localhost:3002/user", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Não autorizado");
      }
      return res.json();
    })
    .then((data) => setUser(data))
    .catch((err) => console.error("Erro ao buscar usuário:", err));
}, []);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="flex pt-20 gap-4">
        <AsideMenu />
        <MainContent>
          <div className="text-gray-800 flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>

            <div className="bg-gray-100 rounded-xl p-6 shadow-sm w-full max-w-md flex flex-col items-center space-y-6">
              <img
                //src="/avatar-default.png"
                alt=""
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />

              {user ? (
                <div className="space-y-4 w-full">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Nome</label>
                    <p className="text-base text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-base text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">CPF</label>
                    <p className="text-base text-gray-800">{user.cpf}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Senha</label>
                    <p className="text-base text-gray-800">{user.password}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Carregando dados...</p>
              )}
            </div>
          </div>
        </MainContent>
      </main>
    </div>
  );
}