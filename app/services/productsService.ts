import { Produto } from "@/app/admin/dashboard/page";

const API_URL = "/api/admin/products";

export const productsService = {
  async getAll(): Promise<Produto[]> {
    const res = await fetch(API_URL);
    return res.json();
  },

  async create(produto: Produto): Promise<Produto> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });

    if (!res.ok) throw new Error("Erro ao criar produto");
    return res.json();
  },

  async update(produto: Produto): Promise<Produto> {
    const { reviewsCount, ...clean } = produto;

    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clean),
    });

    if (!res.ok) {
      const err = await res.text();
      console.log(err);
      throw new Error("Erro ao atualizar produto");
    }

    return res.json();
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao deletar produto");
  },
};