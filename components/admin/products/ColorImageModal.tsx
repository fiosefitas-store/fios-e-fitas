"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { Produto } from "@/app/admin/dashboard/page";
import { COR_MAP } from "@/lib/colors";
import { uploadImageToSupabase } from "@/lib/imageUpload";
import { deleteImageFromStorage } from "@/lib/supabaseStorage";

interface Props {
  editingColorImage: string;
  editProduto: Produto;
  setEditProduto: (p: Produto) => void;
  onClose: () => void;
}

export function extractStoragePath(url: string) {
  try {
    return url.split("/").slice(-1)[0];
  } catch {
    return url;
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

  const productId = editProduto.id;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const url = await uploadImageToSupabase(
        file,
        productId,
        editingColorImage
      );

      if (!url) return;

      setEditProduto({
        ...editProduto,
        cores: editProduto.cores.some((c) => c.nome === editingColorImage)
          ? editProduto.cores.map((c) =>
              c.nome === editingColorImage ? { ...c, imagem: url } : c
            )
          : [...editProduto.cores, { nome: editingColorImage, imagem: url }],
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 🔥 ESSE É O BOTÃO QUE VOCÊ QUER
  const handleRemoveImage = async () => {
    const cor = editProduto.cores.find(
      (c) => c.nome === editingColorImage
    );

    // 1. apaga do storage (igual delete do produto)
    if (cor?.imagem) {
      await deleteImageFromStorage(extractStoragePath(cor.imagem));
    }

    // 2. limpa estado local (igual UI otimista do delete)
    setEditProduto({
      ...editProduto,
      cores: editProduto.cores.map((c) =>
        c.nome === editingColorImage ? { ...c, imagem: "" } : c
      ),
    });
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

              <label
                htmlFor="upload-color"
                className="block text-center font-medium text-primary cursor-pointer"
              >
                Trocar imagem
              </label>
            </div>
          )}
        </div>

        {/* BOTÃO QUE VOCÊ QUER */}
        {hasImage && (
          <button
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 py-3 text-red-500 border border-red-200 rounded-full hover:bg-red-50"
          >
            <Trash2 size={16} />
            Remover Imagem
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 text-white rounded-full"
          style={{ background: "#F4845F" }}
        >
          Pronto
        </button>
      </div>
    </div>
  );
}