'use client';

import Link from 'next/link';
import ProductCard from '@/components/produto/ProductCard';
import produtosData from '@/data/produtos.json';

export default function DestaquesPage() {
  const produtos = produtosData.filter((p) => p.destaque && p.ativo);

  return (
    <div className="min-h-screen pt-26">
      <div className="bg-linear-to-br from-[#FDF6F0] to-[#F9EDE5] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-[#A67C6D] mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#3D261D] font-medium">Destaques</span>
          </nav>
          <h1 className="text-4xl font-bold text-[#3D261D] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Destaques</h1>
          <p className="text-[#7D5547]">Produtos em destaque selecionados manualmente.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {produtos.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎀</div>
            <h3 className="text-2xl font-bold text-[#3D261D] mb-2">Nenhum destaque encontrado</h3>
            <p className="text-[#A67C6D] mb-6">Ainda não temos produtos destacados.</p>
            <Link href="/" className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-[#D95F35] transition-colors">Voltar ao início</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
