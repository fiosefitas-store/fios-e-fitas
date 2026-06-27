"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/admin/Sidebar";
import ProductTab from "@/components/admin/products/ProductTab";
import SpecialTab from "@/components/admin/SpecialTab";
import HomeTab from "@/components/admin/HomeTab";
import FavoriteTab from "@/components/admin/FavoriteTab";
import DashboardLayout from "./DashboardLayout";

// 🚀 IMPORTAÇÃO DO SERVICE DO BANCO DE DADOS (Substituindo o JSON antigo)
import { productsService } from "@/app/api/services/productsService";

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
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega todos os dados sincronizados em tempo real direto do banco/API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") {
      router.push("/admin");
      return;
    }

    const carregarDadosDoBanco = async () => {
      try {
        // 1. Busca os produtos direto da API vinculada ao banco de dados
        const dadosProdutos = await productsService.getAll();
        setProdutos(dadosProdutos);

        // 2. Busca as coleções direto do seu endpoint route.ts
        const resSazonais = await fetch("/api/admin/sazonal");
        if (resSazonais.ok) {
          const dadosSazonais = await resSazonais.json();
          setSazonais(Array.isArray(dadosSazonais) ? dadosSazonais : []);
        }
      } catch (error) {
        console.error("Erro ao sincronizar dados do banco no painel:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDoBanco();
  }, [router]);

  // Mantido a assinatura das funções para não quebrar as heranças e os contratos das Abas (Tabs)
  const saveProdutos = (updated: Produto[]) => {
    setProdutos(updated);
  };

  const saveSazonais = (updated: Colecao[]) => {
    setSazonais(updated);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminAuth");
    }
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-pulse text-[#3D261D] font-semibold text-base">
          Sincronizando painel com o banco de dados...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <DashboardLayout>
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
      </DashboardLayout>
    </div>
  );
}