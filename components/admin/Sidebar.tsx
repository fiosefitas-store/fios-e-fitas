"use client";

import {
  LayoutDashboard,
  Package,
  Tag,
  Star,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { Tab } from "./Dashboard";

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  isOpen,
  setIsOpen,
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
    <>
      {/* Botão abrir */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-[#3D261D] text-white p-2 rounded-xl shadow-lg"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Fundo */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          z-50
          h-screen
          w-64
          bg-[#3D261D]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-white/10">
          <div>
            <h1
              className="text-2xl font-bold text-[#FAC9A8]"
              style={{ fontFamily: "var(--font-logo)" }}
            >
              Fios e Fitas
            </h1>

            <p className="text-xs text-[#A67C6D]">
              Painel Admin
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-[#FAC9A8]"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebar.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === key
                  ? "bg-primary text-white"
                  : "text-[#C9A898] hover:bg-white/10 hover:text-[#FAC9A8]"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Rodapé */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#C9A898] hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}