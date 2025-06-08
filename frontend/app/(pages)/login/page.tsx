"use client";

import { useState } from "react";
import InputComponent from "@/app/components/Input";
import { Button } from "@/app/components/Button";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("COLOCAR URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login.");
      }

      const data = await response.json();
      console.log("Login bem-sucedido:", data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <main
      className="min-h-dvh p-4 flex items-center justify-center"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-md bg-white backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Bem-vindo</h1>
          <p className="text-blue-100 mt-1">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <InputComponent
            type="email"
            placeholder="seu@email.com"
            label="Email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <InputComponent
            type="password"
            placeholder="••••••••"
            label="Senha"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md transition-all duration-300"
          >
            Entrar
          </Button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
