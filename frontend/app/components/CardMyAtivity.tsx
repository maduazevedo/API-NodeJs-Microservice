"use client";

import { useEffect, useState } from "react";
import ModalComponent from "./ModalComponent";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaHashtag,
  FaTrash,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";

interface Participant {
  id: string;
  name: string;
  email: string;
}

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

interface MyActivityCardComponentProps {
  activity: Activity;
  onDelete?: (activityId: string) => void;
}

const activityTypeMap: Record<number, { name: string; color: string }> = {
  1: { name: "Ciclismo", color: "bg-blue-100 text-blue-800" },
  2: { name: "Corrida", color: "bg-green-100 text-green-800" },
  3: { name: "Natação", color: "bg-cyan-100 text-cyan-800" },
  4: { name: "Musculação", color: "bg-yellow-100 text-yellow-800" },
  5: { name: "Yoga", color: "bg-pink-100 text-pink-800" },
};

// Hook para formatar datas somente no cliente
function useClientDateFormat(dateString: string) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    if (!dateString) return;
    const date = new Date(dateString);
    setFormattedDate(
      date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  }, [dateString]);

  return formattedDate;
}

export default function MyActivityCardComponent({
  activity,
  onDelete,
}: MyActivityCardComponentProps) {
  const [open, setOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [localActivity, setLocalActivity] = useState<Activity>(activity); // controle local

  // Usar hook para formatar datas só no cliente
  const createdAt = useClientDateFormat(localActivity.createdAt);
  const scheduledDate = useClientDateFormat(localActivity.scheduledDate);
  const completedAt = localActivity.completedAt
    ? useClientDateFormat(localActivity.completedAt)
    : null;

  const activityType = activityTypeMap[localActivity.type] || {
    name: "Atividade",
    color: "bg-gray-100 text-gray-800",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (open) {
      fetch("http://localhost:3003/activity/user/creator", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data: Activity[]) => {
          console.log("Atividades criadas pelo usuário:", data);
          // Você pode implementar lógica para pegar participantes aqui se precisar
        })
        .catch((err) =>
          console.error("Erro ao carregar atividades criadas pelo usuário", err)
        );
    }
  }, [open]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    setIsDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:3003/activity/${localActivity.id}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Erro ao excluir atividade");
      if (onDelete) onDelete(localActivity.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleComplete = async () => {
    const token = localStorage.getItem("token");
    setIsCompleting(true);
    try {
      const res = await fetch(
        `http://localhost:3003/activity/${localActivity.id}/conclude`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Erro ao concluir atividade");

      const updatedActivity = await res.json();
      setLocalActivity(updatedActivity);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCompleting(false);
    }
  };

  const cardBorder = localActivity.completedAt
    ? "border-green-500"
    : "border-gray-100";

  const cardBackground = localActivity.completedAt ? "bg-green-50" : "bg-white";

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-lg border ${cardBorder} ${cardBackground} shadow-sm transition-all duration-200 hover:shadow-md`}
      >
        {localActivity.completedAt && (
          <div
            className="absolute top-2 right-2 text-green-600"
            title="Atividade concluída"
          >
            <FaCheckCircle size={24} />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center mb-1 gap-2">
            <h3
              onClick={() => setOpen(true)}
              className="text-base font-medium text-gray-900 line-clamp-1 cursor-pointer hover:text-blue-600"
            >
              {localActivity.title}
            </h3>
            {localActivity.isPrivate && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                Privado
              </span>
            )}
          </div>

          <p
            onClick={() => setOpen(true)}
            className="text-sm text-gray-500 line-clamp-2 mb-2 cursor-pointer"
          >
            {(localActivity.description || "").split("\n").map((p, i) => (
              <span key={i}>
                {p}
                <br />
              </span>
            ))}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span>{createdAt || "..."}</span>
            <span className={`px-2 py-0.5 rounded-full ${activityType.color}`}>
              {activityType.name}
            </span>
          </div>
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
                {localActivity.isPrivate && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    PRIVADO
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {localActivity.title}
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
            {(localActivity.description || "").split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <FaCalendarAlt className="mr-2 text-gray-400" />
                Criado em: {createdAt || "..."}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FaClock className="mr-2 text-gray-400" />
                Agendado para: {scheduledDate || "..."}
              </div>
            </div>
            <div className="space-y-2">
              {completedAt && (
                <div className="flex items-center text-sm text-green-600">
                  <FaCheckCircle className="mr-2" />
                  Concluído em: {completedAt}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <FaHashtag className="mr-2 text-gray-400" />
                Código: {localActivity.confirmationCode}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Participantes ({participants.length})
            </h4>
            <ul className="space-y-1 max-h-40 overflow-y-auto">
              {participants.length > 0 ? (
                participants.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <FaUser className="text-gray-400" />
                    <span className="font-semibold">{p.name}</span> — {p.email}
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Nenhum participante registrado.
                </p>
              )}
            </ul>
          </div>

          {!localActivity.completedAt && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2
                bg-green-600 hover:bg-green-700 transition-colors ${
                  isCompleting
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
            >
              <FaCheckCircle />
              {isCompleting ? "Concluindo..." : "Concluir atividade"}
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`mt-4 w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2
              bg-red-600 hover:bg-red-700 transition-colors ${
                isDeleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
          >
            <FaTrash />
            {isDeleting ? "Excluindo..." : "Excluir atividade"}
          </button>
        </div>
      </ModalComponent>
    </>
  );
}
