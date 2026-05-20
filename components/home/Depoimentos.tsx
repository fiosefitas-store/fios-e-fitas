'use client';

import { Star } from 'lucide-react';

const depoimentos = [
  {
    nome: 'Mariana Silva',
    texto: 'Os laços são simplesmente perfeitos! O acabamento é impecável e o cheirinho que vem na caixa é maravilhoso. Minha filha amou!',
  },
  {
    nome: 'Juliana Costa',
    texto: 'Encomendei o kit maternidade e fiquei emocionada quando recebi. Tudo feito com tanto carinho. Super recomendo a Fios e Fitas!',
  },
  {
    nome: 'Camila Oliveira',
    texto: 'A bolsa de palha com crochê é linda demais, já virou minha queridinha. Atendimento excelente e entrega antes do prazo.',
  }
];

export default function Depoimentos() {
  return (
    <section className="bg-[#3D261D] py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl text-[#FAC9A8] mb-4">O Que Dizem Nossas Clientes</h2>
          <p className="text-[#A67C6D] text-lg">Histórias reais de quem já se encantou com nossas peças.</p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
          {depoimentos.map((dep, idx) => (
            <div key={idx} className="flex-none w-75 md:w-[calc(33.333%-16px)] bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 snap-start flex flex-col">
              <div className="flex gap-1 text-primary mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="font-display italic text-[#F7C5D0] text-lg mb-8 flex-1 leading-relaxed">
                "{dep.texto}"
              </p>
              <div>
                <p className="font-medium text-[#FAC9A8]">{dep.nome}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                  <span className="text-[#A67C6D] text-xs uppercase tracking-wider">Compra Verificada</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
