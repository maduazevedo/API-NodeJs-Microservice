"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/app/components/Header";
import AsideMenu from "@/app/components/AsideMenu";
import MainContent from "@/app/components/MainContent";
import { FiEdit, FiSave, FiCamera, FiX } from "react-icons/fi";

interface User {
  avatar: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token não encontrado.");
      return;
    }

    setIsLoading(true);
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
      .then((data) => {
        setUser(data);
        setTempUser(data);
        if (data.avatar) {
          setProfileImage(data.avatar);
        }
      })
      .catch((err) => console.error("Erro ao buscar usuário:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setTempUser(user);
    setProfileImage(user?.avatar || null);
  };

  const handleSaveClick = () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    fetch("http://localhost:3002/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...tempUser,
        avatar: profileImage,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Falha ao atualizar usuário");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setEditMode(false);
      })
      .catch((err) => console.error("Erro ao atualizar usuário:", err))
      .finally(() => setIsLoading(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (tempUser) {
      setTempUser({
        ...tempUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="flex pt-20 gap-4">
        <AsideMenu />
        <MainContent title="Perfil">
          <div className="text-gray-800 flex flex-col items-center space-y-6">
            <div className="w-full mt-0 flex justify-end items-center">
              {!editMode ? (
                <button
                  onClick={handleEditClick}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiEdit size={18} />
                  Editar Perfil
                </button>
              ) : (
                <div className="flex gap-10">
                  <button
                    onClick={handleCancelClick}
                    className="flex items-center cursor-pointer  px-4 py-2 text-gray-800 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <FiX size={18} />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveClick}
                    disabled={isLoading}
                    className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70"
                  >
                    <FiSave size={18} />
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-8  w-full ">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden shadow-lg">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sem foto
                        </div>
                      )}
                    </div>
                    {editMode && (
                      <>
                        <button
                          onClick={triggerFileInput}
                          className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                        >
                          <FiCamera size={20} />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  {isLoading && !user ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : user ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">
                          Nome
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="name"
                            value={tempUser?.name || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        ) : (
                          <p className="text-lg text-gray-800">{user.name}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">
                          Email
                        </label>
                        {editMode ? (
                          <input
                            type="email"
                            name="email"
                            value={tempUser?.email || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        ) : (
                          <p className="text-lg text-gray-800">{user.email}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">
                          CPF
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="cpf"
                            value={tempUser?.cpf || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        ) : (
                          <p className="text-lg text-gray-800">{user.cpf}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">
                          Senha
                        </label>
                        {editMode ? (
                          <input
                            type="password"
                            name="password"
                            value={tempUser?.password || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="Digite sua nova senha"
                          />
                        ) : (
                          <p className="text-lg text-gray-800">••••••••</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">
                      Erro ao carregar dados do usuário.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </MainContent>
      </main>
    </div>
  );
}
