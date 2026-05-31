"use client";

import { useState } from "react";

import {
  Plus,
  Edit2,
  Trash2,
  Star,
} from "lucide-react";

import {
  Produto,
  Colecao,
  Tab,
} from "./page";

interface Props {
  activeTab: Tab;

  produtos: Produto[];
  saveProdutos: (p: Produto[]) => void;

  sazonais: Colecao[];
  saveSazonais: (c: Colecao[]) => void;
}

export default function SpecialTab({
  activeTab,
  produtos,
  saveProdutos,
  sazonais,
  saveSazonais,
}: Props) {
  const [editSaz, setEditSaz] =
    useState<Colecao | null>(null);

  const [isSazModalOpen, setIsSazModalOpen] =
    useState(false);

  const destaques = produtos.filter(
    (p) => p.destaque
  );

  const handleToggleDestaque = (id: string) => {
    saveProdutos(
      produtos.map((p) =>
        p.id === id
          ? { ...p, destaque: !p.destaque }
          : p
      )
    );
  };

  if (activeTab === "destaques") {
    return (
      <div>
        <p className="text-[#A67C6D] mb-6 text-sm">
          {destaques.length}/8 produtos marcados
          como destaque.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className={`bg-white rounded-2xl overflow-hidden cursor-pointer border-2 ${
                produto.destaque
                  ? "border-[#F4845F]"
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
                    "Maximo de 8 destaques atingido."
                  );

                  return;
                }

                handleToggleDestaque(produto.id);
              }}
            >
              <div className="aspect-square">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-[#3D261D]">
                  {produto.nome}
                </span>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    produto.destaque
                      ? "bg-[#F4845F] text-white"
                      : "bg-[#F2E8E1] text-[#A67C6D]"
                  }`}
                >
                  <Star
                    size={12}
                    className={
                      produto.destaque
                        ? "fill-white"
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#3D261D]">
            Coleções Especiais
          </h3>

          <p className="text-[#A67C6D] text-sm">
            Coleções sazonais exibidas como
            categorias especiais.
          </p>
        </div>

        <button
          onClick={() => {
            setEditSaz({
              id: `saz-${Date.now()}`,
              titulo: "",
              capa: null,
              produtoIds: [],
            });

            setIsSazModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white"
          style={{ background: "#F4845F" }}
        >
          <Plus size={14} />
          Nova Coleção
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sazonais.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-4"
            style={{
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="aspect-[3/2] mb-3 bg-[#F9F3EF] rounded-lg overflow-hidden">
              {c.capa ? (
                <img
                  src={c.capa}
                  alt={c.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#A67C6D]">
                  Sem capa
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#3D261D]">
                  {c.titulo || "Sem título"}
                </h4>

                <p className="text-sm text-[#A67C6D]">
                  {c.produtoIds.length} produto
                  {c.produtoIds.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditSaz({ ...c });
                    setIsSazModalOpen(true);
                  }}
                  className="p-2"
                >
                  <Edit2 size={15} />
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Remover esta colecao?"
                      )
                    ) {
                      saveSazonais(
                        sazonais.filter(
                          (s) => s.id !== c.id
                        )
                      );

                      saveProdutos(
                        produtos.map((p) =>
                          p.colecaoEspecial === c.id
                            ? {
                                ...p,
                                colecaoEspecial:
                                  null,
                              }
                            : p
                        )
                      );
                    }
                  }}
                  className="p-2 text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
