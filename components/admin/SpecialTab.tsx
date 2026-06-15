"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";

import { Produto, Colecao } from "../../app/admin/dashboard/page";

interface Props {
  produtos: Produto[];
  saveProdutos: (p: Produto[]) => void;

  sazonais: Colecao[];
  saveSazonais: (c: Colecao[]) => void;
}

export default function SpecialTab({
  produtos,
  saveProdutos,
  sazonais,
  saveSazonais,
}: Props) {
  const [editSaz, setEditSaz] = useState<Colecao | null>(null);
  const [isSazModalOpen, setIsSazModalOpen] = useState(false);

  // toggle produto dentro da coleção
  const toggleProdutoInColecao = (produtoId: string) => {
    if (!editSaz) return;

    const exists = editSaz.produtoIds.includes(produtoId);

    setEditSaz({
      ...editSaz,
      produtoIds: exists
        ? editSaz.produtoIds.filter((id) => id !== produtoId)
        : [...editSaz.produtoIds, produtoId],
    });
  };

  // salvar coleção (create/update)
  const handleSaveColecao = () => {
    if (!editSaz) return;

    const exists = sazonais.some((s) => s.id === editSaz.id);

    const updated = exists
      ? sazonais.map((s) =>
          s.id === editSaz.id ? editSaz : s
        )
      : [...sazonais, editSaz];

    saveSazonais(updated);

    setEditSaz(null);
    setIsSazModalOpen(false);
  };

  // delete coleção
  const handleDelete = (id: string) => {
    if (!confirm("Remover esta coleção?")) return;

    saveSazonais(sazonais.filter((s) => s.id !== id));

    saveProdutos(
      produtos.map((p) =>
        p.colecaoEspecial === id
          ? { ...p, colecaoEspecial: null }
          : p
      )
    );
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#3D261D]">
            Coleções Especiais
          </h3>

          <p className="text-[#A67C6D] text-sm">
            Selecione produtos para montar coleções sazonais.
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

      {/* LISTA COLEÇÕES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sazonais.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="aspect-[3/2] mb-3 bg-[#F9F3EF] rounded-lg overflow-hidden">
              {c.capa ? (
                <img
                  src={c.capa}
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
                  {c.produtoIds.length} produtos
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditSaz(c);
                    setIsSazModalOpen(true);
                  }}
                >
                  <Edit2 size={15} />
                </button>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isSazModalOpen && editSaz && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-auto">

            {/* HEADER MODAL */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editSaz.id.includes("saz-")
                  ? "Nova Coleção"
                  : "Editar Coleção"}
              </h3>

              <button onClick={() => setIsSazModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* TÍTULO */}
            <input
              className="w-full border p-3 rounded-xl mb-4"
              placeholder="Título da coleção"
              value={editSaz.titulo}
              onChange={(e) =>
                setEditSaz({
                  ...editSaz,
                  titulo: e.target.value,
                })
              }
            />

            {/* PRODUTOS */}
            <p className="font-semibold mb-2">
              Selecione produtos
            </p>

            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-auto border p-3 rounded-xl">
              {produtos.map((p) => {
                const selected =
                  editSaz.produtoIds.includes(p.id);

                return (
                  <button
                    key={p.id}
                    onClick={() =>
                      toggleProdutoInColecao(p.id)
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                      selected
                        ? "border-[#F4845F] bg-[#FFF3ED]"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={p.imagem}
                      className="w-10 h-10 rounded object-cover"
                    />

                    <span className="text-sm flex-1 text-left">
                      {p.nome}
                    </span>

                    {selected && (
                      <Check size={14} className="text-[#F4845F]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsSazModalOpen(false)}
                className="flex-1 py-3 border rounded-full"
              >
                Cancelar
              </button>

              <button
                onClick={handleSaveColecao}
                className="flex-1 py-3 rounded-full text-white"
                style={{ background: "#F4845F" }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}