"use client";

import { useState } from "react";
import { X, Trash2, Ban } from "lucide-react";
import { Produto } from "@/components/admin/Dashboard";
import { COR_MAP } from "@/lib/colors";
import { deleteImageFromStorage } from "@/lib/supabaseStorage";

interface Props {
  editingColorImage: string;
  editProduto: Produto;
  setEditProduto: (p: Produto) => void;
  onClose: () => void;
}

export function extractStoragePath(url: any) {
  try {
    // Se não for string ou for vazia, evita o erro retornando vazio
    if (!url || typeof url !== 'string') return "";
    
    if (url.startsWith("blob:")) return "";

    const parts = url.split("/produtos/");
    if (parts.length > 1) {
      return parts[1];
    }
    
    return url;
  } catch (err) {
    console.error("Erro ao extrair path:", err);
    return "";
  }
}

export default function ColorImageModal({
  editingColorImage,
  editProduto,
  setEditProduto,
  onClose,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const corAtual = editProduto.cores.find(
    (c) => c.nome === editingColorImage
  );

  const hasImage = !!corAtual?.imagem;
  const corExisteNoProduto = !!corAtual;


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cria a URL temporária para o navegador renderizar
    const localPreview = URL.createObjectURL(file);

    setEditProduto({
      ...editProduto,
      cores: editProduto.cores.some((c) => c.nome === editingColorImage)
        ? editProduto.cores.map((c) =>
            c.nome === editingColorImage 
              ? { ...c, imagem: localPreview, file: file } // Guarda a preview e o arquivo físico
              : c
          )
        : [...editProduto.cores, { nome: editingColorImage, imagem: localPreview, file: file }],
    });
  };

  const handleRemoveImage = async () => {
    const cor = editProduto.cores.find(
      (c) => c.nome === editingColorImage
    );

    if (!cor?.imagem) return;

    try {
      if (cor.imagem.startsWith("http") && cor.imagem.includes("supabase.co")) {
        // Decodifica a URL para transformar %20 de volta em espaços ou caracteres normais
        const decodedUrl = decodeURIComponent(cor.imagem);
        await deleteImageFromStorage(decodedUrl);
      } else if (cor.imagem.startsWith("blob:")) {
        URL.revokeObjectURL(cor.imagem);
      }

      // Limpa o estado local
      setEditProduto({
        ...editProduto,
        cores: editProduto.cores.map((c) =>
          c.nome === editingColorImage ? { ...c, imagem: "", file: undefined } : c
        ),
      });

    } catch (error) {
      console.error("Erro ao remover a imagem:", error);
    }
  };

  const handleRemoveColorEntirely = async () => {
    try {
      // 1. Se tiver imagem salva no Supabase, deleta ela primeiro
      if (corAtual?.imagem && corAtual.imagem.startsWith("http") && corAtual.imagem.includes("supabase.co")) {
        const decodedUrl = decodeURIComponent(corAtual.imagem);
        await deleteImageFromStorage(decodedUrl);
      } else if (corAtual?.imagem && corAtual.imagem.startsWith("blob:")) {
        URL.revokeObjectURL(corAtual.imagem);
      }

      // 2. Filtra o array removendo este objeto de cor por completo
      setEditProduto({
        ...editProduto,
        cores: editProduto.cores.filter((c) => c.nome !== editingColorImage),
      });

      // 3. Fecha o modal já que a cor não faz mais parte do produto
      onClose();
    } catch (error) {
      console.error("Erro ao remover a cor completa:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{editingColorImage}</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* PREVIEW */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full shadow-md"
            style={{ backgroundColor: COR_MAP[editingColorImage] }}
          />
        </div>

        {/* UPLOAD */}
        <input
          type="file"
          id="upload-color"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <div className="space-y-4 mb-6">
          {!hasImage ? (
            <label
              htmlFor="upload-color"
              className="block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer border-primary"
            >
              Clique para fazer upload
            </label>
          ) : (
            <div className="space-y-3">
              <img
                src={corAtual?.imagem || ""}
                className="w-full h-48 object-cover rounded-2xl"
              />
            </div>
          )}
        </div>

        {/* BOTÃO QUE VOCÊ QUER */}
        {hasImage && (
          <button
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="w-full flex items-center text-sm justify-center gap-2 py-3 text-red-500 border border-red-200 rounded-full hover:bg-red-50"
          >
            <Trash2 size={16} />
            Remover Imagem
          </button>
        )}

        {corExisteNoProduto && (
            <button
              onClick={handleRemoveColorEntirely}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 text-red-500 border border-red-200 bg-red-50/50 rounded-full text-sm hover:bg-red-50 transition font-medium"
            >
              <Ban size={15} />
              Remover Cor
            </button>
          )}

        <button
          onClick={() => {
            // Se o usuário clicou em pronto e a cor ainda não existe na lista, adiciona ela pura!
            const corJaExiste = editProduto.cores.some((c) => c.nome === editingColorImage);
            
            if (!corJaExiste) {
              setEditProduto({
                ...editProduto,
                cores: [...editProduto.cores, { nome: editingColorImage, imagem: null }],
              });
            }

            // Fecha o modal normalmente
            onClose();
          }}
          className="w-full mt-3 py-3 text-white rounded-full transition-all active:scale-[0.98]"
          style={{ background: "#F4845F" }}
        >
          Salvar
        </button>

      </div>
    </div>
  );
}