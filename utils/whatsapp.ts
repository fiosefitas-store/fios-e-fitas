import { CartItem } from '@/context/CartContext';

export function gerarMensagemWhatsApp(items: CartItem[], total: number, observacoes: string): string {
  const linhas = items.map(item =>
    `• ${item.nome}\n  Cor: ${item.cor} | Tamanho: ${item.tamanho} | Material: ${item.material}\n  Qtd: ${item.quantidade} | Subtotal: R$ ${item.subtotal.toFixed(2)}\n  Personalização: ${item.personalizacao || 'Nenhuma'}`
  ).join('\n\n');
  const mensagem = `Olá! Gostaria de encomendar:\n\n${linhas}\n\n*Total: R$ ${total.toFixed(2)}*\n\nObservações: ${observacoes || 'Nenhuma'}`;
  return `https://wa.me/5583998660454?text=${encodeURIComponent(mensagem)}`;
}
