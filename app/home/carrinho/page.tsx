'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { gerarMensagemWhatsApp } from '@/utils/whatsapp';

export default function CarrinhoPage() {
  const { state, dispatch } = useCart();
  const { items, total, observacoes } = state;

  const handleWhatsApp = () => {
    const url = gerarMensagemWhatsApp(items, total, observacoes);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen pt-26 bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-2 text-[#A67C6D] hover:text-primary transition-colors text-sm">
            <ArrowLeft size={16} /> Continuar comprando
          </Link>
        </div>

        <h1
          className="text-3xl font-bold text-[#3D261D] mb-8"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Meu Carrinho
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag size={64} className="text-[#C9A898] mx-auto mb-6" />
            <h2
              className="text-2xl font-bold text-[#3D261D] mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Seu carrinho está vazio
            </h2>
            <p className="text-[#A67C6D] mb-8">Explore nossa loja e encontre peças artesanais únicas!</p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-[#D95F35] transition-colors"
              style={{ boxShadow: 'var(--shadow-primary)' }}
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white rounded-2xl p-5 flex gap-4"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#3D261D] mb-1">{item.nome}</h3>
                    <p className="text-sm text-[#A67C6D]">
                      Cor: {item.cor} · Tamanho: {item.tamanho} · Material: {item.material}
                    </p>
                    {item.personalizacao && (
                      <p className="text-xs text-[#A67C6D] italic mt-1">
                        Personalização: "{item.personalizacao}"
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 border border-[#E4D0C5] rounded-full px-2 py-1">
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QUANTIDADE', payload: { cartItemId: item.cartItemId, quantidade: item.quantidade - 1 } })}
                          className="p-1 hover:text-primary transition-colors text-[#5C3D31]"
                          disabled={item.quantidade <= 1}
                          aria-label="Diminuir"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold text-[#3D261D] min-w-[20px] text-center">{item.quantidade}</span>
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QUANTIDADE', payload: { cartItemId: item.cartItemId, quantidade: item.quantidade + 1 } })}
                          className="p-1 hover:text-primary transition-colors text-[#5C3D31]"
                          aria-label="Aumentar"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">R$ {item.subtotal.toFixed(2)}</span>
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.cartItemId })}
                          className="p-2 hover:text-red-500 text-[#C9A898] transition-colors"
                          aria-label="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Observations */}
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
                <label className="block text-sm font-semibold text-[#3D261D] mb-3">
                  Observações do pedido (opcional)
                </label>
                <textarea
                  placeholder="Alguma observação especial para seu pedido?"
                  value={observacoes}
                  onChange={(e) => dispatch({ type: 'SET_OBSERVACOES', payload: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#E4D0C5] rounded-xl text-[#3D261D] placeholder-[#C9A898] bg-bg focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(244,132,95,0.15)] text-sm resize-none"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-white rounded-2xl p-6 sticky top-28"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <h2
                  className="text-xl font-bold text-[#3D261D] mb-6"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Resumo do Pedido
                </h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between text-sm">
                      <span className="text-[#5C3D31] line-clamp-1 flex-1 mr-4">
                        {item.nome} x{item.quantidade}
                      </span>
                      <span className="text-[#3D261D] font-medium shrink-0">
                        R$ {item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#F2E8E1] pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-lg font-bold text-[#3D261D]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Total
                    </span>
                    <span
                      className="text-2xl font-bold text-[#3D261D]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-4 rounded-full font-bold text-white text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: '#25D366', boxShadow: 'var(--shadow-whatsapp)' }}
                >
                  Finalizar pelo WhatsApp
                </button>
                <p className="text-xs text-[#A67C6D] text-center mt-4">
                  Ao finalizar, voce sera redirecionado para o WhatsApp para confirmar seu pedido.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
