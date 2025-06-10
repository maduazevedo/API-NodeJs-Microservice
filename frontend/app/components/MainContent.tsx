"use client";

import { ReactNode } from "react";

interface MainContentProps {
  title?: string;
  children: ReactNode;
}

export default function MainContent({ title, children }: MainContentProps) {
  return (
    <main className="flex-1 min-h-screen ">
      <div className="bg-white rounded-2xl shadow-md p-6 text-black">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
        {children}
      </div>
    </main>
  );
}
