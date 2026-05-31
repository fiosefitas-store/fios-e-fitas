"use client";

import { Produto, Colecao, Tab } from "./page";
import {
  Package,
  Tag,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface Props {
  produtos: Produto[];
  sazonais: Colecao[];
  setActiveTab: (tab: Tab) => void;
}

export default function HomeTab({
  produtos,
  sazonais,
  setActiveTab,
}: Props) {
  const ativos = produtos.filter((p) => p.ativo).length;
  const destaques = produtos.filter((p) => p.destaque).length;

  const ultimosProdutos = produtos
    .slice()
    .reverse()
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#3D261D]">
              Home
            </h1>

            <p className="mt-1 text-[#A67C6D]">
              Visão geral da administração da loja.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("produtos")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white"
              style={{ background: "#F4845F" }}
            >
              <Package size={16} />
              Produtos
            </button>

            <button
              onClick={() => setActiveTab("sazonais")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-[#3D261D]"
            >
              <Tag size={16} />
              Sazonais
            </button>

            <button
              onClick={() => setActiveTab("destaques")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-[#A67C6D]"
            >
              <Star size={16} />
              Destaques
            </button>
          </div>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Package}
          label="Produtos"
          value={produtos.length}
        />

        <StatCard
          icon={CheckCircle}
          label="Produtos Ativos"
          value={ativos}
        />

        <StatCard
          icon={Star}
          label="Produtos em Destaque"
          value={destaques}
        />

        <StatCard
          icon={Tag}
          label="Coleções"
          value={sazonais.length}
        />
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* ÚLTIMOS PRODUTOS */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#F2E8E1]">
            <h3 className="text-lg font-semibold text-[#3D261D]">
              Últimos Produtos
            </h3>

            <button
              onClick={() => setActiveTab("produtos")}
              className="text-sm font-medium text-[#F4845F] flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={14} />
            </button>
          </div>

          <div>
            {ultimosProdutos.length === 0 ? (
              <div className="p-6 text-[#A67C6D]">
                Nenhum produto encontrado.
              </div>
            ) : (
              ultimosProdutos.map((produto, index) => (
                <div
                  key={produto.id}
                  className={`flex items-center gap-4 px-6 py-4 ${
                    index !== ultimosProdutos.length - 1
                      ? "border-b border-[#F9F3EF]"
                      : ""
                  }`}
                >
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#3D261D] truncate">
                      {produto.nome}
                    </p>

                    <p className="text-sm text-[#A67C6D]">
                      {produto.categoria}
                    </p>
                  </div>

                  <span className="font-semibold text-[#F4845F]">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLEÇÕES */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#F2E8E1]">
            <h3 className="text-lg font-semibold text-[#3D261D]">
              Coleções Sazonais
            </h3>

            <button
              onClick={() => setActiveTab("sazonais")}
              className="text-sm font-medium text-[#F4845F] flex items-center gap-1"
            >
              Gerenciar
              <ArrowRight size={14} />
            </button>
          </div>

          {sazonais.length === 0 ? (
            <div className="p-6 text-[#A67C6D]">
              Nenhuma coleção cadastrada.
            </div>
          ) : (
            <div>
              {sazonais.map((colecao, index) => (
                <div
                  key={colecao.id}
                  className={`flex items-center justify-between px-6 py-4 ${
                    index !== sazonais.length - 1
                      ? "border-b border-[#F9F3EF]"
                      : ""
                  }`}
                >
                  <div>
                    <p className="font-medium text-[#3D261D]">
                      {colecao.titulo}
                    </p>

                    <p className="text-sm text-[#A67C6D]">
                      {colecao.produtoIds.length} produtos
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("sazonais")}
                    className="text-[#F4845F]"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#A67C6D]">
            {label}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-[#3D261D]">
            {value}
          </h3>
        </div>

        <div className="w-12 h-12 rounded-xl bg-[#FFF3ED] flex items-center justify-center">
          <Icon
            size={22}
            className="text-[#F4845F]"
          />
        </div>
      </div>
    </div>
  );
}