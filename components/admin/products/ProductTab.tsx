"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Star, Check } from "lucide-react";

import { Produto } from "@/app/admin/dashboard/page";
import { CATEGORIES } from "@/data/categories";

import ProductModal from "./ProductModal";
import ColorImageModal from "./ColorImageModal";
import { productsService } from "@/app/services/productsService";

interface Props {
  produtos: Produto[];
  saveProdutos: (produtos: Produto[]) => void;
}


export default function ProductTab({ produtos, saveProdutos }: Props) {
  const [storageMode, setStorageMode] = useState<"api" | "local">("api");
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColorImage, setEditingColorImage] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

   const handleNew = () => {
    setEditProduto({
      id: `produto-${Date.now()}`,
      nome: "",
      descricao: "",
      preco: 0,
      categoria: CATEGORIES[0].slug,
      imagem: "/images/produtos/laco-cetim-rosa.png",
      cores: [],
      tamanhos: [],
      materiais: [],
      avaliacoes: 5,
      reviewsCount: 0,
      destaque: false,
      ativo: true,
      personalizado: true,
      vendas: 0,
    });

    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleSave = async (produto: Produto) => {
    try {
      const exists = produtos.some((p) => p.id === produto.id);

      if (storageMode === "api") {
        const saved = exists
          ? await productsService.update(produto)
          : await productsService.create(produto);

        const updated = exists
          ? produtos.map((p) => (p.id === produto.id ? saved : p))
          : [...produtos, saved];

        saveProdutos(updated);
      } else {
        // fallback localStorage
        if (exists) {
          saveProdutos(produtos.map((p) => (p.id === produto.id ? produto : p)));
        } else {
          saveProdutos([...produtos, produto]);
        }
      }

      setIsModalOpen(false);
      setEditProduto(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAtivo = async (id: string) => {
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;

    const updated = { ...produto, ativo: !produto.ativo };

    // 🔥 1. ATUALIZA UI NA HORA (IMEDIATO)
    const newList = produtos.map((p) =>
      p.id === id ? updated : p
    );

    saveProdutos(newList);

    try {
      // 🔥 2. depois sincroniza com API
      if (storageMode === "api") {
        await productsService.update(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditProduto({ ...produto });
    setModalMode("edit");
    setIsModalOpen(true);
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar exclusão deste produto?")) return;

    try {
      if (storageMode === "api") {
        await productsService.remove(id);
      }

      saveProdutos(produtos.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button 
        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white"
          style={{ background: "#61924c" }}
          onClick={() => setStorageMode((m) => (m === "api" ? "local" : "api"))}>
          Modo: {storageMode}
        </button>

        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white"
          style={{ background: "#F4845F" }}
        >
          <Plus size={16} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F2E8E1]">
              <th className="text-left px-6 py-4">Produto</th>
              <th className="text-left px-4 py-4">Categoria</th>
              <th className="text-left px-4 py-4">Preço</th>
              <th className="text-center px-4 py-4">Ativo</th>
              <th className="text-center px-4 py-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtos.map((produto, i) => (
              <tr
                key={produto.id}
                className={`border-b border-bg-section ${i % 2 === 0 ? "bg-white" : "bg-bg"}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={produto.imagem}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <span className="text-sm font-medium text-[#3D261D]">
                      {produto.nome}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4">{produto.categoria}</td>

                <td className="px-4 py-4 font-semibold text-primary">
                  R$ {produto.preco.toFixed(2)}
                </td>

                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => handleToggleAtivo(produto.id)}
                    className={`relative w-11 h-6 flex items-center rounded-full transition-colors ${
                      produto.ativo ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-transform ${
                        produto.ativo ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(produto)} className="p-2">
                      <Edit2 size={15} />
                    </button>

                    <button onClick={() => handleDelete(produto.id)} className="p-2 text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editProduto && (
        <ProductModal
          editProduto={editProduto}
          setEditProduto={setEditProduto}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onOpenColorImage={setEditingColorImage}
          mode={modalMode}
        />
      )}

      {editingColorImage && editProduto && (
        <ColorImageModal
          editingColorImage={editingColorImage}
          editProduto={editProduto}
          setEditProduto={setEditProduto}
          onClose={() => setEditingColorImage(null)}
        />
      )}
    </>
  );
}