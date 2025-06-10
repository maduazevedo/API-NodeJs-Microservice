"use client";

import { useState } from "react";
import ModalComponent from "./ModalComponent";
import {
  FaTimes,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaHashtag,
} from "react-icons/fa";

interface Activity {
  id: string;
  title: string;
  description: string;
  confirmationCode: string;
  scheduledDate: string;
  createdAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  isPrivate: boolean;
  creatorId: string;
  type: number;
}

interface CardComponentProps {
  activity: Activity;
  userId: string;
  onParticipate?: (activityId: string) => void;
}

const activityTypeMap: Record<number, { name: string; color: string }> = {
  1: { name: "Ciclismo", color: "bg-blue-100 text-blue-800" },
  2: { name: "Corrida", color: "bg-green-100 text-green-800" },
  3: { name: "Natação", color: "bg-cyan-100 text-cyan-800" },
  4: { name: "Musculação", color: "bg-yellow-100 text-yellow-800" },
  5: { name: "Yoga", color: "bg-pink-100 text-pink-800" },
};

export default function CardComponent({
  activity,
  userId,
  onParticipate,
}: CardComponentProps) {
  const [open, setOpen] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const createdAt = formatDate(activity.createdAt);
  const activityType = activityTypeMap[activity.type] || {
    name: "Atividade",
    color: "bg-gray-100 text-gray-800",
  };

  const handleParticipate = async () => {
    setIsParticipating(true);

    try {
      //url de participação da atividade
      const response = await fetch("COLOCAR URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, activityId: activity.id }),
      });

      if (!response.ok) {
        console.error("Erro ao registrar participação");
        setIsParticipating(false);
        return;
      }

      if (onParticipate) {
        onParticipate(activity.id);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      setIsParticipating(false);
    }
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3
              onClick={() => setOpen(true)}
              className="text-base font-medium text-gray-900 line-clamp-1 cursor-pointer hover:text-blue-600"
            >
              {activity.title}
            </h3>
            {activity.isPrivate && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                Privado
              </span>
            )}
          </div>

          <p
            onClick={() => setOpen(true)}
            className="text-sm text-gray-500 line-clamp-2 mb-2 cursor-pointer"
          >
            {activity.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span>{createdAt}</span>
            <span className={`px-2 py-0.5 rounded-full ${activityType.color}`}>
              {activityType.name}
            </span>
          </div>

          <button
            onClick={handleParticipate}
            disabled={isParticipating}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2
              bg-blue-700 hover:bg-blue-900 transition-colors ${
                isParticipating
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
          >
            <FaCheckCircle
              className={`transition-colors ${
                isParticipating ? "text-green-300" : "text-white "
              }`}
            />
            {isParticipating ? "Participando ✓" : "Participar"}
          </button>
        </div>
      </div>

      <ModalComponent isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${activityType.color}`}
                >
                  {activityType.name}
                </span>
                {activity.isPrivate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    PRIVADO
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {activity.title}
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Fechar modal"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <div className="prose max-w-none text-gray-700">
            {activity.description.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <FaCalendarAlt className="mr-2 text-gray-400" />
                Criado em: {formatDate(activity.createdAt)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FaClock className="mr-2 text-gray-400" />
                Agendado para: {formatDate(activity.scheduledDate)}
              </div>
            </div>
            <div className="space-y-2">
              {activity.completedAt && (
                <div className="flex items-center text-sm text-green-600">
                  <FaCheckCircle className="mr-2" />
                  Concluído em: {formatDate(activity.completedAt)}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <FaHashtag className="mr-2 text-gray-400" />
                Código: {activity.confirmationCode}
              </div>
            </div>
          </div>

          <button
            onClick={handleParticipate}
            disabled={isParticipating}
            className={`mt-6 w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2
              bg-blue-700 hover:bg-blue-900 transition-colors ${
                isParticipating
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
          >
            <FaCheckCircle
              className={`transition-colors ${
                isParticipating
                  ? "text-green-300"
                  : "text-white group-hover:text-red-500"
              }`}
            />
            {isParticipating
              ? "Você está participando desta atividade ✓"
              : "Participar"}
          </button>
        </div>
      </ModalComponent>
    </>
  );
}
