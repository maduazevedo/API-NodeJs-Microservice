"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import AsideMenu from "@/app/components/AsideMenu";
import MainContent from "@/app/components/MainContent";
import MyActivityCardComponent from "@/app/components/CardMyAtivity";
import CreateActivityModal from "@/app/components/CreateActivityModal";

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

export default function MyActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<"all" | "done" | "todo">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchActivities() {

    const token = localStorage.getItem("token"); 

    try {
      const res = await fetch("http://localhost:3003/activity/user/creator/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adiciona o token de autenticação
        }
    });
      const data = await res.json();
      setActivities(data);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    } finally {
      setLoading(false);
    }
  }
  // 🔄 Buscar atividades do backend
  useEffect(() => {
    
    fetchActivities();
  }, []);

  // ➕ Criar nova atividade
async function handleCreate(newActivity: Activity) {
    try {
      setLoading(true);
      await fetchActivities(); // Recarrega do backend
    } catch (error) {
      console.error("Erro ao atualizar lista de atividades:", error);
    } finally {
      setLoading(false);
    }
  }

  // ❌ Excluir atividade
  async function handleDelete(id: string) {
    try {
      await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });

      setActivities((prev) => prev.filter((act) => act.id !== id));
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
    }
  }

  const filtered = activities.filter(
    (act) =>
      filter === "all" ||
      (filter === "done" && act.completedAt) ||
      (filter === "todo" && !act.completedAt)
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="flex pt-20 gap-4">
        <AsideMenu />
        <MainContent title="Minhas Atividades">
          <div className="flex justify-between mb-4">
            <div className="space-x-2">
              {["all", "todo", "done"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-full cursor-pointer transition ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {f === "all"
                    ? "Todas"
                    : f === "todo"
                    ? "Não concluídas"
                    : "Concluídas"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Criar Atividade
            </button>
          </div>

          {loading ? (
            <p>Carregando atividades...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((a) => (
                <MyActivityCardComponent
                  key={a.id}
                  activity={a}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </MainContent>
      </main>

      <CreateActivityModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
