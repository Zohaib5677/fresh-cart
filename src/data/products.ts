import { Product } from '@/stores/cartStore';

export const categories = [
  { id: 'dairy', name: 'Dairy & Milk', icon: '🥛' },
  { id: 'kitchen', name: 'Kitchen & Dining', icon: '🍳' },
  { id: 'general', name: 'General Household', icon: '🏠' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'grocery', name: 'Household Grocery', icon: '🛒' },
  { id: 'meat', name: 'Meat & Chicken', icon: '🥩' },
  { id: 'fruits', name: 'Fruits & Juices', icon: '🍎' },
  { id: 'clothing', name: 'Clothing & Apparel', icon: '👕' },
  { id: 'health', name: 'Health & Beauty', icon: '🧴' },
  { id: 'vegetables', name: 'Fresh Vegetables', icon: '🥬' },
];

export const products: Product[] = [];

export const getProductsByCategory = (categoryId: string) => [];
export const getTopSellingProducts = () => [];
export const getExclusiveProducts = () => [];
export const getPromotionalProducts = () => [];
export const getProductById = (id: string) => undefined;
