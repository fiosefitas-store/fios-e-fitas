"use client";

import { Produto, Colecao, Tab } from "./Dashboard";
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#3D261D]">
              Home
            </h1>

            <p className="mt-1 text-[#A67C6D] hidden md:block">
              Visão geral da administração da loja.
            </p>
          </div>

          {/* Linha apenas no mobile */}
          <div className="block md:hidden border-t border-[#ffd2ba] my-4 py-1" />

          <div className="flex justify-center gap-8 md:gap-3">
            <button
              onClick={() => setActiveTab("produtos")}
              className="flex flex-col items-center gap-2 md:flex-row"
            >
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white md:w-auto md:h-auto md:rounded-full md:px-5 md:py-2.5">
                <Package size={18} />
                <span className="hidden md:inline ml-2 font-bold text-sm">
                  Produtos
                </span>
              </div>

              <span className="text-[11px] font-medium text-[#3D261D] md:hidden">
                Produtos
              </span>
            </button>

            <button
              onClick={() => setActiveTab("sazonais")}
              className="flex flex-col items-center gap-2 md:flex-row"
            >
              <div className="w-11 h-11 rounded-full bg-[#3D261D] flex items-center justify-center text-white md:w-auto md:h-auto md:rounded-full md:px-5 md:py-2.5">
                <Tag size={18} />
                <span className="hidden md:inline ml-2 font-bold text-sm">
                  Sazonais
                </span>
              </div>

              <span className="text-[11px] font-medium text-[#3D261D] md:hidden">
                Sazonais
              </span>
            </button>

            <button
              onClick={() => setActiveTab("destaques")}
              className="flex flex-col items-center gap-2 md:flex-row"
            >
              <div className="w-11 h-11 rounded-full bg-[#A67C6D] flex items-center justify-center text-white md:w-auto md:h-auto md:rounded-full md:px-5 md:py-2.5">
                <Star size={18} />
                <span className="hidden md:inline ml-2 font-bold text-sm">
                  Destaques
                </span>
              </div>

              <span className="text-[11px] font-medium text-[#3D261D] md:hidden">
                Destaques
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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
          label="Produtos Destaque"
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
              className="text-sm font-medium text-primary flex items-center gap-1"
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
                      ? "border-b border-bg-section"
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

                  <span className="font-semibold text-primary">
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
              className="text-sm font-medium text-primary flex items-center gap-1"
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
                      ? "border-b border-bg-section"
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
                    className="text-primary"
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
      className="bg-white rounded-2xl p-4 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-[#A67C6D] leading-tight">
            {label}
          </p>

          <h3 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-[#3D261D]">
            {value}
          </h3>
        </div>

        <div className="hidden md:flex w-12 h-12 rounded-xl bg-[#FFF3ED] items-center justify-center">
          <Icon
            size={22}
            className="text-primary"
          />
        </div>
      </div>
    </div>
  );
}