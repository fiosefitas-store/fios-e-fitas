'use client';

import { useState, useRef } from 'react';
import ProductCard from '@/components/produto/ProductCard';
import produtosData from '@/data/produtos.json';

export default function ProdutosDestaque() {
  const [filter, setFilter] = useState('Todos');
  const [sort, setSort] = useState('Recentes');

  const scrollRef = useRef<HTMLDivElement>(null);

  const destaques = produtosData.filter(p => p.destaque);

  let filtered =
    filter === 'Todos'
      ? destaques
      : destaques.filter((p) => p.categoria === filter);

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'Menor Preço') return a.preco - b.preco;
    if (sort === 'Maior Preço') return b.preco - a.preco;
    if (sort === 'Popularidade') return (b.vendas || 0) - (a.vendas || 0);
    return 0;
  });

  const categorias = [
    'Todos',
    ...Array.from(new Set(destaques.map((p) => p.categoria))),
  ];

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -350 : 350,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h2 className="font-display text-4xl text-[#3D261D] mb-4 uppercase">Nossos Destaques</h2>
          <p className="text-[#A67C6D] text-lg flex items-center gap-3">
            <span>As peças mais amadas do nosso atelier.</span>
            <a href="/destaques" className="text-[#F4845F] font-semibold hover:underline">Ver todos</a>
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-[#5C3D31] text-sm flex-1 md:flex-none"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-[#5C3D31] text-sm flex-1 md:flex-none"
          >
            <option value="Recentes">Mais Recentes</option>
            <option value="Menor Preço">Menor Preço</option>
            <option value="Maior Preço">Maior Preço</option>
            <option value="Popularidade">Popularidade</option>
          </select>
        </div>
      </div>

      {/* WRAPPER */}
      <div className="relative">
        {/* SETA ESQUERDA */}
        <button
          onClick={() =>
            document.getElementById('products-scroll')?.scrollBy({
              left: -400,
              behavior: 'smooth',
            })
          }
          className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white shadow-lg rounded-full items-center justify-center"
        >
          ‹
        </button>

        {/* SETA DIREITA */}
        <button
          onClick={() =>
            document.getElementById('products-scroll')?.scrollBy({
              left: 400,
              behavior: 'smooth',
            })
          }
          className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white shadow-lg rounded-full items-center justify-center"
        >
          ›
        </button>

        {/* LISTA (SEMPRE 1 LINHA NO PC) */}
        <div
          id="products-scroll"
          className="
            flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar
            md:flex-nowrap md:overflow-x-auto md:gap-8
          "
        >
          {filtered.slice(0, 8).map((produto) => (
            <div
              key={produto.id}
              className="snap-start flex-none w-[75%] sm:w-[45%] md:w-[280px]"
            >
              <ProductCard produto={produto as any} />
            </div>
          ))}
        </div>
      </div>
  </section>
  );
}