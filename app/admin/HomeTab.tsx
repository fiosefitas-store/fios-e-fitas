"use client";

import { Produto, Colecao } from "./page";
import {
  Package,
  Tag,
  Star,
  CheckCircle,
} from "lucide-react";

interface Props {
  produtos: Produto[];
  sazonais: Colecao[];
}

export default function HomeTab({
  produtos,
  sazonais,
}: Props) {
  const ativos = produtos.filter(
    (p) => p.ativo
  ).length;

  const destaques = produtos.filter(
    (p) => p.destaque
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card
          icon={Package}
          label="Produtos"
          value={produtos.length}
        />

        <Card
          icon={CheckCircle}
          label="Produtos Ativos"
          value={ativos}
        />

        <Card
          icon={Star}
          label="Destaques"
          value={destaques}
        />

        <Card
          icon={Tag}
          label="Coleções"
          value={sazonais.length}
        />
      </div>

      <div
        className="bg-white rounded-2xl p-6"
        style={{
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h3 className="text-lg font-semibold mb-4 text-[#3D261D]">
          Últimos Produtos
        </h3>

        <div className="space-y-3">
          {produtos
            .slice(-5)
            .reverse()
            .map((produto) => (
              <div
                key={produto.id}
                className="flex items-center gap-4"
              >
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-12 h-12 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium text-[#3D261D]">
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
            ))}
        </div>
      </div>

      <div
        className="bg-white rounded-2xl p-6"
        style={{
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h3 className="text-lg font-semibold mb-4 text-[#3D261D]">
          Coleções Sazonais
        </h3>

        <div className="space-y-2">
          {sazonais.length === 0 ? (
            <p className="text-[#A67C6D]">
              Nenhuma coleção cadastrada.
            </p>
          ) : (
            sazonais.map((colecao) => (
              <div
                key={colecao.id}
                className="flex justify-between py-2 border-b border-[#F2E8E1]"
              >
                <span>{colecao.titulo}</span>

                <span className="text-[#A67C6D] text-sm">
                  {colecao.produtoIds.length} produtos
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Card({
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
      className="bg-white rounded-2xl p-5"
      style={{
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center justify-between">
        <Icon
          size={22}
          className="text-primary"
        />

        <span className="text-2xl font-bold text-[#3D261D]">
          {value}
        </span>
      </div>

      <p className="mt-3 text-sm text-[#A67C6D]">
        {label}
      </p>
    </div>
  );
}