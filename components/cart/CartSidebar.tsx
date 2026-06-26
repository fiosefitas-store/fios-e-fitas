'use client';

import { useEffect, useRef } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { gerarMensagemWhatsApp } from '@/utils/whatsapp';

export default function CartSidebar() {
  const { state, dispatch } = useCart();
  const { items, total, observacoes, isOpen } = state;
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (isOpen) {
      overlay.style.display = 'block';
      panel.style.display = 'flex';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.opacity = '1';
          panel.style.transform = 'translateX(0)';
        });
      });
    } else {
      overlay.style.opacity = '0';
      panel.style.transform = 'translateX(100%)';
      const timer = setTimeout(() => {
        overlay.style.display = 'none';
        panel.style.display = 'none';
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => dispatch({ type: 'TOGGLE_CART' });
  const handleRemove = (cartItemId: string) => dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  const handleUpdateQty = (cartItemId: string, quantidade: number) => {
    if (quantidade < 1) return;
    dispatch({ type: 'UPDATE_QUANTIDADE', payload: { cartItemId, quantidade } });
  };
  const handleWhatsApp = () => {
    const url = gerarMensagemWhatsApp(items, total, observacoes);
    window.open(url, '_blank');
  };
  

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        style={{
          display: 'none',
          opacity: 0,
          position: 'fixed',
          inset: 0,
          background: 'rgba(61,38,29,0.50)',
          backdropFilter: 'blur(2px)',
          zIndex: 50,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        style={{
          display: 'none',
          flexDirection: 'column',
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          width: '100%',
          maxWidth: '420px',
          background: 'white',
          boxShadow: '-8px 0 32px rgba(61,38,29,0.15)',
          zIndex: 51,
          transform: 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          borderLeft: '1px solid rgba(244,132,95,0.12)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white',
            background: 'linear-gradient(135deg, #F4845F 0%, #F2A7BB 100%)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShoppingBag size={22} />
            <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
              Meu Carrinho
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fechar carrinho"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, textAlign: 'center', padding: '64px 0' }}>
              <ShoppingBag size={48} color="#C9A898" />
              <p style={{ color: '#A67C6D', fontWeight: 500, margin: 0 }}>Seu carrinho está vazio</p>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', color: '#F4845F', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.875rem' }}>
                Continuar comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} style={{ display: 'flex', gap: 12, background: '#FDFAF8', borderRadius: 12, padding: 12 }}>
                <img
                  src={item.imagem}
                  alt={item.nome}
                  loading="lazy"
                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.875rem', fontWeight: 600, color: '#3D261D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome}</h4>
                  <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#A67C6D' }}>{item.cor} · {item.tamanho} · {item.material}</p>
                  {item.personalizacao && (
                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#A67C6D', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      "{item.personalizacao}"
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E4D0C5', borderRadius: 9999, overflow: 'hidden' }}>
                      <button onClick={() => handleUpdateQty(item.cartItemId, item.quantidade - 1)} aria-label="Diminuir" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: '#5C3D31', display: 'flex', alignItems: 'center' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3D261D', minWidth: 20, textAlign: 'center' }}>{item.quantidade}</span>
                      <button onClick={() => handleUpdateQty(item.cartItemId, item.quantidade + 1)} aria-label="Aumentar" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: '#5C3D31', display: 'flex', alignItems: 'center' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F4845F' }}>R$ {item.subtotal.toFixed(2)}</span>
                      <button onClick={() => handleRemove(item.cartItemId)} aria-label="Remover" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9A898', display: 'flex', alignItems: 'center', padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(244,132,95,0.12)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
            <textarea
              placeholder="Observações especiais (opcional)"
              value={observacoes}
              onChange={(e) => dispatch({ type: 'SET_OBSERVACOES', payload: e.target.value })}
              rows={2}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E4D0C5',
                borderRadius: 12,
                resize: 'none',
                fontSize: '0.875rem',
                color: '#3D261D',
                background: 'white',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#5C3D31', fontWeight: 500 }}>Total</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3D261D', fontFamily: 'var(--font-display)' }}>
                R$ {total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleWhatsApp}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 9999,
                fontWeight: 700,
                color: 'white',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                background: '#25D366',
                boxShadow: 'var(--shadow-whatsapp)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Enviar Pedido pelo WhatsApp
            </button>
            <button
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: '#A67C6D' }}
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
