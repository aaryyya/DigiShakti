import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Handcrafted Embroidered Cushion Cover',
    description: 'Beautiful hand-embroidered cushion cover with traditional Rajasthani designs. Made with 100% cotton fabric and colorful thread work.',
    price: 650,
    imageURL: 'https://images.pexels.com/photos/12814967/pexels-photo-12814967.jpeg',
    category: 'Home Decor',
    seller: {
      id: 'seller1',
      name: 'Meera Handicrafts'
    },
    tags: ['handmade', 'embroidery', 'home decor', 'cushion cover']
  },
  {
    id: 'p2',
    name: 'Organic Honey - 500g',
    description: 'Pure, unprocessed organic honey sourced from the mountains of Uttarakhand. No additives or preservatives.',
    price: 450,
    imageURL: 'https://images.pexels.com/photos/9218732/pexels-photo-9218732.jpeg',
    category: 'Food Products',
    seller: {
      id: 'seller2',
      name: 'Mountain Harvest'
    },
    tags: ['organic', 'honey', 'food', 'natural']
  },
  {
    id: 'p3',
    name: 'Handwoven Bamboo Basket Set',
    description: 'Set of 3 handwoven bamboo baskets in different sizes. Perfect for storage and decoration. Made by skilled artisans in Northeast India.',
    price: 899,
    imageURL: 'https://images.pexels.com/photos/5874612/pexels-photo-5874612.jpeg',
    category: 'Home Decor',
    seller: {
      id: 'seller3',
      name: 'Bamboo Craft'
    },
    tags: ['handwoven', 'bamboo', 'basket', 'storage', 'eco-friendly']
  },
  {
    id: 'p4',
    name: 'Handmade Terracotta Jewelry Set',
    description: 'Elegant terracotta jewelry set including earrings, necklace, and bracelet. Hand-painted with natural colors.',
    price: 750,
    imageURL: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg',
    category: 'Jewelry',
    seller: {
      id: 'seller4',
      name: 'Clay Art Jewelry'
    },
    tags: ['handmade', 'terracotta', 'jewelry', 'earrings', 'necklace']
  },
  {
    id: 'p5',
    name: 'Homemade Pickles Assortment - 200g',
    description: 'Traditional homemade pickles in three flavors: mango, lemon, and mixed vegetable. Preservative-free and made with family recipes.',
    price: 350,
    imageURL: 'https://images.pexels.com/photos/6941026/pexels-photo-6941026.jpeg',
    category: 'Food Products',
    seller: {
      id: 'seller5',
      name: 'Grandma\'s Kitchen'
    },
    tags: ['homemade', 'pickles', 'traditional', 'food', 'preservative-free']
  },
  {
    id: 'p6',
    name: 'Block Printed Cotton Saree',
    description: 'Elegant cotton saree with traditional hand block prints. Natural dyes and 100% cotton fabric. Each piece is unique with slight variations in printing.',
    price: 1950,
    imageURL: 'https://images.pexels.com/photos/2834653/pexels-photo-2834653.jpeg',
    category: 'Clothing',
    seller: {
      id: 'seller6',
      name: 'Textile Traditions'
    },
    tags: ['block print', 'saree', 'cotton', 'traditional', 'handcrafted']
  },
  {
    id: 'p7',
    name: 'Natural Aloe Vera Soap (Set of 3)',
    description: 'Handmade soaps with pure aloe vera extract. Gentle on skin and free from harsh chemicals. Set includes 3 soaps of 100g each.',
    price: 299,
    imageURL: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
    category: 'Beauty & Personal Care',
    seller: {
      id: 'seller7',
      name: 'Natural Care'
    },
    tags: ['soap', 'natural', 'aloe vera', 'handmade', 'chemical-free']
  },
  {
    id: 'p8',
    name: 'Handcrafted Leather Journal',
    description: 'Beautifully crafted leather journal with handmade paper. Perfect for writing, sketching, or as a thoughtful gift.',
    price: 850,
    imageURL: 'https://images.pexels.com/photos/6690827/pexels-photo-6690827.jpeg',
    category: 'Stationery',
    seller: {
      id: 'seller8',
      name: 'Paper Craft'
    },
    tags: ['journal', 'leather', 'handmade', 'stationery']
  }
];

// Function to simulate fetching products from an API
export const getProductsData = () => {
  return {
    products: mockProducts,
    hasMore: false
  };
};

// Function to get a product by ID
export const getProductById = (productId: string) => {
  return mockProducts.find(product => product.id === productId);
};

// Function to get products by category
export const getProductsByCategory = (category: string) => {
  return mockProducts.filter(product => product.category === category);
};

// Function to get products by seller
export const getProductsBySeller = (sellerId: string) => {
  return mockProducts.filter(product => product.seller?.id === sellerId);
};

// Function to search products
export const searchProducts = (query: string) => {
  const searchTerm = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}; 