'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import ProductCard from '@/components/produto/ProductCard';
import { productsService } from '@/app/api/services/productsService';
import { Produto } from '@/components/admin/Dashboard';
import { CATEGORY_MAP } from '@/data/categories';
import CategorySidebar from './CategorySidebar';

export default function CategoriaPage() {
  const params = useParams();
  // Garante que o slug venha em minúsculo para bater com o objeto CATEGORY_MAP
  const slug = (params?.slug as string)?.toLowerCase();

  const category = CATEGORY_MAP[slug];
  const categoriaLabel = category?.label || slug;

  const [produtosBase, setProdutosBase] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Menor Preço');
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

  // Verifica se é a página de amigurumi
  const isAmigurumi = slug === 'amigurumi';

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await productsService.getAll();
        setProdutosBase(data);

        console.log("Categorias vindas do banco:", data.map(p => p.categoria));
        console.log("Categoria esperada nesta página:", categoriaLabel);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [categoriaLabel]);

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubs((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory]
    );
  };
  
  const normalizar = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/-/g, "")               // Remove hífens (transforma "kits-presente" em "kitspresente")
      .replace(/\s+/g, "")             // Remove todos os espaços
      .trim();
  };


  // 1. Determina as subcategorias
  const subcategories = useMemo(() => {
    const subsEstaticas = category?.subcategories || [];

    const subsDoBanco = produtosBase
      .filter((p) => {
        const catBanco = normalizar(p.categoria);
        // Compara com o Label ("Kits Presente") ou com o Slug ("kits-presente")
        return p.ativo && (catBanco === normalizar(categoriaLabel) || catBanco === normalizar(slug));
      })
      .map((p) => p.subcategoria as string);

    return Array.from(new Set([...subsEstaticas, ...subsDoBanco]));
  }, [produtosBase, category, categoriaLabel, slug]);

  // 2. Filtra e ordena os produtos
  const produtosFiltrados = useMemo(() => {
    let filtered = produtosBase.filter((produto) => {
      const catBanco = normalizar(produto.categoria);
      // Aceita se for igual ao formato com espaço ("Kits Presente") ou com hífen ("kits-presente")
      return produto.ativo && (catBanco === normalizar(categoriaLabel) || catBanco === normalizar(slug));
    });

    if (selectedSubs.length > 0) {
      filtered = filtered.filter((produto) =>
        produto.subcategoria && selectedSubs.includes(produto.subcategoria)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'Menor Preço') return a.preco - b.preco;
      if (sortBy === 'Maior Preço') return b.preco - a.preco;
      if (sortBy === 'Popularidade') return (b.vendas || 0) - (a.vendas || 0);
      return 0;
    });

    return filtered;
  }, [produtosBase, categoriaLabel, slug, selectedSubs, sortBy]);

  return (
    <div className="min-h-screen bg-[#f6e6d5] pt-15">
      {/* Hero */}
      <section className="bg-[#ffffff] border-b border-[#EEE2D9]">
        <div className="max-w-7xl mx-auto px-4 py-10 mb-3">
          <h1
            className="md:text-6xl text-4xl font-bold text-[#3D261D]"
          >
            {categoriaLabel}
          </h1>

          <p className="mt-2 text-[#7D5547]">
            {loading ? (
              <span className="inline-block w-24 h-4 bg-gray-200 animate-pulse rounded" />
            ) : (
              `${produtosFiltrados.length} produto${produtosFiltrados.length !== 1 ? 's' : ''} encontrado${produtosFiltrados.length !== 1 ? 's' : ''}`
            )}
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <nav className="flex items-center gap-2 text-sm text-[#A67C6D] mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={15} />
          <span className="text-[#3D261D] font-medium">{categoriaLabel}</span>
        </nav>

        <div className="flex gap-8">
          <CategorySidebar
            subcategories={subcategories}
            selectedSubs={selectedSubs}
            onToggle={toggleSubcategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            hideCategories={isAmigurumi}
          />

          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-full h-96 bg-white/60 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : produtosFiltrados.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 border text-center">
                <div className="text-6xl mb-5">🎀</div>
                <h2
                  className="text-3xl font-bold text-[#3D261D]"
                  style={{ fontFamily: 'var(--font-display)' }}
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
                  Voltar à Home
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {produtosFiltrados.map((produto) => (
                  <ProductCard key={produto.id} produto={produto} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}