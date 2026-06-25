"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Star, Check } from "lucide-react";

import { Produto } from "@/app/admin/dashboard/page";
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
  const [storageMode, setStorageMode] = useState<"api" | "local">("api");
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
        // Se for um produto novo, usamos a primeira imagem blob como preview temporário na tabela
        imagem: produto.imagem?.startsWith("blob:") 
          ? produto.imagem 
          : (produto.cores.find(c => c.imagem)?.imagem || produto.imagem)
      };

      const listaOtimista = exists
        ? produtos.map((p) => (p.id === produto.id ? produtoTemporario : p))
        : [...produtos, produtoTemporario];

      saveProdutos(listaOtimista);

      // O modal já fechou visualmente por causa do onClose() no ProductModal,
      // então o usuário já verá a linha cinza na tabela imediatamente aqui.

      if (storageMode === "api") {
        // 2. Executa o upload das cores em segundo plano
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

        // 3. Salva no banco de dados
        savedProduto = exists
          ? await productsService.update(savedProduto)
          : await productsService.create(savedProduto);

        // 🔥 4. TRANQUILIZA A UI: Substitui o temporário pelo produto real vindo do banco
        // (aqui ele perde o estado cinza e os botões voltam a funcionar)
        const listaFinal = produtos.map((p) => 
          p.id === savedProduto.id ? savedProduto : p
        );
        
        // Se for um produto totalmente novo que acabou de receber o ID final do banco:
        const listaFinalComNovo = exists 
          ? listaFinal 
          : produtos.filter(p => p.id !== produto.id).concat(savedProduto);

        saveProdutos(listaFinalComNovo);
      }
    } catch (err) {
      console.error("Erro ao salvar produto em segundo plano:", err);
      // Em caso de erro crítico, remove o temporário ou restaura o estado original
      saveProdutos(produtos.filter((p) => p.id !== produto.id));
      alert("Erro ao salvar o produto no servidor.");
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


  // Abre o pop-up de confirmação
  const triggerDeleteConfirmation = (id: string) => {
    setProductIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Executa a deleção real após o usuário confirmar no pop-up
  const handleConfirmDelete = async () => {
    if (!productIdToDelete) return;

    const id = productIdToDelete;
    
    // Fecha o pop-up imediatamente
    setIsDeleteModalOpen(false);
    setProductIdToDelete(null);

    // Fallback seguro da UI
    const listaOriginal = [...produtos];
    const produtosFiltrados = produtos.filter((p) => p.id !== id);
    saveProdutos(produtosFiltrados);

    try {
      if (storageMode === "api") {
        await productsService.remove(id);
      }
    } catch (err) {
      console.error("Erro ao deletar produto na API:", err);
      saveProdutos(listaOriginal);
      alert("Não foi possível remover o produto do servidor.");
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
            {produtos.map((produto, i) => {
              // 🌟 Verifica se este produto específico está carregando em background
              const isSavingBackground = (produto as any).salvando;

              return (
                <tr
                  key={produto.id}
                  className={`border-b border-bg-section transition-all duration-300 ${
                    isSavingBackground 
                      ? "opacity-50 bg-gray-100 animate-pulse pointer-events-none select-none filter grayscale" 
                      : i % 2 === 0 ? "bg-white" : "bg-bg"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={produto.imagem}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-200"
                      />
                      <span className="text-sm font-medium text-[#3D261D]">
                        {produto.nome || "Carregando..."}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">{produto.categoria}</td>

                  <td className="px-4 py-4 font-semibold text-primary">
                    R$ {produto.preco.toFixed(2)}
                  </td>

                  <td className="px-4 py-4">
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

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        disabled={isSavingBackground} 
                        onClick={() => handleEdit(produto)} 
                        className="p-2 disabled:opacity-30"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button 
                        disabled={isSavingBackground} 
                        onClick={() => triggerDeleteConfirmation(produto.id)} 
                        className="p-2 text-red-500 disabled:opacity-30 hover:text-red-700 transition"
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