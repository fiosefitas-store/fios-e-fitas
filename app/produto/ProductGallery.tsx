'use client';

import { useMemo } from 'react';

type Props = {
  produto: any;
  mainImage: string;
  setMainImage: (img: string) => void;
};

export default function ProductGallery({
  produto,
  mainImage,
  setMainImage,
}: Props) {
  
  // Cria dinamicamente a lista de miniaturas juntando a foto principal com as fotos das cores
  const todasImagens = useMemo(() => {
    const lista: string[] = [];
    
    // 1. Adiciona a imagem principal do produto se ela existir
    if (produto?.imagem) {
      lista.push(produto.imagem);
    }
    
    // 2. Vasculha o array de cores e adiciona as imagens das variações
    if (produto?.cores && Array.isArray(produto.cores)) {
      produto.cores.forEach((cor: any) => {
        if (cor.imagem && !lista.includes(cor.imagem)) {
          lista.push(cor.imagem);
        }
      });
    }
    
    return lista;
  }, [produto]);

  // Se o produto não tiver nenhuma imagem, não renderiza nada
  if (!produto) return null;

  return (
    <div className="md:sticky top-24 h-fit space-y-4">
      {/* Imagem Principal */}
      <div className="aspect-square overflow-hidden bg-[#FDFBF9] rounded-2xl border border-[#F2E6E2]">
        <img
          src={mainImage || produto.imagem}
          alt={produto.nome}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Miniaturas (Só aparecem se houver mais de 1 imagem no total) */}
      {todasImagens.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {todasImagens.map((img: string, i: number) => {
            // Verifica se a miniatura atual é a que está ativa na tela
            const ativa = (mainImage || produto.imagem) === img;

            return (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                  ativa
                    ? 'border-primary' // Borda da cor do seu botão Comprar
                    : 'border-[#E4D0C5]'
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}