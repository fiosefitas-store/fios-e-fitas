'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/produto/ProductCard';
import { productsService } from '@/app/api/services/productsService';

export default function TodosPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Define o título da página dinamicamente no navegador
  useEffect(() => {
    document.title = 'Todos os Produtos';
  }, []);

  // Carrega os produtos direto do banco de dados
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const dados = await productsService.getAll();
        // Filtra para exibir apenas os produtos que estão ativos
        const ativos = dados.filter((p: any) => p.ativo !== false);
        setProdutos(ativos);
      } catch (error) {
        console.error('Erro ao carregar todos os produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-pulse text-[#3D261D] font-medium text-lg">
          Carregando catálogo completo...
        </div>
      </div>
    );
  }

  return (
    <main className="py-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <h1 
        className="mt-10 font-bold text-4xl md:text-6xl text-[#3D261D] mb-10 "
      >
        Todos os Produtos
      </h1>

      {produtos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#F2E6E2]">
          <p className="text-[#A67C6D]">Nenhum produto disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <div key={produto.id} className="w-full">
              <ProductCard produto={produto} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}