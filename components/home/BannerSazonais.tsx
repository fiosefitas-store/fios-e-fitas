'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Colecao {
  id: string;
  titulo: string;
  capa: string | null;
  produtoIds: string[];
}

export default function CategoriasDestaque() {
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca as coleções cadastradas na mesma rota que o painel Admin usa
  useEffect(() => {
    const fetchColecoes = async () => {
      try {
        const res = await fetch('/api/admin/sazonal');
        if (res.ok) {
          const data = await res.json();
          setColecoes(data);
        }
      } catch (error) {
        console.error('Erro ao buscar coleções especiais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColecoes();
  }, []);

  return (
    <section className="mt-15 mb-10 w-full">
      <div className="max-w-11/12 mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {loading ? (
          // Colocando parênteses ao redor do mapeamento resolve o problema do TypeScript
          ([1, 2, 3, 4].map((n) => (
            <div 
              key={n} 
              className="relative aspect-square bg-amber-100/40 rounded-2xl animate-pulse" 
            />
          )))
        ) : colecoes.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 font-medium">
              Nenhuma coleção especial cadastrada no momento.
            </div>
          ) : (
          // Mapeia as coleções dinâmicas salvos no Supabase (limita em até 4 na Home)
          colecoes.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              // Redireciona para a página interna da coleção usando o ID único
              href={`/colecao/${cat.id}`}
              className="relative aspect-square group overflow-hidden rounded-md"
            >
              <img
                src={cat.capa || '/images/produtos/placeholder.png'} // Fallback se não tiver capa
                alt={cat.titulo}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Camada de sobreposição escura */}
              <div className="absolute inset-0 bg-[#3D261D]/50 group-hover:bg-[#3D261D]/70 transition-colors duration-300" />

              {/* Informações da Coleção */}
              <div className="absolute inset-0 flex flex-col justify-end items-center text-center uppercase tracking-wider p-6">
                <h3 className="font-medium text-3xl text-white mb-4 line-clamp-2 px-2">
                  {cat.titulo}
                </h3>

                <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-medium text-sm uppercase tracking-wider">
                    Ver Produtos
                  </span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}