// app/produto/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import produtosData from '@/data/produtos.json';

import ProductGallery from '../ProductGallery';
import ProductData from '../ProductData';

export default function ProdutoPage() {
  const params = useParams();
  const id = params?.id as string;

  const produto = produtosData.find((p) => p.id === id);

  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    if (produto) {
      setMainImage(produto.imagem);
    }
  }, [produto]);

  if (!produto) {
    return (
      <div className="min-h-screen pt-[104px] flex items-center justify-center">
        <div className="text-center">
          <h2
            className="text-3xl font-bold text-[#3D261D] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Produto não encontrado
          </h2>

          <Link
            href="/"
            className="text-[#F4845F] underline"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[104px] bg-[#FDFAF8]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#A67C6D] mb-8">
          <Link
            href="/"
            className="hover:text-[#F4845F] transition-colors"
          >
            Home
          </Link>

          <ChevronRight size={14} />

          <Link
            href={`/categoria/${produto.categoria
              .toLowerCase()
              .replace(/ /g, '-')
              .replace('ç', 'c')
              .replace('ê', 'e')}`}
            className="hover:text-[#F4845F] transition-colors"
          >
            {produto.categoria}
          </Link>

          <ChevronRight size={14} />

          <span className="text-[#3D261D] font-medium line-clamp-1">
            {produto.nome}
          </span>
        </nav>

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