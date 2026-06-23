// components/produto/ProductData.tsx

'use client';

import { useState, useEffect } from 'react';
import { Check, ShoppingBag } from 'lucide-react';

import { Cor, Tamanho } from '@/types/produtos';
import { useCart } from '@/hooks/useCart';
import { CATEGORIES } from '@/data/categories';
import { COR_MAP } from '@/lib/colors';


type Props = { produto: any; setMainImage?: (img: string) => void; };

export default function ProductData({ produto, setMainImage }: Props) {
   function getCorImagem(index: number) {
    for (let i = index; i >= 0; i--) {
      if (produto.cores[i]?.imagem) {
        return produto.cores[i].imagem;
      }
    }
    return produto.imagem;
  }
  
  const { dispatch } = useCart();

  const [selectedCor, setSelectedCor] = useState<string>("");
  const [selectedTamanho, setSelectedTamanho] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [personalizacao, setPersonalizacao] = useState('');
  const [added, setAdded] = useState(false);
  const tamanhoSelecionado = produto.tamanhos.find(
    (t: Tamanho) => t.nome === selectedTamanho
  );

  useEffect(() => {
    if (produto) {
      setSelectedCor(produto.cores[0]?.nome || '');
      setSelectedTamanho(produto.tamanhos[0] || '');
      setSelectedMaterial(produto.materiais[0] || '');

    }
  }, [produto]);

  // When selected color changes, update main image if a per-color image exists
  useEffect(() => {
    if (!produto || !setMainImage) return;
    const corImagens = produto.corImagens || {};
    const img = corImagens[selectedCor] || produto.imagem;
    setMainImage(img);
  }, [selectedCor, produto, setMainImage]);

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
        imagem: (produto.corImagens && produto.corImagens[selectedCor]) || produto.imagem,
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const corMap = COR_MAP;

  const tamanhosCm = produto.tamanhosCm || {};
  const tamanhosStr = produto.tamanhos && produto.tamanhos.length > 0
    ? produto.tamanhos.map((t: string) => (
        tamanhosCm[t] ? `${t} (${tamanhosCm[t]} cm)` : t
      )).join(', ')
    : '';

  const descriptions = [
    'Produzido artesanalmente com materiais selecionados',
    `Disponível nas cores: ${produto.cores
      .map((cor: Cor) => cor.nome)
      .join(', ')}`,
    tamanhosStr ? `Tamanhos: ${tamanhosStr}` : `Tamanhos: ${produto.tamanhos.join(', ')}`,
    '100% personalizável conforme sua preferência',
  ];

  const lowerCat = (produto?.categoria || '').toLowerCase();
  const matched = CATEGORIES.find((c) =>
    lowerCat.includes(c.label.toLowerCase())
  );

  const descricaoCompleta = `
    ${produto.descricao}

    ${produto.materiais?.length ? `Materiais: ${produto.materiais.join(', ')}` : ''}

    ${produto.cores?.length ? `Cores: ${produto.cores.map((c: Cor) => c.nome).join(', ')}` : ''}

    ${produto.tamanhos?.length ? `Tamanhos: ${produto.tamanhos.map((t: any) => t.nome).join(', ')}` : ''}
    `;

  return (
    <>
      <div className="space-y-8">
        {/* TOPO */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A67C6D] mb-3 block">
              {produto.categoria}
            </span>

            <h1
              className="text-3xl font-bold text-[#3D261D] leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {produto.nome}
            </h1>
          </div>
        </div>

        {/* PREÇO + ESTRELAS */}
        <div className="flex items-center justify-between flex-wrap gap-5">
          {/* Preço */}
          <div className="inline-block text-primary py-3 rounded-md font-semibold text-xl">
            A partir de R$ {produto.preco.toFixed(2)}
          </div>

          {/* Avaliação */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-primary text-xl">
                  ★
                </span>
              ))}
            </div>

            <span className="text-sm text-[#A67C6D]">
              ({produto.vendas} vendas)
            </span>
          </div>
        </div>

        {/* COR + TAMANHO */}
        <div className="flex flex-col lg:flex-row gap-14">
          {/* CORES */}
          {produto.cores.length > 0 && (
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#3D261D] mb-4">
                Cor:{' '}
                <span className="font-normal text-[#7D5547]">
                  {selectedCor}
                </span>
              </label>

              <div className="flex flex-wrap gap-3">
                {produto.cores.map((cor : Cor) => (
                  <button
                    key={cor.nome}
                    onClick={() => setSelectedCor(cor.nome)}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedCor === cor.nome
                        ? 'border-primary scale-110 shadow-md ring-2 ring-primary/20'
                        : 'border-[#E4D0C5] hover:border-primary'
                    }`}
                    style={{
                      backgroundColor:
                        corMap[cor.nome] || '#E4D0C5',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAMANHOS */}
          {produto.tamanhos.length > 0 && (
          <div className="w-full lg:w-auto">
            <label className="block text-sm font-semibold text-[#3D261D] mb-4">
              Tamanho
            </label>

            <div className="flex items-center gap-3">
              {produto.tamanhos.map((tam: { nome: string; cm: string }) => (
                <button
                  key={tam.nome}
                  onClick={() => setSelectedTamanho(tam.nome)}
                  className={`w-11 h-9 flex items-center justify-center rounded-full border font-semibold transition-all ${
                    selectedTamanho === tam.nome
                      ? 'bg-primary text-white border-primary'
                      : 'border-[#E4D0C5] text-[#5C3D31] hover:border-primary hover:text-primary'
                  }`}
                >
                  {tam.nome}
                </button>
              ))}
            </div>

            {/* 👇 AQUI O DISPLAY STYLE ALIEXPRESS */}
            {selectedTamanho && (
              <div className="mt-3 text-sm text-[#7D5547]">
                Selecionado:{" "}
                {tamanhoSelecionado && (
                  <>
                    {" "}
                    <span className="font-semibold">
                      {tamanhoSelecionado.nome}
                    </span>
                    {" ("}
                    <span>{tamanhoSelecionado.cm}</span>
                    {" cm)"}
                  </>
                )}
              </div>
            )}
          </div>
          )}
        </div>


        {/* PERSONALIZAÇÃO */}
        <div>
          <textarea
            placeholder="Digite sua personalização (nome, frase, cor especial, medidas...)"
            value={personalizacao}
            onChange={(e) => {
              setPersonalizacao(e.target.value);

              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            rows={1}
            className="w-full min-h-14 px-5 py-4 border border-[#F2E6E2] rounded-2xl text-[#3D261D] placeholder-[#C9A898] bg-white focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(244,132,95,0.08)] text-sm resize-none overflow-hidden"
          />
        </div>

        {/* BOTÃO */}
        <button
          onClick={handleAddToCart}
          className="w-full py-5 rounded-full font-bold text-white text-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
          style={{
            background: added ? '#6DBF8A' : '#F4845F',
            boxShadow:
              '0 10px 30px rgba(244,132,95,0.18)',
          }}
        >
          {added ? (
            <>
              <Check size={22} />
              Adicionado ao carrinho!
            </>
          ) : (
            <>
              <ShoppingBag size={22} />
              Adicionar ao Carrinho
            </>
          )}
        </button>
      </div>

      {/* DESCRIÇÃO */}
      <div className=" border-[#E4D0C5] ">
        <h2 className="text-2xl font-bold text-[#3D261D] mb-7">
          Descrição
        </h2>

        <div className="space-y-4 max-w-4xl flex items-start gap-3 pb-10">
          <p className="text-sm text-[#5C3D31] whitespace-pre-line"> {descricaoCompleta} </p>
        </div>
      </div>
    </>
  );
}