"use client";

import { Star } from "lucide-react";
import { Produto } from "../../app/admin/dashboard/page";
import { productsService } from "@/app/services/productsService";

interface Props {
  produtos: Produto[];
  saveProdutos: (produtos: Produto[]) => void;
}

export default function FavoriteTab({
  produtos,
  saveProdutos,
}: Props) {
  const destaques = produtos.filter(
    (p) => p.destaque
  );

  const handleToggleDestaque = async (id: string) => {
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;

    const updated = {
      ...produto,
      destaque: !produto.destaque,
    };

    // UI imediata
    saveProdutos(
      produtos.map((p) => (p.id === id ? updated : p))
    );

    try {
      await productsService.update(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h2 className="text-2xl font-bold text-[#3D261D]">
          Destaques
        </h2>

        <p className="mt-1 text-sm text-[#A67C6D]">
          Escolha até 8 produtos para
          aparecerem na seção de destaques da
          loja.
        </p>

        <div className="mt-4">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              destaques.length >= 8
                ? "bg-[#FFF3ED] text-primary"
                : "bg-bg-section text-[#A67C6D]"
            }`}
          >
            <Star
              size={14}
              className={
                destaques.length > 0
                  ? "fill-current"
                  : ""
              }
            />
            {destaques.length}/8 produtos
            destacados
          </span>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${
              produto.destaque
                ? "border-primary"
                : "border-transparent"
            }`}
            style={{
              boxShadow: "var(--shadow-card)",
            }}
            onClick={() => {
              if (
                !produto.destaque &&
                destaques.length >= 8
              ) {
                alert(
                  "Máximo de 8 destaques atingido."
                );

                return;
              }

              handleToggleDestaque(
                produto.id
              );
            }}
          >
            <div className="aspect-square bg-bg-section">
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#3D261D] line-clamp-2">
                    {produto.nome}
                  </h3>

                  <p className="text-sm text-[#A67C6D] mt-1">
                    {produto.categoria}
                  </p>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    produto.destaque
                      ? "bg-primary text-white"
                      : "bg-bg-section text-[#A67C6D]"
                  }`}
                >
                  <Star
                    size={14}
                    className={
                      produto.destaque
                        ? "fill-white"
                        : ""
                    }
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-primary">
                  R${" "}
                  {produto.preco.toFixed(2)}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    produto.ativo
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {produto.ativo
                    ? "Ativo"
                    : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}