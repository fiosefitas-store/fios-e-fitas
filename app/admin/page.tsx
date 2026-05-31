"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import ProductTab from "./ProductTab";
import SpecialTab from "./SpecialTab";

import produtosBase from "@/data/produtos.json";
import HomeTab from "./HomeTab";

export type Tab = "dashboard" | "produtos" | "sazonais" | "destaques";

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  subcategoria?: string;
  imagem: string;
  cores: string[];
  corImagens?: Record<string, string>;
  tamanhos: string[];
  tamanhosCm?: Record<string, string>;
  materiais: string[];
  destaque: boolean;
  ativo: boolean;
  personalizado: boolean;
  prazoProducao: string;
  avaliacoes: number;
  vendas: number;
  colecaoEspecial?: string | null;
}

export interface Colecao {
  id: string;
  titulo: string;
  capa?: string | null;
  produtoIds: string[];
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("produtos");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [sazonais, setSazonais] = useState<Colecao[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");

    if (auth !== "true") {
      router.push("/admin");
      return;
    }

    const saved = localStorage.getItem("admin_produtos");

    if (saved) {
      setProdutos(JSON.parse(saved));
    } else {
      setProdutos(produtosBase as Produto[]);
    }

    const savedSaz = localStorage.getItem("admin_sazonais");

    if (savedSaz) {
      setSazonais(JSON.parse(savedSaz));
    }
  }, [router]);

  const saveProdutos = (updated: Produto[]) => {
    setProdutos(updated);
    localStorage.setItem("admin_produtos", JSON.stringify(updated));
  };

  const saveSazonais = (updated: Colecao[]) => {
    setSazonais(updated);
    localStorage.setItem("admin_sazonais", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {activeTab === "dashboard" && (
        <HomeTab
          produtos={produtos}
          sazonais={sazonais}
        />
      )}

      <Dashboard activeTab={activeTab}>
        {activeTab === "dashboard" && <div>Dashboard Content</div>}

        {activeTab === "produtos" && (
          <ProductTab
            produtos={produtos}
            saveProdutos={saveProdutos}
          />
        )}

        {(activeTab === "sazonais" || activeTab === "destaques") && (
          <SpecialTab
            activeTab={activeTab}
            produtos={produtos}
            saveProdutos={saveProdutos}
            sazonais={sazonais}
            saveSazonais={saveSazonais}
          />
        )}
      </Dashboard>
    </div>
  );
}