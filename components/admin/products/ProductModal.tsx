"use client";

import { useEffect, useRef, useState, Dispatch, SetStateAction  } from "react";
import { X } from "lucide-react";

import { Produto } from "@/app/admin/dashboard/page";
import { CATEGORIES } from "@/data/categories";
import { COLOR_LIST, COR_MAP } from "@/lib/colors";

interface Props {
  editProduto: Produto;
  setEditProduto: Dispatch<SetStateAction<Produto | null>>;
  onClose: () => void;
  onSave: (p: Produto) => void;
  onOpenColorImage: (cor: string) => void;
}

export default function ProductModal({
  editProduto,
  setEditProduto,
  onClose,
  onSave,
  onOpenColorImage,
}: Props) {
  const descricaoRef = useRef<HTMLTextAreaElement>(null);
  const [precoInput, setPrecoInput] = useState("");

  const categoriaAtual = CATEGORIES.find(
    (c) => c.slug === editProduto?.categoria
  );

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    if (editProduto) {
      setPrecoInput(
        editProduto.preco
          ? editProduto.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : ""
      );
    }
  }, [editProduto]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Editar Produto</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            className="w-full border p-3 rounded-xl"
            value={editProduto.nome}
            onChange={(e) =>
              setEditProduto({ ...editProduto, nome: e.target.value })
            }
          />

          <textarea
            ref={descricaoRef}
            className="w-full border p-3 rounded-xl resize-none overflow-hidden"
            value={editProduto.descricao}
            onChange={(e) =>
              setEditProduto({ ...editProduto, descricao: e.target.value })
            }
            onInput={(e) => autoResize(e.currentTarget)}
          />

          <input
            className="w-full border p-3 rounded-xl"
            value={precoInput}
            onChange={(e) => {
              const numeric = e.target.value.replace(/\D/g, "");
              const numberValue = Number(numeric) / 100;

              setPrecoInput(
                numberValue
                  ? numberValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : ""
              );

              setEditProduto({
                ...editProduto,
                preco: numberValue || 0,
              });
            }}
          />

          <div className="flex gap-4">
            <select
              value={editProduto.categoria}
              onChange={(e) =>
                setEditProduto({
                  ...editProduto,
                  categoria: e.target.value,
                  subcategoria: "",
                })
              }
              className="w-full border p-3 rounded-xl"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={editProduto.subcategoria || ""}
              onChange={(e) =>
                setEditProduto({
                  ...editProduto,
                  subcategoria: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            >
              <option value="">Selecione</option>
              {categoriaAtual?.subcategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            {COLOR_LIST.map((cor) => {
              const selected = editProduto.cores.some((c) => c.nome === cor);

              return (
                <button
                    key={cor}
                    onClick={() => {
                      onOpenColorImage(cor);
                    }}
                    className={`relative w-10 h-10 rounded-full overflow-hidden transition-all ${
                        selected
                        ? "ring-1 ring-offset-1 ring-offset-white ring-primary scale-105"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: COR_MAP[cor] }}
                    >
                    {/* MINIATURA DA IMAGEM */}
                    {editProduto.cores.find((c) => c.nome === cor)?.imagem && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src={editProduto.cores.find((c) => c.nome === cor)?.imagem}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        </div>
                    )}
                </button>
              );
            })}
          </div>

          {editProduto.cores.length > 0 && editProduto.cores.some((c) => c.imagem) && (
            <div className="pt-4 border-t">
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Imagem Principal
              </label>
              <div className="grid grid-cols-4 gap-3">
                {editProduto.cores.map((cor) =>
                  cor.imagem ? (
                    <button
                      key={`${cor.nome}-main`}
                      onClick={() =>
                        setEditProduto({
                          ...editProduto,
                          imagem: cor.imagem,
                        })
                      }
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        editProduto.imagem === cor.imagem
                          ? "border-primary scale-105 ring-1 ring-offset-1 ring-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={cor.imagem}
                        className="w-full h-24 object-cover"
                      />
                      <div className="text-xs font-medium mt-1 text-center text-gray-600">
                        {cor.nome}
                      </div>
                    </button>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 border py-3 rounded-full">
            Cancelar
          </button>

          <button
            onClick={() => onSave(editProduto)}
            className="flex-1 py-3 rounded-full text-white"
            style={{ background: "#F4845F" }}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}