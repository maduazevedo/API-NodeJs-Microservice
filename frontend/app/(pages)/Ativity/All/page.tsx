"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import AsideMenu from "@/app/components/AsideMenu";
import MainContent from "@/app/components/MainContent";
import CardComponent from "@/app/components/Card";

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

const activityTypeMap: Record<number, { name: string; color: string }> = {
  1: { name: "Ciclismo", color: "bg-blue-100 text-blue-800" },
  2: { name: "Corrida", color: "bg-green-100 text-green-800" },
  3: { name: "Natação", color: "bg-purple-100 text-purple-800" },
  4: { name: "Musculação", color: "bg-yellow-100 text-yellow-800" },
  5: { name: "Yoga", color: "bg-pink-100 text-pink-800" },
};

export default function Home({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/activities?sort=${sortOrder}&types=${selectedTypes.join(",")}`
      );
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [sortOrder]);

  const handleTypeToggle = (type: number) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const isTypeSelected = (type: number) =>
    selectedTypes.length === 0 || selectedTypes.includes(type);

  const filteredActivities = activities.filter((act) =>
    isTypeSelected(act.type)
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="flex pt-20 gap-4">
        <AsideMenu />
        <MainContent title="Atividades">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTypes([])}
                className={`px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 ${
                  selectedTypes.length === 0
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Todas
              </button>
              {Object.entries(activityTypeMap).map(([key, { name }]) => {
                const type = parseInt(key);
                const isSelected = selectedTypes.includes(type);

                return (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <p>Carregando atividades...</p>
          ) : filteredActivities.length === 0 ? (
            <p>Nenhuma atividade encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredActivities.map((act) => (
                <CardComponent
                  key={act.id}
                  activity={act}
                  userId={userId}
                  onParticipate={() => {}}
                />
              ))}
            </div>
          )}
        </MainContent>
      </main>
    </div>
  );
}
