export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  rating: number;
  discountPercentage: number;
  stock: number;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice: number;
  thumbnail: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  email: string;
  phone: string;
  address: {
    address: string;
    city: string;
    postalCode: string;
  };
  bank: {
    cardNumber: string;
    cardExpire: string;
    iban: string;
  };
} 