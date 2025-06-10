"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputComponent from "@/app/components/Input";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import Logo from "@/app/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Email ou senha incorretos.");
        return;
      }

      const data = await response.json();
      console.log("Login realizado com sucesso:", data);

      localStorage.setItem("token", data.token);
      router.push("/Ativity/My");
    } catch (error) {
      console.error("Erro na requisição:", error);
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="p-6 flex flex-col items-center gap-2">
          <Logo />
          <h2 className="text-xl font-semibold text-gray-700 mt-1">Login</h2>
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

          {error && (
            <p className="text-red-600 text-sm text-center -mt-4">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:opacity-90 transition"
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
