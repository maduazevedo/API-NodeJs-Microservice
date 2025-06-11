"use client";

import { useState } from "react";
import ModalComponent from "./ModalComponent";
import InputComponent from "./Input";
import { FiX, FiPlusCircle } from "react-icons/fi";

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newActivity: any) => void;
}

export default function CreateActivityModal({
  isOpen,
  onClose,
  onCreate,
}: CreateActivityModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    type: "",
    isPrivate: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (!form.title || !form.description || !form.scheduledDate || !form.type) {
    console.error("Preencha todos os campos obrigatórios.");
    setIsSubmitting(false);
    return;
  }

  const payload = {
    title: form.title,
    description: form.description,
    type: Number(form.type),
    scheduledDate: form.scheduledDate,
    isPrivate: form.isPrivate.toString(),
  };

  const res = await fetch("http://localhost:3003/activity/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Adiciona o token de autenticação
    },
    body: JSON.stringify(payload),
  });

    if (res.ok) {
      const data = await res.json();
      onCreate(data);
      onClose();
    } else {
      const errorData = await res.json();
      console.error("Erro ao criar:", errorData.error || "Erro desconhecido");
    }

    setIsSubmitting(false);
  };
  if (!isOpen) return null;

  return (
    <ModalComponent isOpen onClose={onClose}>
      <div className="relative">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-2 text-gray-500 hover:text-red-600 cursor-pointer"
          aria-label="Fechar"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-black">
          Criar Atividade
        </h2>

        {/* Linha com Título e Data lado a lado */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <InputComponent
              type="text"
              name="title"
              id="title"
              placeholder="Título"
              value={form.title}
              onChange={handleChange}
              label="Título"
            />
          </div>

          <div className="flex-1">
            <InputComponent
              type="date"
              name="scheduledDate"
              id="scheduledDate"
              placeholder=""
              value={form.scheduledDate}
              onChange={handleChange}
              label="Data Agendada"
            />
          </div>
        </div>

        {/* Select Tipo abaixo (linha inteira) */}
        <div className="mb-6 flex flex-col gap-2">
          <label htmlFor="type" className="text-black">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full text-black px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors duration-300"
          >
            <option value="" disabled>
              Selecione o tipo
            </option>
            <option value="1">Ciclismo</option>
            <option value="2">Corrida</option>
            <option value="3">Natação</option>
            <option value="4">Musculação</option>
            <option value="5">Yoga</option>
          </select>
        </div>

        {/* Descrição (textarea) abaixo */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="description" className="text-black">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full text-black px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors duration-300 resize-none"
          />
        </div>

        {/* Checkbox Privada e botão Criar abaixo */}
        <div className="flex flex-col gap-4">
          <label className="inline-flex items-center gap-2 text-black cursor-pointer">
            <input
              type="checkbox"
              name="isPrivate"
              checked={form.isPrivate}
              onChange={handleChange}
              className="cursor-pointer"
            />
            Privada
          </label>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full p-3 text-white rounded bg-blue-600 hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FiPlusCircle size={18} />
            {isSubmitting ? "Criando..." : "Criar Atividade"}
          </button>
        </div>
      </div>
    </ModalComponent>
  );
}
