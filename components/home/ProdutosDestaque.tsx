'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/produto/ProductCard';
import { productsService } from '@/app/api/services/productsService';
import { Produto } from '@/components/admin/Dashboard';

export default function ProdutosDestaque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [sort, setSort] = useState('Recentes');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Busca os produtos direto da API ao carregar o componente
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await productsService.getAll();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos em destaque:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  // Filtra apenas por produtos que são DESTAQUE e estão ATIVOS
  const destaques = produtos.filter(p => p.destaque && p.ativo);

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
      left: dir === 'left' ? -400 : 400,
      behavior: 'smooth',
    });
  };

  return (
    <section className="mt-10 w-full bg-[#dd8649] py-15 pb-20 overflow-hidden">
      <div className="max-w-425 mx-auto flex items-center gap-20 px-8">

        {/* LADO ESQUERDO */}
        <div className="hidden lg:flex flex-col justify-center shrink-0 w-82.5">
          <img
            src="/logo/destaques2.png"
            alt="Nossos destaques"
            className="w-full"
          />
        </div>

        {/* LADO DIREITO */}
        <div className="flex-1 min-w-0">

          {/* HEADER */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2F2A28]">
                <span className="md:hidden">Nossos destaques</span>
                <span className="hidden md:inline">Escolha o seu favorito</span>
              </h2>

              <Link
                href="/todos"
                className="mt-2 md:mt-4 underline text-right md:text-left text-[#fff0e8] font-semibold"
              >
                Ver Todos
              </Link>
            </div>
          </div>

          {/* CAROUSEL */}
          <div className="relative">

            {/* seta esquerda */}
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white shadow-2xl"
            >
              ❮
            </button>

            {/* seta direita */}
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white shadow-2xl"
            >
              ❯
            </button>

            {loading ? (
              // Esqueleto/Loading básico enquanto os dados caem do Supabase
              <div className="flex gap-4 overflow-x-auto JSON animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex-none w-62.5 h-80 bg-orange-200/50 rounded-2xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-white font-medium">
                Nenhum produto em destaque no momento.
              </div>
            ) : (
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar snap-x snap-mandatory"
              >
                {filtered.slice(0, 8).map((produto) => (
                  <div
                    key={produto.id}
                    className="flex-none w-62.5 snap-proximity"
                  >
                    <ProductCard produto={produto} />
                  </div>
                ))}
              </div>
            )}

          </div>

          {!loading && filtered.length > 0 && (
            <p className="md:hidden mt-6 text-sm text-[#ffc4a4] text-center">
              ← Deslize para ver mais →
            </p>
          )}

        </div>

      </div>
    </section>
  );
}