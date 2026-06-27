'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// IMPORTAÇÃO DO SERVIÇO DO BANCO (Substituindo o JSON estático)
import { productsService } from '@/app/api/services/productsService';
import { Produto } from '@/components/admin/Dashboard';

import ProductGallery from '../ProductGallery';
import ProductData from '../ProductData';

export default function ProdutoPage() {
  const params = useParams();
  const id = params?.id as string;

  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');

  // Busca os dados do produto no banco em tempo real baseado no ID da URL
  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const data = await productsService.getAll();
        // Encontra o produto garantindo que ambos os IDs virem String para não dar erro de tipo
        const produtoEncontrado = data.find((p) => String(p.id) === String(id));

        if (produtoEncontrado) {
          setProduto(produtoEncontrado);
          setMainImage(produtoEncontrado.imagem);
        }
      } catch (error) {
        console.error('Erro ao carregar o produto:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduto();
  }, [id]);

  // Enquanto a API do banco responde, exibe uma mensagem amigável de carregamento
  if (loading) {
    return (
      <div className="min-h-screen pt-26 flex items-center justify-center bg-bg">
        <div className="animate-pulse text-[#3D261D] font-medium text-lg">
          Carregando detalhes do produto...
        </div>
      </div>
    );
  }

  // Se terminou de carregar e realmente não achou nada no banco
  if (!produto) {
    return (
      <div className="min-h-screen pt-26 flex items-center justify-center bg-bg">
        <div className="text-center">
          <h2
            className="text-3xl font-bold text-[#3D261D] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Produto não encontrado
          </h2>

          <Link href="/" className="text-primary underline">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  // Monta a URL da categoria dinamicamente para o breadcrumb de forma limpa
  const categoriaSlug = produto.categoria
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, '-');           // Substitui espaços por hifens

  return (
    <div className="min-h-screen pt-26 bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#A67C6D] mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>

          <ChevronRight size={14} />

          <Link
            href={`/categoria/${categoriaSlug}`}
            className="hover:text-primary transition-colors"
          >
            {produto.categoria}
          </Link>

          <ChevronRight size={14} />

          <span className="text-[#3D261D] font-medium line-clamp-1">
            {produto.nome}
          </span>
        </nav>

        {/* Detalhes do Produto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery
            produto={produto}
            mainImage={mainImage}
            setMainImage={setMainImage}
          />

          <ProductData produto={produto} setMainImage={setMainImage} />
        </div>
      </div>
    </div>
  );
}