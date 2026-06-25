"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";
import Dashboard from "@/components/admin/Dashboard";
import ProductTab from "@/components/admin/products/ProductTab";
import SpecialTab from "@/components/admin/SpecialTab";
import HomeTab from "@/components/admin/HomeTab";
import FavoriteTab from "@/components/admin/FavoriteTab";

import produtosBase from "@/data/produtos.json";

export type Tab = "home" | "produtos" | "sazonais" | "destaques";

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  subcategoria?: string;
  imagem: string;

  cores: {
    nome: string;
    imagem?: string | null;
    file?: File;
    preview?: string;
  }[];

  tamanhos: {
    nome: string;
    cm: string;
  }[];
  materiais: string[];
  avaliacoes: number;
  reviewsCount?: number;
  destaque: boolean;
  ativo: boolean;
  personalizado: boolean;
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

  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [sazonais, setSazonais] = useState<Colecao[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const auth = localStorage.getItem("adminAuth");

    if (auth !== "true") {
      router.push("/admin");
      return;
    }

    const saved = localStorage.getItem("admin_produtos");

    if (saved) {
      try {
        setProdutos(JSON.parse(saved));
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setProdutos(produtosBase as Produto[]);
      }
    } else {
      setProdutos(produtosBase as Produto[]);
    }

    const savedSaz = localStorage.getItem("admin_sazonais");

    if (savedSaz) {
      try {
        const parsed = JSON.parse(savedSaz);

        if (Array.isArray(parsed)) {
          setSazonais(parsed as Colecao[]);
        } else {
          console.warn("Invalid admin_sazonais in localStorage, clearing it");
          localStorage.removeItem("admin_sazonais");
          setSazonais([]);
        }
      } catch (error) {
        console.error("Erro ao carregar sazonais:", error);
      }
    }

    setLoading(false);
  }, [router]);

  const saveProdutos = (updated: Produto[]) => {
    setProdutos(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin_produtos", JSON.stringify(updated));
      } catch (error) {
        console.error("Erro ao salvar produtos no localStorage:", error);
        // localStorage cheio ou indisponível - continuar mesmo assim
      }
    }
  };

  const saveSazonais = (updated: Colecao[]) => {
    setSazonais(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin_sazonais", JSON.stringify(updated));
      } catch (error) {
        console.error("Erro ao salvar sazonais no localStorage:", error);
        // localStorage cheio ou indisponível - continuar mesmo assim
      }
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminAuth");
    }
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <Dashboard activeTab={activeTab}>
        {activeTab === "home" && (
          <HomeTab
            produtos={produtos}
            sazonais={sazonais}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "produtos" && (
          <ProductTab
            produtos={produtos}
            saveProdutos={saveProdutos}
          />
        )}

        {activeTab === "sazonais" && (
          <SpecialTab
            produtos={produtos}
            sazonais={sazonais}
            saveProdutos={saveProdutos}
            saveSazonais={saveSazonais}
          />
        )}

        {activeTab === "destaques" && (
          <FavoriteTab
            produtos={produtos}
            saveProdutos={saveProdutos}
          />
        )}
      </Dashboard>
    </div>
  );
}