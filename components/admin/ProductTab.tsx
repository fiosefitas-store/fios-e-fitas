"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Check,
  X,
} from "lucide-react";

import { Produto } from "../../app/admin/dashboard/page";
import { COR_MAP, COLOR_LIST } from "@/lib/colors";
import { CATEGORIES } from "@/data/categories";

interface Props {
  produtos: Produto[];
  saveProdutos: (produtos: Produto[]) => void;
}

export default function ProductTab({
  produtos,
  saveProdutos,
}: Props) {
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoriaAtual = CATEGORIES.find(
    (c) => c.slug === editProduto?.categoria
  );
  const [precoInput, setPrecoInput] = useState("");
    

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

  const handleSave = () => {
    if (!editProduto) return;

    const exists = produtos.some((p) => p.id === editProduto.id);

    if (exists) {
      saveProdutos(
        produtos.map((p) =>
          p.id === editProduto.id ? editProduto : p
        )
      );
    } else {
      saveProdutos([...produtos, editProduto]);
    }

    setIsModalOpen(false);
    setEditProduto(null);
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
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditProduto({
              id: `produto-${Date.now()}`,
              nome: "",
              descricao: "",
              preco: 0,
              categoria: CATEGORIES[0].slug,
              imagem: "/images/produtos/laco-cetim-rosa.png",
              cores: [],
              corImagens: {},
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
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white"
          style={{ background: "#F4845F" }}
        >
          <Plus size={16} />
          Novo Produto
        </button>
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F2E8E1]">
              <th className="text-left px-6 py-4">Produto</th>
              <th className="text-left px-4 py-4">Categoria</th>
              <th className="text-left px-4 py-4">Preço</th>
              <th className="text-center px-4 py-4">Ativo</th>
              <th className="text-center px-4 py-4">Destaque</th>
              <th className="text-center px-4 py-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtos.map((produto, i) => (
              <tr
                key={produto.id}
                className={`border-b border-[#F9F3EF] ${
                  i % 2 === 0 ? "bg-white" : "bg-[#FDFAF8]"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={produto.imagem}
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg"
                    />

                    <span className="text-sm font-medium text-[#3D261D]">
                      {produto.nome}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  {produto.categoria}
                </td>

                <td className="px-4 py-4 font-semibold text-[#F4845F]">
                  R$ {produto.preco.toFixed(2)}
                </td>

                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => handleToggleAtivo(produto.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                      produto.ativo
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Check size={14} />
                  </button>
                </td>

                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() =>
                      handleToggleDestaque(produto.id)
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                      produto.destaque
                        ? "bg-[#FFF3ED] text-[#F4845F]"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Star
                      size={14}
                      className={
                        produto.destaque ? "fill-[#F4845F]" : ""
                      }
                    />
                  </button>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(produto)}
                      className="p-2"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(produto.id)
                      }
                      className="p-2 text-red-500"
                    >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                Editar Produto
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={editProduto.nome}
                onChange={(e) =>
                  setEditProduto({
                    ...editProduto,
                    nome: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
              />

              <textarea
                placeholder="Descrição"
                value={editProduto.descricao}
                onChange={(e) =>
                  setEditProduto({
                    ...editProduto,
                    descricao: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-xl"
              />

              {/* PREÇO */}
              <input
                type="text"
                placeholder="Preço"
                value={precoInput}
                onChange={(e) => {
                  let value = e.target.value;

                  // remove tudo menos números
                  const numeric = value.replace(/\D/g, "");

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
                    ...editProduto!,
                    preco: numberValue || 0,
                  });
                }}
                className="w-full border p-3 rounded-xl"
              />

              {/* CATEGORIA */}
              <div>
                <label className="block mb-2 font-medium">
                  Categoria
                </label>

                <select
                  value={editProduto.categoria}
                  onChange={(e) =>
                    setEditProduto({
                      ...editProduto,
                      categoria: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl"
                >
                  {CATEGORIES.map((categoria) => (
                    <option
                      key={categoria.slug}
                      value={categoria.slug}
                    >
                      {categoria.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBCATEGORIA */}
              <div>
                <label className="block mb-2 font-medium">
                  Subcategoria
                </label>

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
                  <option value="">
                    Selecione
                  </option>

                  {categoriaAtual?.subcategories.map((sub) => (
                    <option
                      key={sub}
                      value={sub}
                    >
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Cores
                </label>

                <div className="flex flex-wrap gap-3">
                  {COLOR_LIST.map((cor) => {
                    const selected =
                      editProduto.cores.includes(cor);

                    return (
                      <button
                        key={cor}
                        type="button"
                        onClick={() => {
                          const cores = selected
                            ? editProduto.cores.filter(
                                (c) => c !== cor
                              )
                            : [
                                ...editProduto.cores,
                                cor,
                              ];

                          setEditProduto({
                            ...editProduto,
                            cores,
                          });
                        }}
                        className={`w-10 h-10 rounded-full ${
                          selected
                            ? "ring-2 ring-[#F4845F]"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            COR_MAP[cor],
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editProduto.destaque}
                    onChange={(e) =>
                      setEditProduto({
                        ...editProduto,
                        destaque: e.target.checked,
                      })
                    }
                  />

                  Destaque
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editProduto.ativo}
                    onChange={(e) =>
                      setEditProduto({
                        ...editProduto,
                        ativo: e.target.checked,
                      })
                    }
                  />

                  Ativo
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-full border"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-full text-white"
                style={{ background: "#F4845F" }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}