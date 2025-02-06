import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartProduct } from '../../types';

interface CartState {
  cartId: string | null;
  items: CartProduct[];
  total: number;
  totalQuantity: number;
}

const initialState: CartState = {
  cartId: null,
  items: [],
  total: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartId: (state, action: PayloadAction<string>) => {
      state.cartId = action.payload;
    },
    addItem: (state, action: PayloadAction<CartProduct>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.total = existingItem.quantity * existingItem.price;
      } else {
        state.items.push(action.payload);
      }
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + item.total, 0);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + item.total, 0);
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        item.total = item.quantity * item.price;
        state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.total = state.items.reduce((sum, item) => sum + item.total, 0);
      }
    },
    clearCart: (state) => {
      state.cartId = null;
      state.items = [];
      state.total = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { setCartId, addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 