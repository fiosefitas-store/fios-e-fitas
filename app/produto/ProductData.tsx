'use client';

import { useState, useEffect } from 'react';
import { Check, ShoppingBag, Star } from 'lucide-react';

import { Cor, Tamanho } from '@/types/produtos';
import { useCart } from '@/hooks/useCart';
import { COR_MAP } from '@/lib/colors';

type Props = {
  produto: any;
  setMainImage?: (img: string) => void;
};

export default function ProductData({ produto, setMainImage }: Props) {
  const { dispatch } = useCart();

  const [selectedCor, setSelectedCor] = useState<string>('');
  const [selectedTamanho, setSelectedTamanho] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [personalizacao, setPersonalizacao] = useState('');
  const [added, setAdded] = useState(false);
  const [erroSelecao, setErroSelecao] = useState('');

  const corMap = COR_MAP;

  const tamanhoSelecionado = produto?.tamanhos?.find(
    (t: Tamanho) => t.nome === selectedTamanho
  );

  useEffect(() => {
    if (produto) {
      setSelectedCor('');
      setSelectedTamanho('');
      setSelectedMaterial(produto.materiais?.[0] || '');
    }
  }, [produto]);

  useEffect(() => {
    if (!produto || !setMainImage) return;

    // 1. Procura a cor selecionada dentro do array de cores do produto
    const corSelecionadaObjeto = produto.cores?.find(
      (c: any) => c.nome === selectedCor
    );

    // 2. Se a cor tiver uma imagem, usa ela. Senão, mantém a imagem principal do produto
    const img = corSelecionadaObjeto?.imagem || produto.imagem;

    setMainImage(img);
  }, [selectedCor, produto, setMainImage]);

  const handleAddToCart = () => {
    if (!selectedCor || !selectedTamanho) {
      setErroSelecao(
        'Selecione uma cor e um tamanho antes de adicionar ao carrinho.'
      );
      return;
    }

    // Encontra o objeto da cor para pegar a imagem certa na hora de mandar pro carrinho
    const corSelecionadaObjeto = produto.cores?.find(
      (c: any) => c.nome === selectedCor
    );

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
        // 🔥 Altere esta linha abaixo:
        imagem: corSelecionadaObjeto?.imagem || produto.imagem,
      },
    });

    setErroSelecao('');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
  <>
    <div className="space-y-8">

      {/* TOPO */}
      <div>
        <h1
          className="text-4xl font-bold text-[#3D261D] leading-tight mt-2"
        >
          {produto.nome}
        </h1>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex text-[#cf8d12] text-xl">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <span className="text-sm text-[#A67C6D]">
            {produto.vendas} Avaliações
          </span>
        </div>

      </div>

      {/* PREÇO */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold mb-2 text-[#363636]">
          R$ {produto.preco.toFixed(2)}
        </div>
      </div>

      {/* CORES + TAMANHO*/}
      <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start text-left">

      {/* CORES */}
      {produto.cores?.length > 0 && (
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#3D261D] block mb-3">
            Cor: <span className="font-normal">{selectedCor}</span>
          </label>

          <div className="flex gap-4 flex-wrap">
            {produto.cores.map((cor: Cor) => (
              <button
                key={cor.nome}
                onClick={() => {
                  setSelectedCor(cor.nome);
                  setErroSelecao('');
                }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-11 h-11 rounded-full border-2 transition-all ${
                    selectedCor === cor.nome
                      ? 'border-primary scale-110'
                      : 'border-[#E4D0C5]'
                  }`}
                  style={{
                    backgroundColor: corMap[cor.nome] || '#E4D0C5',
                  }}
                />
                <span className="text-[11px] text-[#7D5547]">
                  {cor.nome}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAMANHOS */}
      {produto.tamanhos?.length > 0 && (
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#3D261D] block mb-3">
            Tamanho
          </label>

          <div className="flex gap-3 flex-wrap">
            {produto.tamanhos.map((tam: Tamanho) => (
              <button
                key={tam.nome}
                onClick={() => {
                  setSelectedTamanho(tam.nome);
                  setErroSelecao('');
                }}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  selectedTamanho === tam.nome
                    ? 'bg-primary text-white border-primary'
                    : 'border-[#E4D0C5] text-[#5C3D31]'
                }`}
              >
                {tam.nome}
              </button>
            ))}
          </div>

          {selectedTamanho && tamanhoSelecionado && (
            <p className="text-xs text-[#7D5547] mt-2">
              Selecionado: {tamanhoSelecionado.nome} ({tamanhoSelecionado.cm} cm)
            </p>
          )}
        </div>
      )}

    </div>

      {/* PERSONALIZAÇÃO (Só aparece se o produto for personalizável) */}
      {(produto.personalizavel || produto.personalizado) && (
          <div>
            <textarea
              placeholder="Personalização (opcional)"
              value={personalizacao}
              onChange={(e) => setPersonalizacao(e.target.value)}
              className="w-full border border-[#E4D0C5] rounded-xl p-4 text-sm focus:border-primary outline-none"
            />
          </div>
      )}

      {/* ERRO */}
      {erroSelecao && (
        <p className="text-center text-sm text-red-500 font-medium">
          {erroSelecao}
        </p>
      )}

      {/* BOTÃO */}
      <button
        onClick={handleAddToCart}
        className="w-full py-5 rounded-full font-bold text-white flex items-center justify-center gap-2 transition-all"
        style={{
          background: added ? '#6DBF8A' : '#F4845F',
        }}
      >
        {added ? (
          <>
            <Check size={20} />
            Adicionado ao carrinho
          </>
        ) : (
          <>
            <ShoppingBag size={20} />
            Adicionar ao Carrinho
          </>
        )}
      </button>
      
      {/* DESCRIÇÃO */}
      <div className="mt-10">
        <div className=" border-t border-[#F2E6E2] pt-4"></div>
        <div className="space-y-4 text-sm text-[#5C3D31] leading-7">
          <p>{produto.descricao}</p>

          {produto.materiais?.length > 0 && (
            <p>
              <span className="font-semibold text-[#3D261D]">Materiais:</span>{' '}
              {produto.materiais.join(', ')}
            </p>
          )}

          {produto.cores?.length > 0 && (
            <p>
              <span className="font-semibold text-[#3D261D]">Cores:</span>{' '}
              {produto.cores.map((c: Cor) => c.nome).join(', ')}
            </p>
          )}

          {produto.tamanhos?.length > 0 && (
            <p>
              <span className="font-semibold text-[#3D261D]">Tamanhos:</span>{' '}
              {produto.tamanhos
                .map((t: Tamanho) => `${t.nome} (${t.cm} cm)`)
                .join(' • ')}
            </p>
          )}
        </div>

        {/* CAIXA DE DESTAQUE FINAL */}
        <div className="mt-6 rounded-2xl bg-bg border border-[#F2E6E2] p-5">
          <ul className="text-sm text-[#5C3D31] space-y-2">
            <li>✔ Produção artesanal</li>
            <li>✔ Feito sob encomenda</li>
            {/* Só exibe o item abaixo se o produto realmente for personalizável */}
            {(produto.personalizavel || produto.personalizado) && <li>✔ Personalizável</li>}
            <li>✔ Alta qualidade de acabamento</li>
          </ul>
        </div>
      </div>
    </div>
  </>
  );
}