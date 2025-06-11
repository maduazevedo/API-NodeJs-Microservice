"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InputComponent from "@/app/components/Input";
import { Button } from "@/app/components/Button";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

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
    const response = await fetch("http://localhost:3001/auth/register", {
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

    router.push("/login"); // Redireciona após o sucesso
  } catch (error) {
    console.error("Erro:", error);
  }
};


  return (
    <main className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-700">Cadastro</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="12312312312"
              label="CPF"
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
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:opacity-90 transition"
          >
            Criar conta
          </Button>

          <div className="text-center text-sm text-gray-600 mt-4">
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
