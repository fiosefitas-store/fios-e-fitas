// components/produto/ProductData.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  Heart,
  Check,
  ShoppingBag,
} from 'lucide-react';

import { useCart } from '@/hooks/useCart';

type Props = {
  produto: any;
};

export default function ProductData({ produto }: Props) {
  const { dispatch } = useCart();

  const [selectedCor, setSelectedCor] = useState('');
  const [selectedTamanho, setSelectedTamanho] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [personalizacao, setPersonalizacao] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (produto) {
      setSelectedCor(produto.cores[0] || '');
      setSelectedTamanho(produto.tamanhos[0] || '');
      setSelectedMaterial(produto.materiais[0] || '');

      const favs = JSON.parse(
        localStorage.getItem('fiosefitas_favorites') || '[]'
      );

      setIsFavorite(favs.includes(produto.id));
    }
  }, [produto]);

  const toggleFavorite = () => {
    const favs = JSON.parse(
      localStorage.getItem('fiosefitas_favorites') || '[]'
    );

    const next = isFavorite
      ? favs.filter((i: string) => i !== produto.id)
      : [...favs, produto.id];

    localStorage.setItem(
      'fiosefitas_favorites',
      JSON.stringify(next)
    );

    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1,
        cor: selectedCor,
        tamanho: selectedTamanho,
        material: selectedMaterial,
        personalizacao,
        imagem: produto.imagem,
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const corMap: Record<string, string> = {
    Rosa: '#F2A7BB',
    'Rosa Bebê': '#FBCFE8',
    Branco: '#F9FAFB',
    Lilás: '#C4B5FD',
    Laranja: '#F4845F',
    Coral: '#FB923C',
    Amarelo: '#FCD34D',
    Vermelho: '#EF4444',
    Bege: '#D5B99B',
    Natural: '#C9A898',
    'Azul Bebê': '#BAE6FD',
    'Azul Claro': '#93C5FD',
    Cinza: '#D1D5DB',
    Bordô: '#9F1239',
    Vinho: '#7F1D1D',
    'Verde Escuro': '#14532D',
    'Azul Marinho': '#1E3A5F',
    'Verde Menta': '#6EE7B7',
    Caramelo: '#B45309',
  };

  const descriptions = [
    'Produzido artesanalmente com materiais selecionados',
    `Disponível nas cores: ${produto.cores.join(', ')}`,
    `Tamanhos: ${produto.tamanhos.join(', ')}`,
    '100% personalizável conforme sua preferência',
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A67C6D] mb-2 block">
              {produto.categoria}
            </span>

            <h1
              className="text-3xl font-bold text-[#3D261D] leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {produto.nome}
            </h1>
          </div>

          <button
            onClick={toggleFavorite}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-[#E4D0C5] flex items-center justify-center text-[#F4845F] hover:bg-[#F9F3EF] transition-colors"
            aria-label="Favoritar"
          >
            <Heart
              size={18}
              className={isFavorite ? 'fill-[#F4845F]' : ''}
            />
          </button>
        </div>

        {/* Stars antes do preço */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#F4845F] text-lg">
                ★
              </span>
            ))}
          </div>

          <span className="text-sm text-[#A67C6D]">
            ({produto.vendas} vendas)
          </span>
        </div>

        <p className="text-2xl font-bold text-[#F4845F]">
          A partir de R$ {produto.preco.toFixed(2)}
        </p>

        {/* Color Selector */}
        {produto.cores.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-[#3D261D] mb-3">
              Cor:{' '}
              <span className="font-normal text-[#7D5547]">
                {selectedCor}
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              {produto.cores.map((cor: string) => (
                <button
                  key={cor}
                  onClick={() => setSelectedCor(cor)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    selectedCor === cor
                      ? 'border-[#F4845F] scale-110 shadow-md'
                      : 'border-[#E4D0C5] hover:border-[#F4845F]'
                  }`}
                  style={{
                    backgroundColor: corMap[cor] || '#E4D0C5',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        {produto.tamanhos.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-[#3D261D] mb-3">
              Tamanho
            </label>

            <div className="flex flex-wrap gap-2">
              {produto.tamanhos.map((tam: string) => (
                <button
                  key={tam}
                  onClick={() => setSelectedTamanho(tam)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                    selectedTamanho === tam
                      ? 'bg-[#F4845F] text-white border-[#F4845F]'
                      : 'border-[#E4D0C5] text-[#5C3D31] hover:border-[#F4845F] hover:text-[#F4845F]'
                  }`}
                >
                  {tam}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Material Selector */}
        {produto.materiais.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-[#3D261D] mb-2">
              Material
            </label>

            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full px-4 py-3 border border-[#E4D0C5] rounded-xl text-[#3D261D] bg-white focus:outline-none focus:border-[#F4845F] focus:shadow-[0_0_0_3px_rgba(244,132,95,0.15)] text-sm"
            >
              {produto.materiais.map((mat: string) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Personalização maior */}
        <div>
          <textarea
            placeholder="Digite sua personalização (nome, frase, cor especial, medidas...)"
            value={personalizacao}
            onChange={(e) => setPersonalizacao(e.target.value)}
            rows={6}
            className="w-full px-4 py-4 border border-[#E4D0C5] rounded-xl text-[#3D261D] placeholder-[#C9A898] bg-white focus:outline-none focus:border-[#F4845F] focus:shadow-[0_0_0_3px_rgba(244,132,95,0.15)] text-sm resize-none"
          />
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full py-4 rounded-full font-bold text-white text-base transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          style={{
            background: added ? '#6DBF8A' : '#F4845F',
            boxShadow: 'var(--shadow-primary)',
          }}
        >
          {added ? (
            <>
              <Check size={20} />
              Adicionado ao carrinho!
            </>
          ) : (
            <>
              <ShoppingBag size={20} />
              Adicionar ao Carrinho
            </>
          )}
        </button>
      </div>

      {/* Description */}
      <div className="mt-14 border-t border-[#E4D0C5] pt-8">
        <h2 className="text-2xl font-bold text-[#3D261D] mb-6">
          Descrição
        </h2>

        <div className="space-y-3 max-w-4xl">
          {descriptions.map((desc, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check
                size={16}
                className="text-[#F4845F] flex-shrink-0 mt-0.5"
              />

              <span className="text-sm text-[#5C3D31] leading-relaxed">
                {desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}