'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, LayoutDashboard, Package, Tag, Star, LogOut, X, Check } from 'lucide-react';
import produtosBase from '@/data/produtos.json';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
  cores: string[];
  tamanhos: string[];
  materiais: string[];
  destaque: boolean;
  ativo: boolean;
  personalizado: boolean;
  prazoProducao: string;
  avaliacoes: number;
  vendas: number;
}

type Tab = 'produtos' | 'categorias' | 'destaques';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('produtos');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [editProduto, setEditProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }
    const saved = localStorage.getItem('admin_produtos');
    if (saved) {
      setProdutos(JSON.parse(saved));
    } else {
      setProdutos(produtosBase as Produto[]);
    }
  }, [router]);

  const saveProdutos = (updated: Produto[]) => {
    setProdutos(updated);
    localStorage.setItem('admin_produtos', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/');
  };

  const handleDelete = (id: string) => {
    if (confirm('Confirmar exclusao deste produto?')) {
      saveProdutos(produtos.filter((p) => p.id !== id));
    }
  };

  const handleToggleDestaque = (id: string) => {
    saveProdutos(produtos.map((p) => p.id === id ? { ...p, destaque: !p.destaque } : p));
  };

  const handleToggleAtivo = (id: string) => {
    saveProdutos(produtos.map((p) => p.id === id ? { ...p, ativo: !p.ativo } : p));
  };

  const handleEdit = (produto: Produto) => {
    setEditProduto({ ...produto });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editProduto) return;
    const exists = produtos.some((p) => p.id === editProduto.id);
    if (exists) {
      saveProdutos(produtos.map((p) => p.id === editProduto.id ? editProduto : p));
    } else {
      saveProdutos([...produtos, editProduto]);
    }
    setIsModalOpen(false);
    setEditProduto(null);
  };

  const destaques = produtos.filter((p) => p.destaque);
  const sidebar = [
    { key: 'produtos', icon: Package, label: 'Produtos' },
    { key: 'categorias', icon: Tag, label: 'Categorias' },
    { key: 'destaques', icon: Star, label: 'Destaques' },
  ] as const;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: '#3D261D' }}>
        <div className="px-6 py-8">
          <h1
            className="text-2xl font-bold text-[#FAC9A8] mb-1"
            style={{ fontFamily: 'var(--font-logo)' }}
          >
            Fios e Fitas
          </h1>
          <p className="text-[#A67C6D] text-xs">Painel Admin</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-[#C9A898] text-sm mb-2">
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </div>
          {sidebar.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeTab === key ? 'bg-[#F4845F] text-white' : 'text-[#C9A898] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#FAC9A8]'}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#C9A898] hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-all"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#FDFAF8] overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#F2E8E1] px-8 py-5 flex items-center justify-between">
          <h2
            className="text-2xl font-bold text-[#3D261D]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {activeTab === 'produtos' ? 'Produtos' : activeTab === 'categorias' ? 'Categorias' : 'Destaques'}
          </h2>
          {activeTab === 'produtos' && (
            <button
              onClick={() => {
                setEditProduto({
                  id: `produto-${Date.now()}`,
                  nome: '',
                  descricao: '',
                  preco: 0,
                  categoria: 'Laços',
                  imagem: '/images/produtos/laco-cetim-rosa.png',
                  cores: [],
                  tamanhos: [],
                  materiais: [],
                  destaque: false,
                  ativo: true,
                  personalizado: true,
                  prazoProducao: '7-10 dias uteis',
                  avaliacoes: 5,
                  vendas: 0,
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-colors hover:bg-[#D95F35]"
              style={{ background: '#F4845F' }}
            >
              <Plus size={16} /> Novo Produto
            </button>
          )}
        </div>

        <div className="p-8">
          {/* Produtos Tab */}
          {activeTab === 'produtos' && (
            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F2E8E1]">
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#A67C6D]">Produto</th>
                    <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-[#A67C6D]">Categoria</th>
                    <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-[#A67C6D]">Preco</th>
                    <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-wider text-[#A67C6D]">Ativo</th>
                    <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-wider text-[#A67C6D]">Destaque</th>
                    <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-wider text-[#A67C6D]">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto, i) => (
                    <tr key={produto.id} className={`border-b border-[#F9F3EF] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDFAF8]'} hover:bg-[#F9F3EF] transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={produto.imagem} alt="" className="w-12 h-12 object-cover rounded-lg flex-shrink-0" loading="lazy" />
                          <span className="text-sm font-medium text-[#3D261D] line-clamp-1">{produto.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#F9F3EF] text-[#7D5547] font-medium">{produto.categoria}</span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-[#F4845F]">
                        R$ {produto.preco.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleAtivo(produto.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors mx-auto ${produto.ativo ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                        >
                          <Check size={14} />
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleDestaque(produto.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors mx-auto ${produto.destaque ? 'bg-[#FFF3ED] text-[#F4845F]' : 'bg-gray-100 text-gray-400'}`}
                        >
                          <Star size={14} className={produto.destaque ? 'fill-[#F4845F]' : ''} />
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(produto)}
                            className="p-2 hover:bg-[#F9F3EF] text-[#7D5547] rounded-lg transition-colors"
                            aria-label="Editar"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(produto.id)}
                            className="p-2 hover:bg-red-50 text-[#C9A898] hover:text-red-500 rounded-lg transition-colors"
                            aria-label="Excluir"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Destaques Tab */}
          {activeTab === 'destaques' && (
            <div>
              <p className="text-[#A67C6D] mb-6 text-sm">
                {destaques.length}/8 produtos marcados como destaque. Esses aparecem na pagina inicial.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${produto.destaque ? 'border-[#F4845F]' : 'border-transparent'}`}
                    style={{ boxShadow: 'var(--shadow-card)' }}
                    onClick={() => {
                      if (!produto.destaque && destaques.length >= 8) {
                        alert('Maximo de 8 destaques atingido.');
                        return;
                      }
                      handleToggleDestaque(produto.id);
                    }}
                  >
                    <div className="aspect-square">
                      <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#3D261D] line-clamp-1 flex-1 mr-2">{produto.nome}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${produto.destaque ? 'bg-[#F4845F] text-white' : 'bg-[#F2E8E1] text-[#A67C6D]'}`}>
                        <Star size={12} className={produto.destaque ? 'fill-white' : ''} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorias Tab */}
          {activeTab === 'categorias' && (
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
              <p className="text-[#A67C6D] mb-4 text-sm">Categorias ativas na loja</p>
              <div className="space-y-3">
                {['Laços', 'Bolsas', 'Linha Bebê', 'Amiguru', 'Kits Presente'].map((cat) => {
                  const count = produtos.filter((p) => p.categoria === cat && p.ativo).length;
                  return (
                    <div key={cat} className="flex items-center justify-between p-4 bg-[#FDFAF8] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#F4845F]" />
                        <span className="font-medium text-[#3D261D]">{cat}</span>
                      </div>
                      <span className="text-sm text-[#A67C6D]">{count} produto{count !== 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {isModalOpen && editProduto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(61,38,29,0.55)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: '0 24px 60px rgba(61,38,29,0.20)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-xl font-bold text-[#3D261D]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Editar Produto
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-[#F9F3EF] rounded-full transition-colors text-[#A67C6D]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Nome', key: 'nome', type: 'text' },
                { label: 'Preco (R$)', key: 'preco', type: 'number' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-[#3D261D] mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={String((editProduto as Record<string, unknown>)[key])}
                    onChange={(e) => setEditProduto({ ...editProduto, [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E4D0C5] rounded-xl text-[#3D261D] focus:outline-none focus:border-[#F4845F] text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-[#3D261D] mb-1.5">Descricao</label>
                <textarea
                  value={editProduto.descricao}
                  onChange={(e) => setEditProduto({ ...editProduto, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[#E4D0C5] rounded-xl text-[#3D261D] focus:outline-none focus:border-[#F4845F] text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3D261D] mb-1.5">Categoria</label>
                <select
                  value={editProduto.categoria}
                  onChange={(e) => setEditProduto({ ...editProduto, categoria: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E4D0C5] rounded-xl text-[#3D261D] focus:outline-none focus:border-[#F4845F] text-sm bg-white"
                >
                  {['Laços', 'Bolsas', 'Linha Bebê', 'Amiguru', 'Kits Presente'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3D261D] mb-1.5">Cores (separadas por virgula)</label>
                <input
                  type="text"
                  value={editProduto.cores.join(', ')}
                  onChange={(e) => setEditProduto({ ...editProduto, cores: e.target.value.split(',').map((c) => c.trim()).filter(Boolean) })}
                  placeholder="Rosa, Branco, Laranja"
                  className="w-full px-4 py-2.5 border border-[#E4D0C5] rounded-xl text-[#3D261D] focus:outline-none focus:border-[#F4845F] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3D261D] mb-2">Tamanhos</label>
                <div className="flex flex-wrap gap-2">
                  {['RN', 'P', 'M', 'G', 'Único'].map((tam) => (
                    <button
                      key={tam}
                      type="button"
                      onClick={() => {
                        const tamanhos = editProduto.tamanhos.includes(tam)
                          ? editProduto.tamanhos.filter((t) => t !== tam)
                          : [...editProduto.tamanhos, tam];
                        setEditProduto({ ...editProduto, tamanhos });
                      }}
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${editProduto.tamanhos.includes(tam) ? 'bg-[#F4845F] text-white border-[#F4845F]' : 'border-[#E4D0C5] text-[#5C3D31]'}`}
                    >
                      {tam}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editProduto.destaque}
                    onChange={(e) => setEditProduto({ ...editProduto, destaque: e.target.checked })}
                    className="w-4 h-4 accent-[#F4845F]"
                  />
                  <span className="text-sm font-medium text-[#3D261D]">Destaque na Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editProduto.ativo}
                    onChange={(e) => setEditProduto({ ...editProduto, ativo: e.target.checked })}
                    className="w-4 h-4 accent-[#F4845F]"
                  />
                  <span className="text-sm font-medium text-[#3D261D]">Ativo</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-full border border-[#E4D0C5] text-[#5C3D31] font-semibold text-sm hover:bg-[#F9F3EF] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-full font-bold text-white text-sm transition-colors hover:bg-[#D95F35]"
                style={{ background: '#F4845F' }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
