"use client";

import { useState } from "react";
import InputComponent from "@/app/components/Input";
import { Button } from "@/app/components/Button";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("COLOCAR URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar.");
      }

      const data = await response.json();
      console.log("Cadastro realizado:", data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <main
      className="min-h-dvh bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-1/2 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Crie sua conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <InputComponent
              type="text"
              placeholder="John Doe"
              label="Nome"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />

            <InputComponent
              type="text"
              maxLength={11}
              placeholder="123.123.123-12"
              label="Cpf"
              id="cpf"
              name="cpf"
              required
              value={formData.cpf}
              onChange={handleChange}
            />
          </div>

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

          <InputComponent
            type="password"
            placeholder="••••••••"
            label="Confirme sua senha"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md transition-all duration-300"
          >
            Criar conta
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
