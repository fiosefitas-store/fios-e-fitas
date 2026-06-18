'use client';

import React, { createContext, useReducer, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  cor: string;
  tamanho: string;
  material: string;
  personalizacao: string;
  imagem: string;
  subtotal: number;
  cartItemId: string; // unique id for cart entry
}

export interface CartState {
  items: CartItem[];
  total: number;
  observacoes: string;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'cartItemId' | 'subtotal'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTIDADE'; payload: { cartItemId: string; quantidade: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_OBSERVACOES'; payload: string }
  | { type: 'LOAD_CART'; payload: Omit<CartState, 'isOpen'> };

const initialState: CartState = {
  items: [],
  total: 0,
  observacoes: '',
  isOpen: false,
};

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((acc, item) => acc + item.subtotal, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const cartItemId = `${action.payload.id}-${action.payload.cor}-${action.payload.tamanho}-${action.payload.material}-${action.payload.personalizacao}`;
      const existingItemIndex = state.items.findIndex(item => item.cartItemId === cartItemId);
      
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        const item = newItems[existingItemIndex];
        const newQuantidade = item.quantidade + action.payload.quantidade;
        newItems[existingItemIndex] = {
          ...item,
          quantidade: newQuantidade,
          subtotal: newQuantidade * item.preco,
        };
      } else {
        newItems = [...state.items, { 
          ...action.payload, 
          cartItemId, 
          subtotal: action.payload.quantidade * action.payload.preco 
        }];
      }
      return { ...state, items: newItems, total: calculateTotal(newItems), isOpen: true };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.cartItemId !== action.payload);
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    }
    case 'UPDATE_QUANTIDADE': {
      const newItems = state.items.map(item => {
        if (item.cartItemId === action.payload.cartItemId) {
          const quantidade = Math.max(1, action.payload.quantidade);
          return { ...item, quantidade, subtotal: quantidade * item.preco };
        }
        return item;
      });
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    }
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, observacoes: '' };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_OBSERVACOES':
      return { ...state, observacoes: action.payload };
    case 'LOAD_CART':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedCart = localStorage.getItem('fiosefitas_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem('fiosefitas_cart', JSON.stringify({
        items: state.items,
        total: state.total,
        observacoes: state.observacoes,
      }));
    } catch (error) {
      console.error('Failed to save cart', error);
    }
  }, [state.items, state.total, state.observacoes]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
