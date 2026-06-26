'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import ProductCard from '@/components/produto/ProductCard';
import produtosData from '@/data/produtos.json';
import { CATEGORY_MAP } from '@/data/categories';
import CategorySidebar from './CategorySidebar';


export default function CategoriaPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = CATEGORY_MAP[slug];

  const categoria = category?.label || slug;
  const subcategories = category?.subcategories || [];
  
  const isAmigurime = slug?.toLowerCase() === 'amigurumi';

  const [sortBy, setSortBy] = useState('preco-asc');
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);


  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubs((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory]
    );
  };


  const produtos = useMemo(() => {
    let filtered = produtosData.filter(
      (produto) =>
        produto.ativo &&
        produto.categoria === categoria
    );

    if (selectedSubs.length > 0) {
      filtered = filtered.filter((produto) =>
        selectedSubs.includes(produto.subcategoria)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'Menor Preço') return a.preco - b.preco;
      if (sortBy === 'Maior Preço') return b.preco - a.preco;
      if (sortBy === 'Popularidade') return (b.vendas || 0) - (a.vendas || 0);
      return 0;
    });

    return filtered;
  }, [categoria, selectedSubs, sortBy]);

  return (
    <div className="min-h-screen bg-[#f6e6d5] pt-15">

      {/* Hero */}

      <section className="bg-[#ffffff] border-b border-[#EEE2D9]">
        <div className="max-w-7xl mx-auto px-4 py-10">

          <h1
            className="text-4xl font-bold text-[#3D261D]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {categoria}
          </h1>

          <p className="mt-2 text-[#7D5547]">
            {produtos.length} produto
            {produtos.length !== 1 ? 's' : ''}
            {' '}encontrado
            {produtos.length !== 1 ? 's' : ''}
          </p>

        </div>
      </section>

      {/* Conteúdo */}

      <section className="max-w-7xl mx-auto px-4 py-10">

        <nav className="flex items-center gap-2 text-sm text-[#A67C6D] mb-6">
          <Link
            href="/"
            className="hover:text-primary transition-colors"
          >
            Home
          </Link>

          <ChevronRight size={15} />

          <span className="text-[#3D261D] font-medium">
            {categoria}
          </span>
        </nav>

        <div className="flex gap-8">

          <CategorySidebar
            subcategories={subcategories}
            selectedSubs={selectedSubs}
            onToggle={toggleSubcategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            hideCategories={isAmigurime}
          />

          <main className="flex-1">
            {/* Produtos */}

            {produtos.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 border text-center">

                <div className="text-6xl mb-5">
                  🎀
                </div>

                <h2
                  className="text-3xl font-bold text-[#3D261D]"
                  style={{
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Nenhum produto encontrado
                </h2>

                <p className="mt-3 text-[#8B6D60]">
                  Tente remover algum filtro ou volte mais tarde.
                </p>

                <Link
                  href="/"
                  className="inline-flex mt-8 rounded-full bg-primary px-6 py-3 text-white font-semibold hover:opacity-90 transition"
                >
                  Voltar a home
                </Link>

              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

                {produtos.map((produto) => (
                  <ProductCard
                    key={produto.id}
                    produto={produto}
                  />
                ))}

              </div>
            )}

          </main>

        </div>

      </section>

    </div>
  );
}