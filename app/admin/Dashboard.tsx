"use client";

import { ReactNode } from "react";
import { Tab } from "./page";

interface Props {
  activeTab: Tab;
  children: ReactNode;
}

export default function Dashboard({
  activeTab,
  children,
}: Props) {
  return (
    <main className="flex-1 bg-bg overflow-auto">
      <div className="bg-white border-b border-[#F2E8E1] px-8 py-5">
        <h2 className="text-2xl font-bold text-[#3D261D]">
          {activeTab === "produtos"
            ? "Produtos"
            : activeTab === "sazonais"
            ? "Sazonais"
            : "Destaques"}
        </h2>
      </div>

      <div className="p-8">
        {children}
      </div>
    </main>
  );
}