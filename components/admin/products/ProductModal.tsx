"use client";

import { useEffect, useRef, useState, Dispatch, SetStateAction  } from "react";
import { X, ChevronDown } from "lucide-react";

import { Produto } from "@/components/admin/Dashboard";
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
  const [precoPromocionalInput, setPrecoPromocionalInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [materialInput, setMaterialInput] = useState("");
  const [customColorName, setCustomColorName] = useState("");
  const [customColorA, setCustomColorA] = useState("#F4845F");
  const [customColorB, setCustomColorB] = useState("#FFFFFF");
  const [showSecondColor, setShowSecondColor] = useState(false);
  const [showCustomColorForm, setShowCustomColorForm] = useState(false);
  const [showPromotionFields, setShowPromotionFields] = useState(Boolean(editProduto.emPromocao));
  const [requiredTouched, setRequiredTouched] = useState<Record<string, boolean>>({});

  const TAMANHOS_PADRAO = ["PP", "P", "M", "G", "Padrão"];

  const hasColors = editProduto.cores.length > 0;

  const categoriasSelecionadas = editProduto.categorias?.length
    ? editProduto.categorias
    : editProduto.categoria
      ? [editProduto.categoria]
      : [];

  const subcategoriasSelecionadas = editProduto.subcategorias?.length
    ? editProduto.subcategorias
    : editProduto.subcategoria
      ? [editProduto.subcategoria]
      : [];

  const subcategoriasDisponiveis = CATEGORIES.filter((categoria) =>
    categoriasSelecionadas.includes(categoria.slug)
  ).flatMap((categoria) => categoria.subcategories);

  const hasAtLeastOneImage = editProduto.cores.some(
    (cor) => cor.imagem && cor.imagem.trim() !== ""
  );
  

  const requiredFields = [
    { key: "nome", label: "Nome do produto", value: editProduto.nome?.trim() },
    { key: "descricao", label: "Descrição", value: editProduto.descricao?.trim() },
    { key: "preco", label: "Preço", value: editProduto.preco > 0 ? String(editProduto.preco) : "" },
    { key: "categoria", label: "Categoria", value: categoriasSelecionadas.length ? categoriasSelecionadas.join(",") : "" },
    { key: "cor", label: "Cor", value: editProduto.cores?.length ? "ok" : "" },
    { key: "imagem", label: "Pelo menos uma imagem", value: hasAtLeastOneImage ? "ok" : "" },
    { key: "tamanho", label: "Tamanho", value: editProduto.tamanhos?.length ? "ok" : "" },
    { key: "vendas", label: "Quantidade de vendas", value: editProduto.vendas >= 0 ? String(editProduto.vendas) : "" },
  ];

  const canSave = requiredFields.every((field) => field.value);

  const colorNames = Array.from(
    new Set([
      ...COLOR_LIST,
      ...editProduto.cores
        .filter((cor) => cor.custom)
        .map((cor) => cor.nome),
    ])
  );

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    if (editProduto) {
      setShowPromotionFields(Boolean(editProduto.emPromocao));
      setPrecoInput(
        editProduto.preco
          ? editProduto.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : ""
      );
      setPrecoPromocionalInput(
        editProduto.precoPromocional
          ? editProduto.precoPromocional.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : ""
      );
    }
  }, [editProduto]);

  const handleFieldFocus = (field: string) => {
    setRequiredTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleAddCustomColor = () => {
    const nome = customColorName.trim();
    if (!nome) return;

    const cores = [customColorA, ...(showSecondColor && customColorB ? [customColorB] : [])];
    const novoCor = {
      nome,
      cores,
      custom: true,
    };

    const existingIndex = editProduto.cores.findIndex((c) => c.nome === nome);
    const updatedCores =
      existingIndex >= 0
        ? editProduto.cores.map((c, index) => (index === existingIndex ? novoCor : c))
        : [...editProduto.cores, novoCor];

    setEditProduto({ ...editProduto, cores: updatedCores });
    setCustomColorName("");
    setCustomColorA("#F4845F");
    setCustomColorB("#FFFFFF");
    setShowSecondColor(false);
  };

  const handleRemoveCustomColor = (nome: string) => {
    setEditProduto({
      ...editProduto,
      cores: editProduto.cores.filter((c) => c.nome !== nome),
    });
  };

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
          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
              Nome do produto
              <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
              value={editProduto.nome}
              onFocus={() => handleFieldFocus("nome")}
              onChange={(e) =>
                setEditProduto({ ...editProduto, nome: e.target.value })
              }
              placeholder="Nome do produto"
            />
            {!editProduto.nome?.trim() && requiredTouched.nome && (
              <p className="mt-1 text-xs text-red-500">Preencha este campo.</p>
            )}
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
              Descrição
              <span className="text-red-500">*</span>
            </label>
            <textarea
              ref={descricaoRef}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition resize-none overflow-hidden"
              value={editProduto.descricao}
              onFocus={() => handleFieldFocus("descricao")}
              onChange={(e) =>
                setEditProduto({ ...editProduto, descricao: e.target.value })
              }
              onInput={(e) => autoResize(e.currentTarget)}
              placeholder="Descrição do produto: Ex: Feito especialmente para festas, cores podem ser personalizadas."
            />
            {!editProduto.descricao?.trim() && requiredTouched.descricao && (
              <p className="mt-1 text-xs text-red-500">Preencha este campo.</p>
            )}
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
              Preço
              <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
              value={precoInput}
              onFocus={() => handleFieldFocus("preco")}
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
            {!editProduto.preco && requiredTouched.preco && (
              <p className="mt-1 text-xs text-red-500">Preencha este campo.</p>
            )}
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={editProduto.emPromocao || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setEditProduto({
                    ...editProduto,
                    emPromocao: checked,
                  });
                  setShowPromotionFields(checked);
                }}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Marcar como produto em promoção
            </label>

            {showPromotionFields && (
              <div className="mt-3">
                <label className="mb-1 flex items-center gap-1 text-sm text-gray-600">
                  Preço promocional
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
                  value={precoPromocionalInput}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/\D/g, "");
                    const numberValue = Number(numeric) / 100;

                    setPrecoPromocionalInput(
                      numberValue
                        ? numberValue.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : ""
                    );

                    setEditProduto({
                      ...editProduto,
                      precoPromocional: numberValue || null,
                    });
                  }}
                  placeholder="R$ 0,00"
                />
              </div>
            )}
          </div>

          {/* CATEGORIA E SUBCATEGORIA */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
              <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                Categorias
                <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((categoria) => {
                  const selected = categoriasSelecionadas.includes(categoria.slug);
                  return (
                    <button
                      key={categoria.slug}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? categoriasSelecionadas.filter((item) => item !== categoria.slug)
                          : [...categoriasSelecionadas, categoria.slug];

                        setEditProduto({
                          ...editProduto,
                          categoria: next[0] || "",
                          categorias: next,
                        });
                        handleFieldFocus("categoria");
                      }}
                      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                        selected
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 ring-1 ring-gray-200"
                      }`}
                    >
                      {categoria.label}
                    </button>
                  );
                })}
              </div>
              {!categoriasSelecionadas.length && requiredTouched.categoria && (
                <p className="mt-2 text-xs text-red-500">Selecione pelo menos uma categoria.</p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
              <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
                Subcategorias
              </label>
              <div className="flex flex-wrap gap-2">
                {subcategoriasDisponiveis.map((subcategoria) => {
                  const selected = subcategoriasSelecionadas.includes(subcategoria);
                  return (
                    <button
                      key={subcategoria}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? subcategoriasSelecionadas.filter((item) => item !== subcategoria)
                          : [...subcategoriasSelecionadas, subcategoria];

                        setEditProduto({
                          ...editProduto,
                          subcategoria: next[0] || "",
                          subcategorias: next,
                        });
                        handleFieldFocus("categoria");
                      }}
                      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                        selected
                          ? "bg-[#5C3D31] text-white"
                          : "bg-white text-gray-700 ring-1 ring-gray-200"
                      }`}
                    >
                      {subcategoria}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {colorNames.map((cor) => {
              const selected = editProduto.cores.some((c) => c.nome === cor);
              const corData = editProduto.cores.find((c) => c.nome === cor);
              const swatchStyle = corData?.custom
                ? corData.cores?.length && corData.cores.length > 1
                  ? {
                      background: `linear-gradient(90deg, ${corData.cores[0]} 0%, ${corData.cores[1]} 100%)`,
                    }
                  : {
                      backgroundColor: corData.cores?.[0] || "#F4845F",
                    }
                : { backgroundColor: COR_MAP[cor] || "#E4D0C5" };

              return (
                <button
                  key={cor}
                  onClick={() => {
                    handleFieldFocus("cor");
                    onOpenColorImage(cor);
                  }}
                  className={`relative w-10 h-10 rounded-full overflow-hidden transition-all ${
                    selected
                      ? "ring-2 ring-offset-1 ring-offset-white ring-primary scale-105"
                      : "hover:scale-105"
                  }`}
                  style={swatchStyle}
                >
                  {corData?.imagem && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={corData.imagem ?? undefined}
                        className="h-full w-full object-cover"
                        alt={cor}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {!editProduto.cores.length && requiredTouched.cor && (
            <p className="mt-2 text-xs text-red-500">
              Selecione pelo menos uma cor e adicione uma imagem.
            </p>
          )}

          {!editProduto.cores.length && requiredTouched.cor && (
            <p className="mt-2 text-xs text-red-500">
              Selecione pelo menos uma cor.
            </p>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Cores personalizadas
              </label>
              <button
                type="button"
                onClick={() => setShowCustomColorForm((value) => !value)}
                className="text-sm font-medium text-primary"
              >
                {showCustomColorForm ? "Ocultar" : "Adicionar"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Crie uma opção com um nome e uma ou duas cores.
            </p>

            {showCustomColorForm && (
              <div className="mt-3 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-3">
                <input
                  type="text"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  placeholder="Nome da opção personalizada"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
                />

                <div className="mt-3 flex items-center gap-3">
                  <label className="flex-1 text-xs font-medium text-gray-600">
                    Cor 1
                    <input
                      type="color"
                      value={customColorA}
                      onChange={(e) => setCustomColorA(e.target.value)}
                      className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
                    />
                  </label>

                  {showSecondColor && (
                    <label className="flex-1 text-xs font-medium text-gray-600">
                      Cor 2
                      <input
                        type="color"
                        value={customColorB}
                        onChange={(e) => setCustomColorB(e.target.value)}
                        className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
                      />
                    </label>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSecondColor((value) => !value)}
                    className="rounded-full border border-orange-200 px-3 py-2 text-sm font-medium text-primary"
                  >
                    {showSecondColor ? "Remover segunda cor" : "Adicionar segunda cor"}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="rounded-full bg-primary px-3 py-2 text-sm font-medium text-white"
                  >
                    Adicionar opção
                  </button>
                </div>
              </div>
            )}

            {editProduto.cores.filter((c) => c.custom).length > 0 && (
              <div className="mt-3 space-y-2">
                {editProduto.cores
                  .filter((c) => c.custom)
                  .map((cor) => (
                    <div
                      key={cor.nome}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                          {cor.cores && cor.cores.length > 1 ? (
                            <div
                              className="h-full w-full"
                              style={{
                                background: `linear-gradient(90deg, ${cor.cores[0]} 0%, ${cor.cores[1]} 100%)`,
                              }}
                            />
                          ) : (
                            <div
                              className="h-full w-full"
                              style={{ backgroundColor: cor.cores?.[0] || "#F4845F" }}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{cor.nome}</p>
                          <p className="text-xs text-gray-500">
                            {cor.cores?.join(" + ") || "Cor personalizada"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCustomColor(cor.nome)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
              </div>
            )}
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
                      onClick={() => {
                        handleFieldFocus("imagem");
                        setEditProduto({
                          ...editProduto,
                          imagem: cor.imagem ?? "",
                        });
                      }}
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
                        novos = novos.filter((t) => t.nome !== tamanho);
                      } else {
                        novos.push({ nome: tamanho, cm: "" });
                      }

                      setEditProduto({
                        ...editProduto,
                        tamanhos: novos,
                      });
                      handleFieldFocus("tamanho");
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
                    onFocus={() => handleFieldFocus("tamanho")}
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
            {!editProduto.tamanhos.length && requiredTouched.tamanho && (
              <p className="mt-2 text-xs text-red-500">Selecione pelo menos um tamanho.</p>
            )}
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
                  onFocus={() => handleFieldFocus("vendas")}
                  onChange={(e) =>
                    setEditProduto({
                      ...editProduto,
                      vendas: Math.max(0, Number(e.target.value)),
                    })
                  }
                  placeholder="Ex: 100"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition"
                />
                {!editProduto.vendas && requiredTouched.vendas && (
                  <p className="mt-1 text-xs text-red-500">Preencha este campo.</p>
                )}
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
              {!hasColors && requiredTouched.cor && (
                <p className="mt-2 text-xs text-red-500">
                  Selecione pelo menos uma cor.
                </p>
              )}
              setIsSaving(true);

              const missing = requiredFields.filter((field) => !field.value);
              if (missing.length) {
                setRequiredTouched(
                  Object.fromEntries(
                    requiredFields.map((field) => [field.key, true])
                  )
                );
                setIsSaving(false);
                return;
              }

              onClose();

              try {
                await onSave(editProduto);

                if (onSaveToDatabase) {
                  await onSaveToDatabase(editProduto);
                }
              } catch (error) {
                console.error("Erro ao salvar nos bastidores:", error);
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving || !canSave}
            className={`flex-1 py-3 rounded-full text-white transition-colors ${
              isSaving || !canSave
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary hover:opacity-90"
            }`}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}