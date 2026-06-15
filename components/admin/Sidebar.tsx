"use client";

import {
  LayoutDashboard,
  Package,
  Tag,
  Star,
  LogOut,
} from "lucide-react";

import { Tab } from "../../app/admin/dashboard/page";

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
}: Props) {
  const sidebar = [
    {
      key: "home",
      icon: LayoutDashboard,
      label: "Home",
    },
    {
      key: "produtos",
      icon: Package,
      label: "Produtos",
    },
    {
      key: "sazonais",
      icon: Tag,
      label: "Sazonais",
    },
    {
      key: "destaques",
      icon: Star,
      label: "Destaques",
    },
  ] as const;

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-[#3D261D]">
      <div className="px-6 py-8">
        <h1
          className="text-2xl font-bold text-[#FAC9A8] mb-1"
          style={{ fontFamily: "var(--font-logo)" }}
        >
          Fios e Fitas
        </h1>

        <p className="text-[#A67C6D] text-xs">
          Painel Admin
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">

        {sidebar.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === key
                ? "bg-primary text-white"
                : "text-[#C9A898] hover:bg-white/10 hover:text-[#FAC9A8]"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#C9A898] hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}