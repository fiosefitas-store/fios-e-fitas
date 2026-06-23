"use client";

import { Plus, Edit2, Trash2, X, Check } from "lucide-react";

import { uploadSazonalImageToSupabase } from "@/lib/imageUpload";
import { Produto, Colecao } from "@/app/admin/dashboard/page";
import { useEffect, useState } from "react";

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

  const loadSazonais = async () => {
    const res = await fetch("/api/admin/sazonal");

    console.log("Status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("[sazonal] load error", res.status, text);
      return;
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("[sazonal] invalid data received:", data);
      saveSazonais([]);
      return;
    }

    saveSazonais(data);
  };

  const [editSaz, setEditSaz] = useState<Colecao | null>(null);
  const [isSazModalOpen, setIsSazModalOpen] = useState(false);
  const [editingCapaId, setEditingCapaId] = useState<string | null>(null);

  const safeSazonais = Array.isArray(sazonais) ? sazonais : [];

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
 const handleSaveColecao = async () => {
    if (!editSaz) return;

    const exists = safeSazonais.some((s) => s.id === editSaz.id);

    // 🔥 1. UI atualiza imediatamente
    const updatedList = exists
      ? safeSazonais.map((s) => (s.id === editSaz.id ? editSaz : s))
      : [...safeSazonais, editSaz];

    saveSazonais(updatedList);

    setIsSazModalOpen(false);
    setEditSaz(null);

    try {
      // 🔥 2. backend depois
      const url = exists
        ? `/api/admin/sazonal/${editSaz.id}`
        : `/api/admin/sazonal`;

      const method = exists ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editSaz),
      });

      // 🔥 3. opcional: sincroniza de verdade depois
      await loadSazonais();
    } catch (err) {
      console.error("Erro ao salvar coleção:", err);

      // ❗ rollback simples se quiser
      await loadSazonais();
    }
  };

  // delete coleção
  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta coleção?")) return;

    await fetch(`/api/admin/sazonal/${id}`, {
      method: "DELETE",
    });

    await loadSazonais();
  };

  const handleUploadCapa = async (
    file: File,
    id: string
  ) => {
    const url = await uploadSazonalImageToSupabase (file);

    const colecao = safeSazonais.find((c) => c.id === id);

    await fetch(`/api/admin/sazonal/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: colecao?.titulo,
        produtoIds: colecao?.produtoIds,
        capa: url,
      }),
    });

    await loadSazonais();
    setEditingCapaId(null);
  };

  const handleRemoveCapa = async () => {
    if (!editingCapaId) return;

    const colecao = safeSazonais.find((c) => c.id === editingCapaId);

    await fetch(`/api/admin/sazonal/${editingCapaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: colecao?.titulo,
        produtoIds: colecao?.produtoIds,
        capa: null,
      }),
    });

    await loadSazonais();
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
              id: "",
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
        {safeSazonais.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="aspect-3/2 mb-3 bg-bg-section rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setEditingCapaId(c.id)}>
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
                {editSaz.id
                  ? "Editar Coleção"
                  : "Nova Coleção"}
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

            <div className="grid grid-cols-2 gap-3 max-h-75 overflow-auto border p-3 rounded-xl">
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
                        ? "border-primary bg-[#FFF3ED]"
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
                      <Check size={14} className="text-primary" />
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

      {/* MODAL UPLOAD CAPA */}
      {editingCapaId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                Upload da Capa
              </h3>

              <button onClick={() => setEditingCapaId(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-primary rounded-2xl p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  id="capa-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file || !editingCapaId) return;

                    handleUploadCapa(file, editingCapaId);
                  }}
                />

                <label
                  htmlFor="capa-upload"
                  className="cursor-pointer block"
                >
                  <p className="font-medium text-[#3D261D]">
                    Clique para fazer upload
                  </p>
                  <p className="text-sm text-gray-500">
                    ou arraste uma imagem
                  </p>
                </label>
              </div>

              {safeSazonais.find((c) => c.id === editingCapaId)?.capa && (
                <>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">
                      Prévia:
                    </p>
                    <img
                      src={safeSazonais.find((c) => c.id === editingCapaId)?.capa || ""}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleRemoveCapa}
                    className="w-full mt-3 py-2 border border-red-300 text-red-600 rounded-xl"
                  >
                    Remover capa
                  </button>
              </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingCapaId(null)}
                className="flex-1 py-3 border rounded-full"
              >
                Cancelar
              </button>

              <button
                onClick={() => setEditingCapaId(null)}
                className="flex-1 py-3 rounded-full text-white"
                style={{ background: "#F4845F" }}
              >
                Pronto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}