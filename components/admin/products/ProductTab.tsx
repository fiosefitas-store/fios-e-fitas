"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check } from "lucide-react";

import { Produto } from "@/components/admin/Dashboard";
import { CATEGORIES } from "@/data/categories";

import ProductModal from "./ProductModal";
import ColorImageModal from "./ColorImageModal";
import { productsService } from "@/app/api/services/productsService";
import { uploadImageToSupabase } from "@/lib/imageUpload";

interface Props {
  produtos: Produto[];
  saveProdutos: (produtos: Produto[]) => void;
}

export default function ProductTab({ produtos, saveProdutos }: Props) {
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColorImage, setEditingColorImage] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);

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
      
      // Criamos uma cópia temporária do produto marcada como 'salvando'
      const produtoTemporario = { 
        ...produto, 
        salvando: true,
        imagem: produto.imagem?.startsWith("blob:") 
          ? produto.imagem 
          : (produto.cores.find(c => c.imagem)?.imagem || produto.imagem)
      };

      const listaOtimista = exists
        ? produtos.map((p) => (p.id === produto.id ? produtoTemporario : p))
        : [...produtos, produtoTemporario];

      saveProdutos(listaOtimista);

      // 1. Executa o upload das cores em segundo plano
      const novasCores = await Promise.all(
        produto.cores.map(async (cor) => {
          if (!cor.file) return cor;

          const url = await uploadImageToSupabase(cor.file, produto.id, cor.nome);
          return {
            ...cor,
            imagem: url || "",
            preview: undefined,
            file: undefined,
          };
        })
      );

      let savedProduto = { ...produto, cores: novasCores };

      // Ajusta a imagem principal definitiva
      const corPrincipal = novasCores.find(c => c.imagem && produto.imagem === c.preview);
      if (corPrincipal && corPrincipal.imagem) {
        savedProduto.imagem = corPrincipal.imagem;
      } else if (savedProduto.imagem?.startsWith("blob:")) {
        const correspondente = novasCores.find(c => c.imagem);
        if (correspondente && correspondente.imagem) {
          savedProduto.imagem = correspondente.imagem;
        }
      }

      // 2. Salva diretamente no banco de dados através do service
      savedProduto = exists
        ? await productsService.update(savedProduto)
        : await productsService.create(savedProduto);

      // 3. Substitui o temporário pelo produto real vindo do banco
      const listaFinal = produtos.map((p) => 
        p.id === savedProduto.id ? savedProduto : p
      );
      
      const listaFinalComNovo = exists 
        ? listaFinal 
        : produtos.filter(p => p.id !== produto.id).concat(savedProduto);

      saveProdutos(listaFinalComNovo);

    } catch (err) {
      console.error("Erro ao salvar produto em segundo plano:", err);
      saveProdutos(produtos.filter((p) => p.id !== produto.id));
      alert("Erro ao salvar o produto no servidor.");
    }
  };

  const handleToggleAtivo = async (id: string) => {
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;

    const updated = { ...produto, ativo: !produto.ativo };

    // Atualização otimista na UI
    const newList = produtos.map((p) => (p.id === id ? updated : p));
    saveProdutos(newList);

    try {
      // Sincroniza diretamente na API
      await productsService.update(updated);
    } catch (err) {
      console.error("Erro ao alterar o status do produto:", err);
      // Rollback se der errado
      saveProdutos(produtos);
      alert("Não foi possível atualizar o status do produto.");
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditProduto({ ...produto });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const triggerDeleteConfirmation = (id: string) => {
    setProductIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productIdToDelete) return;

    const id = productIdToDelete;
    
    setIsDeleteModalOpen(false);
    setProductIdToDelete(null);

    const listaOriginal = [...produtos];
    const produtosFiltrados = produtos.filter((p) => p.id !== id);
    saveProdutos(produtosFiltrados);

    try {
      await productsService.remove(id);
    } catch (err) {
      console.error("Erro ao deletar produto na API:", err);
      saveProdutos(listaOriginal);
      alert("Não foi possível remover o produto do servidor.");
    }
  };

  return (
    <>
      {/* HEADER ACTIONS */}
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

      {/* PROD TABLE CARD */}
      <div
        className="bg-white rounded-lg overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="overflow-x-auto w-full">
          <div className="overflow-x-auto w-full rounded-lg border border-[#F2E8E1]">
            <table className="w-full min-w-3xl table-auto whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#F2E8E1] bg-gray-50 text-sm font-semibold uppercase tracking-wider text-[#A67C6D]">
                  <th className="text-left px-6 py-4 w-[40%]">Produto</th>
                  <th className="text-left px-6 py-4 w-[20%]">Categoria</th>
                  <th className="text-left px-6 py-4 w-[15%]">Preço</th>
                  <th className="text-center px-6 py-4 w-[10%]">Ativo</th>
                  <th className="text-center px-6 py-4 w-[15%]">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F2E8E1]">
                {produtos.map((produto, i) => {
                  const isSavingBackground = (produto as any).salvando;

                  return (
                    <tr
                      key={produto.id}
                      className={`transition-all duration-300 ${
                        isSavingBackground 
                          ? "opacity-50 bg-gray-100 animate-pulse pointer-events-none select-none filter grayscale" 
                          : i % 2 === 0 ? "bg-white" : "bg-bg"
                      }`}
                    >
                      {/* Produto */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={produto.imagem}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-200 shrink-0"
                            alt={produto.nome}
                          />
                          <span className="text-sm font-medium text-[#3D261D] truncate max-w-50" title={produto.nome}>
                            {produto.nome || "Carregando..."}
                          </span>
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="px-6 py-4 text-lg text-gray-600">
                        <span className="inline-block text-[#3D261D] px-2.5 py-1 rounded-full text-sm font-medium">
                          {produto.categoria}
                        </span>
                      </td>
                      
                      {/* Preço */}
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        R$ {produto.preco.toFixed(2)}
                      </td>

                      {/* Ativo */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                          <button
                            disabled={isSavingBackground}
                            onClick={() => handleToggleAtivo(produto.id)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              produto.ativo ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute top-1/2 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
                                produto.ativo ? "translate-x-5" : "translate-x-0"
                              } -translate-y-1/2`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            disabled={isSavingBackground} 
                            onClick={() => handleEdit(produto)} 
                            className="p-2 disabled:opacity-30 hover:bg-gray-100 rounded-full transition text-gray-600"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button 
                            disabled={isSavingBackground} 
                            onClick={() => triggerDeleteConfirmation(produto.id)} 
                            className="p-2 text-red-500 disabled:opacity-30 hover:bg-red-50 hover:text-red-700 rounded-full transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* POP-UP DE CONFIRMAÇÃO DE DELEÇÃO */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl border border-gray-100">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              
              <h3 className="text-lg font-bold text-[#3D261D]">
                Excluir Produto
              </h3>
              
              <p className="text-sm text-[#A67C6D] mt-2">
                Tem certeza que deseja apagar este produto? Esta ação não poderá ser desfeita e removerá o item.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProductIdToDelete(null);
                  }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition shadow-sm"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        )}
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