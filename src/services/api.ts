import axios from 'axios';
import { Product, Cart, User } from '../types';

const API_URL = 'https://dummyjson.com';

interface Category {
  slug: string;
  name: string;
  url: string;
}

export const api = {
  async getCategories(): Promise<Category[]> {
    const response = await axios.get(`${API_URL}/products/categories`);
    return response.data;
  },

  async getProductsByCategory(category: string): Promise<{ products: Product[] }> {
    const response = await axios.get(`${API_URL}/products/category/${category}`);
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  async getProductStock(id: string): Promise<number> {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data.stock || Math.floor(Math.random() * 100) + 1;
  },

  async createCart(cart: Partial<Cart>): Promise<Cart> {
    const response = await axios.post(`${API_URL}/carts/add`, cart);
    return response.data;
  },

  async getCart(cartId: string): Promise<Cart> {
    const response = await axios.get(`${API_URL}/carts/${cartId}`);
    return response.data;
  },

  async updateCart(cartId: string, cart: Partial<Cart>): Promise<Cart> {
    const response = await axios.put(`${API_URL}/carts/${cartId}`, cart);
    return response.data;
  },

  async deleteCart(cartId: string): Promise<void> {
    await axios.delete(`${API_URL}/carts/${cartId}`);
  },

  async getUser(userId: string): Promise<User> {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  }
}; 