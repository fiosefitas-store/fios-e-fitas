'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { productsService } from '@/app/api/services/productsService';
import ProductCard from '@/components/produto/ProductCard'; // O Card de produto corrigido

// Tipo local para mapear a coleção vinda da sua API interna
interface ColecaoDoBanco {
  id: string;
  titulo: string;
  capa: string | null;
  produtoIds: string[];
}

export default function ColecaoPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [produtosBase, setProdutosBase] = useState<any[]>([]);
  const [colecoes, setColecoes] = useState<ColecaoDoBanco[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Destaques');

  // Função para transformar títulos em Slugs de URL limpos (ex: "Copa do Mundo" -> "copa-do-mundo")
  const gerarSlug = (texto: string) => {
    if (!texto) return "";
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9\s-]/g, "")    // Remove caracteres especiais inválidos
      .replace(/\s+/g, "-")            // Substitui espaços por hifens
      .trim();
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // 1. Carrega todos os produtos ativos do banco
        const prods = await productsService.getAll();
        setProdutosBase(prods);

        // 2. Carrega as coleções direto da rota de API que você mostrou
        const resColecoes = await fetch('/api/admin/sazonal');
        if (resColecoes.ok) {
          const dadosColecoes = await resColecoes.json();
          setColecoes(dadosColecoes);
        }
      } catch (error) {
        console.error('Erro ao carregar os dados da coleção:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Encontra qual coleção bate com o slug da URL atual
    const colecaoAtual = useMemo(() => {
    return colecoes.find((c) => c.id === slug || gerarSlug(c.titulo) === slug);
    }, [colecoes, slug]);

  // Filtra e ordena os produtos pertencentes a essa coleção específica
  const produtosFiltrados = useMemo(() => {
    if (!colecaoAtual) return [];

    // Filtra para pegar somente os produtos ativos cujos IDs estão dentro de 'produtoIds' da coleção
    let filtrados = produtosBase.filter(
      (produto) =>
        produto.ativo && 
        colecaoAtual.produtoIds.includes(String(produto.id))
    );

    // Ordenação idêntica à do filtro de categorias
    return [...filtrados].sort((a, b) => {
      if (sortBy === 'Menor Preço') return a.preco - b.preco;
      if (sortBy === 'Maior Preço') return b.preco - a.preco;
      if (sortBy === 'Popularidade') return (b.vendas || 0) - (a.vendas || 0);
      return 0;
    });
  }, [produtosBase, colecaoAtual, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <div className="animate-pulse text-[#3D261D] font-medium text-lg">
          Carregando coleção especial...
        </div>
      </div>
    );
  }

  if (!colecaoAtual) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF9] gap-4">
        <h2 className="text-2xl font-bold text-[#3D261D]">Coleção não encontrada</h2>
        <Link href="/" className="bg-[#F4845F] text-white px-6 py-2 rounded-full font-medium">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] pt-26 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#A67C6D] mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#3D261D] font-medium">
            {colecaoAtual.titulo}
          </span>
        </nav>

        {/* Banner Superior da Coleção (Usa a 'capa' do banco se houver) */}
        <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden bg-[#E4D0C5] flex items-center p-8 md:p-12 mb-8">
          {colecaoAtual.capa && (
            <img 
              src={colecaoAtual.capa} 
              alt={colecaoAtual.titulo} 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          )}
          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl md:text-5xl font-bold text-[#3D261D] drop-shadow-sm">
              {colecaoAtual.titulo}
            </h1>
            <p className="text-sm md:text-base text-[#5C3D31] mt-2 font-medium">
              {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto exclusivo' : 'produtos exclusivos'}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF9]/40 to-transparent pointer-events-none" />
        </div>

        {/* Filtros e Grid de Conteúdo */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Lado Direito / Principal: Grid de Produtos */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-[#A67C6D]">
                Mostrando {produtosFiltrados.length} itens
              </p>

              {/* Seletor de Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#E4D0C5] text-sm text-[#3D261D] rounded-xl px-4 py-2 outline-none focus:border-[#F4845F]"
              >
                <option value="Destaques">Destaques</option>
                <option value="Menor Preço">Menor Preço</option>
                <option value="Maior Preço">Maior Preço</option>
                <option value="Popularidade">Mais Vendidos</option>
              </select>
            </div>

            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#F2E6E2]">
                <p className="text-[#A67C6D]">Esta coleção ainda não possui produtos disponíveis.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {produtosFiltrados.map((produto) => (
                  <ProductCard key={produto.id} produto={produto} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}