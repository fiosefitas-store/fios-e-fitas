'use client';

import { useState } from 'react';
import ProductCard from '@/components/produto/ProductCard';
import produtosData from '@/data/produtos.json';

export default function ProdutosDestaque() {
  const [filter, setFilter] = useState('Todos');
  const [sort, setSort] = useState('Recentes');

  // Filter destaques
  const destaques = produtosData.filter(p => p.destaque);
  
  // Apply category filter
  let filtered = filter === 'Todos' 
    ? destaques 
    : destaques.filter(p => p.categoria === filter);

  // Apply sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === 'Menor Preço') return a.preco - b.preco;
    if (sort === 'Maior Preço') return b.preco - a.preco;
    if (sort === 'Popularidade') return (b.vendas || 0) - (a.vendas || 0);
    return 0; // Recentes (maintain order)
  });

  const categorias = ['Todos', ...Array.from(new Set(destaques.map(p => p.categoria)))];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h2 className="font-display text-4xl text-[#3D261D] mb-4">Nossos Destaques</h2>
          <p className="text-[#A67C6D] text-lg">As peças mais amadas do nosso atelier.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-[#5C3D31] text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary flex-1 md:flex-none cursor-pointer"
          >
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-[#5C3D31] text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary flex-1 md:flex-none cursor-pointer"
          >
            <option value="Recentes">Mais Recentes</option>
            <option value="Menor Preço">Menor Preço</option>
            <option value="Maior Preço">Maior Preço</option>
            <option value="Popularidade">Popularidade</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {filtered.slice(0, 8).map(produto => (
          <ProductCard key={produto.id} produto={produto as any} />
        ))}
      </div>
    </section>
  );
}
