'use client';

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { productsService } from '@/app/api/services/productsService';

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [produtos, setProdutos] = useState<any[]>([]);
  const [resultados, setResultados] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 1. Carrega os produtos ativos do banco uma vez para pesquisa local rápida
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await productsService.getAll();
        setProdutos(data.filter((p: any) => p.ativo !== false));
      } catch (error) {
        console.error('Erro ao carregar produtos para a busca:', error);
      }
    };
    fetchProdutos();
  }, []);

  // 2. Filtra os produtos conforme o usuário digita
  useEffect(() => {
    if (query.trim() === '') {
      setResultados([]);
      return;
    }

    const termo = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const filtrados = produtos.filter((p) => {
      const nomeLimpo = p.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const categoriaLimpa = (p.categoria || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      return nomeLimpo.includes(termo) || categoriaLimpa.includes(termo);
    });

    setResultados(filtrados.slice(0, 5)); // Limita a 5 resultados para o dropdown ficar elegante
  }, [query, produtos]);

  // 3. Fecha o dropdown se o usuário clicar fora da busca
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (id: string) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/produto/${id}`);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xs md:max-w-sm">
      {/* Barra de Input */}
      <div className="relative flex items-center bg-[#FDFAF8] border border-[#E4D0C5] rounded-full px-10 py-2 focus-within:border-primary transition-all">
        <SearchIcon size={18} className="text-[#A67C6D] mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-transparent text-sm text-[#3D261D] placeholder-[#A67C6D] outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-[#A67C6D] hover:text-[#3D261D] ml-1">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown de Resultados */}
      {isOpen && query.trim() !== '' && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl border border-[#F2E6E2] shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          {resultados.length > 0 ? (
            <div className="py-2">
              <p className="px-4 py-1 text-xs font-bold text-[#A67C6D] uppercase tracking-wider">
                Produtos Encontrados
              </p>
              {resultados.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProduct(p.id)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#FFF3ED] transition-colors text-left"
                >
                  <img
                    src={p.imagem}
                    alt={p.nome}
                    className="w-10 h-10 object-cover rounded-lg bg-gray-50 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-medium text-[#3D261D] truncate">{p.nome}</h4>
                    <p className="text-xs text-[#A67C6D]">
                      {Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-[#A67C6D]">
              Nenhum produto encontrado 😔
            </div>
          )}
        </div>
      )}
    </div>
  );
}