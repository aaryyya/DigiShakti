import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  DocumentSnapshot,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { Product } from "../types";

const PRODUCTS_COLLECTION = "products";

// Get products with pagination
export const getProducts = async (
  lastVisible: DocumentSnapshot | null = null,
  itemsPerPage: number = 10,
  category?: string
) => {
  try {
    let productsQuery: any;
    
    if (category) {
      productsQuery = query(
        collection(db, PRODUCTS_COLLECTION),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    } else {
      productsQuery = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy("createdAt", "desc")
      );
    }
    
    // Apply pagination if there's a last document
    if (lastVisible) {
      productsQuery = query(
        productsQuery,
        startAfter(lastVisible),
        limit(itemsPerPage)
      );
    } else {
      productsQuery = query(productsQuery, limit(itemsPerPage));
    }
    
    const querySnapshot = await getDocs(productsQuery);
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    // Map the documents to product objects
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, 'id'>)
    })) as Product[];
    
    return { products, lastVisible: lastVisibleDoc };
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limitCount: number = 4) => {
  try {
    // In a real app, you'd have a 'featured' field or a separate collection
    // For demo purposes, we'll just get the latest products
    const productsQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(productsQuery);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, 'id'>)
    })) as Product[];
    
    return products;
  } catch (error) {
    console.error("Error getting featured products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId: string) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...(docSnap.data() as Omit<Product, 'id'>)
      } as Product;
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

// Search products
export const searchProducts = async (
  searchTerm: string,
  limitCount: number = 10
) => {
  try {
    // Firebase doesn't support text search directly, so we're using a workaround
    searchTerm = searchTerm.toLowerCase();
    
    // Get all products (in a real app, you'd use pagination)
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    // Filter products that contain the search term in name, description, or tags
    let filtered = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>)
      }))
      .filter(product => {
        const name = product.name.toLowerCase();
        const description = product.description.toLowerCase();
        const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
        
        return (
          name.includes(searchTerm) || 
          description.includes(searchTerm) ||
          tags.some(tag => tag.includes(searchTerm))
        );
      }) as Product[];
    
    // Limit the result
    filtered = filtered.slice(0, limitCount);
    
    return filtered;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Add product
export const addProduct = async (
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  imageFile: File
) => {
  try {
    // Upload image to Firebase Storage
    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    const imageURL = await getDownloadURL(uploadResult.ref);
    
    // Add product to Firestore
    const productData = {
      ...product,
      imageURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
    
    return {
      id: docRef.id,
      ...productData
    };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update product
export const updateProduct = async (
  productId: string,
  productData: Partial<Product>,
  newImageFile?: File
) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    
    // Get the current product data
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }
    
    const currentData = productSnap.data() as Product;
    
    // Handle image update if there's a new image
    let imageURL = currentData.imageURL;
    
    if (newImageFile) {
      // Delete the old image if it exists
      if (currentData.imageURL) {
        try {
          // Extract the path from the URL
          const oldImagePath = currentData.imageURL.split('products%2F')[1].split('?')[0];
          const oldImageRef = ref(storage, `products/${oldImagePath}`);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error("Error deleting old image (continuing anyway):", error);
        }
      }
      
      // Upload the new image
      const storageRef = ref(storage, `products/${Date.now()}_${newImageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, newImageFile);
      imageURL = await getDownloadURL(uploadResult.ref);
    }
    
    // Update product in Firestore
    const updatedData = {
      ...productData,
      imageURL,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(productRef, updatedData);
    
    // Get updated data
    const updatedSnapshot = await getDoc(productRef);
    const updatedProduct = {
      id: productId,
      ...(updatedSnapshot.data() as Omit<Product, 'id'>)
    } as Product;
    
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId: string) => {
  try {
    // Get the product data to retrieve the image URL
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }
    
    const productData = productSnap.data() as Product;
    
    // Delete the image from Storage
    if (productData.imageURL) {
      try {
        // Extract the path from the URL
        const imagePath = productData.imageURL.split('products%2F')[1].split('?')[0];
        const imageRef = ref(storage, `products/${imagePath}`);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image (continuing anyway):", error);
      }
    }
    
    // Delete the product from Firestore
    await deleteDoc(productRef);
    
    return { id: productId, success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Get products by seller
export const getSellerProducts = async (sellerUid: string) => {
  try {
    const sellerQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      where("sellerUid", "==", sellerUid),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(sellerQuery);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    return products;
  } catch (error) {
    console.error("Error getting seller products:", error);
    throw error;
  }
};

// For development purposes: Seed products
export const seedProducts = async () => {
  try {
    const products = [
      {
        name: "Handcrafted Jute Bag",
        description: "Beautifully crafted jute bag, perfect for shopping and everyday use. Eco-friendly and durable.",
        price: 599,
        category: "Handicrafts",
        imageURL: "https://via.placeholder.com/300x300?text=Jute+Bag",
        seller: {
          id: "seller1",
          name: "Crafts by Meera"
        },
        tags: ["eco-friendly", "handicraft", "bag", "jute"]
      },
      {
        name: "Organic Forest Honey",
        description: "Pure and natural honey collected from forest areas. 100% organic and free from additives.",
        price: 450,
        category: "Food",
        imageURL: "https://via.placeholder.com/300x300?text=Organic+Honey",
        seller: {
          id: "seller2",
          name: "Nature's Bounty"
        },
        tags: ["organic", "honey", "natural", "food"]
      },
      {
        name: "Embroidered Cushion Covers",
        description: "Beautiful cushion cover with traditional hand embroidery. Adds a cultural touch to your home decor.",
        price: 349,
        category: "HomeDecor",
        imageURL: "https://via.placeholder.com/300x300?text=Embroidered+Cushion",
        seller: {
          id: "seller3",
          name: "Textile Traditions"
        },
        tags: ["cushion", "embroidery", "home decor", "handmade"]
      },
      {
        name: "Ajrakh Block Print Stole",
        description: "Elegant cotton stole with traditional Ajrakh block printing. Handcrafted by skilled artisans.",
        price: 799,
        category: "Clothing",
        imageURL: "https://via.placeholder.com/300x300?text=Ajrakh+Stole",
        seller: {
          id: "seller4",
          name: "Artisan Textiles"
        },
        tags: ["stole", "ajrakh", "block print", "cotton"]
      },
      {
        name: "Terracotta Cooking Set",
        description: "Traditional terracotta cooking pots set, perfect for slow cooking. Enhances flavor and retains nutrients.",
        price: 1299,
        category: "HomeDecor",
        imageURL: "https://via.placeholder.com/300x300?text=Terracotta+Set",
        seller: {
          id: "seller5",
          name: "Earth Creations"
        },
        tags: ["terracotta", "cooking", "kitchen", "traditional"]
      },
      {
        name: "Handwoven Khadi Saree",
        description: "Handwoven Khadi cotton saree with natural dyes. Comfortable, elegant and sustainable clothing option.",
        price: 2499,
        category: "Clothing",
        imageURL: "https://via.placeholder.com/300x300?text=Khadi+Saree",
        seller: {
          id: "seller6",
          name: "Village Weavers"
        },
        tags: ["saree", "khadi", "handwoven", "natural dye"]
      }
    ];
    
    for (const product of products) {
      await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log(`Successfully seeded ${products.length} products`);
    return { success: true, count: products.length };
  } catch (error) {
    console.error("Error seeding products:", error);
    throw error;
  }
};