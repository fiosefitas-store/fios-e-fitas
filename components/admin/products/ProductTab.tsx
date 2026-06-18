"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Star, Check } from "lucide-react";

import { Produto } from "@/app/admin/dashboard/page";
import { CATEGORIES } from "@/data/categories";

import ProductModal from "./ProductModal";
import ColorImageModal from "./ColorImageModal";

interface Props {
  produtos: Produto[];
  saveProdutos: (produtos: Produto[]) => void;
}

export default function ProductTab({ produtos, saveProdutos }: Props) {
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColorImage, setEditingColorImage] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Confirmar exclusao deste produto?")) {
      saveProdutos(produtos.filter((p) => p.id !== id));
    }
  };

  const handleToggleDestaque = (id: string) => {
    saveProdutos(
      produtos.map((p) =>
        p.id === id ? { ...p, destaque: !p.destaque } : p
      )
    );
  };

  const handleToggleAtivo = (id: string) => {
    saveProdutos(
      produtos.map((p) =>
        p.id === id ? { ...p, ativo: !p.ativo } : p
      )
    );
  };

  const handleEdit = (produto: Produto) => {
    setEditProduto({ ...produto });
    setIsModalOpen(true);
  };

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
      tamanhosCm: {},
      materiais: [],
      destaque: false,
      ativo: true,
      personalizado: true,
      prazoProducao: "7-10 dias uteis",
      avaliacoes: 5,
      vendas: 0,
    });

    setIsModalOpen(true);
  };

  const handleSave = (produto: Produto) => {
    const exists = produtos.some((p) => p.id === produto.id);

    if (exists) {
      saveProdutos(produtos.map((p) => (p.id === produto.id ? produto : p)));
    } else {
      saveProdutos([...produtos, produto]);
    }

    setIsModalOpen(false);
    setEditProduto(null);
  };

  return (
    <>
      <div className="flex justify-end mb-6">
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
                  <button onClick={() => handleToggleAtivo(produto.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                      produto.ativo ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Check size={14} />
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