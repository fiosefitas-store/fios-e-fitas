"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { Produto } from "@/app/admin/dashboard/page";
import { COR_MAP } from "@/lib/colors";
import { uploadImageToSupabase } from "@/lib/imageUpload";

interface Props {
  editingColorImage: string;
  editProduto: Produto;
  setEditProduto: (p: Produto) => void;
  onClose: () => void;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    uploadImageToSupabase(file, editProduto.id, editingColorImage).then((url) => {
      setIsUploading(false);
      if (url) {
        setEditProduto({
          ...editProduto,
          cores: editProduto.cores.some((c) => c.nome === editingColorImage)
            ? editProduto.cores.map((c) =>
                c.nome === editingColorImage
                  ? { ...c, imagem: url }
                  : c
              )
            : [...editProduto.cores, { nome: editingColorImage, imagem: url }],
        });
      } else {
        alert("Erro ao fazer upload da imagem");
      }
    });
  };

  const handleRemove = () => {
    setEditProduto({
      ...editProduto,
      cores: editProduto.cores.filter((c) => c.nome !== editingColorImage),
    });
    onClose();
  };

  const handleRemoveImage = () => {
    setEditProduto({
      ...editProduto,
      cores: editProduto.cores.map((c) =>
        c.nome === editingColorImage
          ? { ...c, imagem: "" }
          : c
      ),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {editingColorImage}
          </h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* PREVIEW DA COR */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full shadow-md"
            style={{ backgroundColor: COR_MAP[editingColorImage] }}
          />
        </div>

        {/* AREA DE UPLOAD */}
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
              className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                isUploading
                  ? "bg-gray-50 border-gray-300 opacity-50 cursor-not-allowed"
                  : "border-[#F4845F] hover:bg-[#FFF3ED]"
              }`}
            >
              <p className="font-medium text-[#3D261D]">
                {isUploading ? "Enviando..." : "Clique para fazer upload"}
              </p>
              <p className="text-sm text-gray-500">
                {isUploading ? "" : "JPG, PNG até 5MB"}
              </p>
            </label>
          ) : (
            <div className="space-y-3">
              <img
                src={corAtual?.imagem || ""}
                className="w-full h-48 object-cover rounded-2xl"
              />
              <label
                htmlFor="upload-color"
                className={`block text-center font-medium transition-colors text-[#F4845F] cursor-pointer hover:underline ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUploading ? "Enviando..." : "Trocar imagem"}
              </label>
            </div>
          )}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="space-y-3">
          {hasImage && (
            <button
              onClick={handleRemoveImage}
              className="w-full flex items-center justify-center gap-2 py-3 text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition disabled:opacity-50"
              disabled={isUploading}
            >
              <Trash2 size={16} />
              Remover Imagem
            </button>
          )}

          <button
            onClick={handleRemove}
            className="w-full py-3 text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition disabled:opacity-50"
            disabled={isUploading}
          >
            Remover Cor
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-white rounded-full hover:opacity-90 transition disabled:opacity-50"
            style={{ background: "#F4845F" }}
            disabled={isUploading}
          >
            Pronto
          </button>
        </div>
      </div>
    </div>
  );
}