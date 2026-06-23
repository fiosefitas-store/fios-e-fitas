"use client";

import { useEffect, useRef, useState, Dispatch, SetStateAction  } from "react";
import { X, ChevronDown } from "lucide-react";

import { Produto } from "@/app/admin/dashboard/page";
import { CATEGORIES } from "@/data/categories";
import { COLOR_LIST, COR_MAP } from "@/lib/colors";

interface Props {
  editProduto: Produto;
  setEditProduto: Dispatch<SetStateAction<Produto | null>>;
  onClose: () => void;
  onSave: (p: Produto) => void;
  onOpenColorImage: (cor: string) => void;
  onSaveToDatabase?: (p: Produto) => Promise<void>;
  mode?: "create" | "edit";
}

export default function ProductModal({
  editProduto,
  setEditProduto,
  onClose,
  onSave,
  onOpenColorImage,
  onSaveToDatabase,
  mode = "edit",
}: Props) {
  const descricaoRef = useRef<HTMLTextAreaElement>(null);
  const [precoInput, setPrecoInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [materialInput, setMaterialInput] = useState("");
  const [tamanhoAberto, setTamanhoAberto] = useState<string | null>(null);

  const TAMANHOS_PADRAO = ["PP", "P", "M", "G", "Padrão"];

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
          <h3 className="text-xl font-bold">
            {mode === "create" ? "Criar Produto" : "Editar Produto"}
          </h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
            value={editProduto.nome}
            onChange={(e) =>
              setEditProduto({ ...editProduto, nome: e.target.value })
            }
            placeholder="Nome do produto"
          />

          <textarea
            ref={descricaoRef}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition resize-none overflow-hidden"
            value={editProduto.descricao}
            onChange={(e) =>
              setEditProduto({ ...editProduto, descricao: e.target.value })
            }
            onInput={(e) => autoResize(e.currentTarget)}
            placeholder="Descrição do produto: Ex: Feito especialmente para festas, cores podem ser personalizadas."
          />

          <input
            className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
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
            placeholder="R$ 0,00"
          />

          {/* CATEGORIA E SUBCATEGORIA */}
          <div className="flex gap-4">
            <div className="relative w-full">
              <select
                value={editProduto.categoria}
                onChange={(e) =>
                  setEditProduto({
                    ...editProduto,
                    categoria: e.target.value,
                    subcategoria: "",
                  })
                }
                className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative w-full">
              <select
                value={editProduto.subcategoria || ""}
                onChange={(e) =>
                  setEditProduto({
                    ...editProduto,
                    subcategoria: e.target.value,
                  })
                }
                className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
              >
                <option value="">Selecione</option>
                {categoriaAtual?.subcategories.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
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

          {/* MATERIAL */}
          <div className="pt-4 border-t">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Material (Tópico na descrição)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicione um material..."
                value={materialInput}
                onChange={(e) => setMaterialInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    if (materialInput.trim()) {
                      setEditProduto({
                        ...editProduto,
                        materiais: [...editProduto.materiais, materialInput.trim()],
                      });
                      setMaterialInput("");
                    }
                  }
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
              />
              <button
                onClick={() => {
                  if (materialInput.trim()) {
                    setEditProduto({
                      ...editProduto,
                      materiais: [...editProduto.materiais, materialInput.trim()],
                    });
                    setMaterialInput("");
                  }
                }}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm"
              >
                <span className="text-2xl leading-none">+</span>
              </button>
            </div>
            {editProduto.materiais.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {editProduto.materiais.map((material, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {material}
                    <button
                      onClick={() => {
                        setEditProduto({
                          ...editProduto,
                          materiais: editProduto.materiais.filter(
                            (_, i) => i !== idx
                          ),
                        });
                      }}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TAMANHOS */}
          <div className="pt-4 border-t">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Tamanhos (cm)
            </label>
            <div className="flex flex-wrap gap-2">
              {TAMANHOS_PADRAO.map((tamanho) => {
                const selected = editProduto.tamanhos.some(
                  (t) => t.nome === tamanho
                );

                return (
                  <button
                    key={tamanho}
                    type="button"
                    onClick={() => {
                      let novos = [...editProduto.tamanhos];

                      if (selected) {
                        // remove
                        novos = novos.filter((t) => t.nome !== tamanho);
                      } else {
                        // adiciona
                        novos.push({ nome: tamanho, cm: "" });
                      }

                      setEditProduto({
                        ...editProduto,
                        tamanhos: novos,
                      });
                    }}
                    className={`px-4 py-2 rounded-full border-gray-300 border text-sm transition ${
                      selected
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {tamanho}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-2">
              {editProduto.tamanhos.map((t) => (
                <div key={t.nome} className="flex items-center gap-2">
                  <span className="w-10 font-medium text-sm">{t.nome}</span>

                  <input
                    type="text"
                    placeholder="10 x 10"
                    value={t.cm}
                    onChange={(e) => {
                      setEditProduto({
                        ...editProduto,
                        tamanhos: editProduto.tamanhos.map((item) =>
                          item.nome === t.nome
                            ? { ...item, cm: e.target.value }
                            : item
                        ),
                      });
                    }}
                    className="flex-1 border p-2 rounded-lg text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* REVIEWS/AVALIAÇÕES */}
          <div className="pt-5 border-t border-gray-200">
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Quantidade de Vendas
            </label>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  value={editProduto.vendas === 0 ? "" : editProduto.vendas}
                  onChange={(e) =>
                    setEditProduto({
                      ...editProduto,
                      vendas: Math.max(0, Number(e.target.value)),
                    })
                  }
                  placeholder="Ex: 100"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
                />
              </div>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span className="text-sm text-gray-700">Produto personalizável</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={editProduto.personalizado || false}
                      onChange={(e) =>
                        setEditProduto({
                          ...editProduto,
                          personalizado: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />

                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-primary transition" />

                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition peer-checked:translate-x-5" />
                  </div>
                </label>
              </div>
            </div>
          </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 border-gray-300 bg-white border py-3 rounded-full">
            Cancelar
          </button>

          <button
            onClick={async () => {
              setIsSaving(true);
              try {
                onSave(editProduto);
                if (onSaveToDatabase) {
                  await onSaveToDatabase(editProduto);
                }
              } catch (error) {
                console.error("Erro ao salvar:", error);
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving}
            className="flex-1 py-3 rounded-full text-white disabled:opacity-50"
            style={{ background: "#F4845F" }}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}