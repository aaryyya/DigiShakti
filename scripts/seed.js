const { initializeApp } = require("firebase/app");
const { 
  getFirestore, 
  collection, 
  addDoc, 
  Timestamp 
} = require("firebase/firestore");

// Firebase configuration - should match your config.ts
const firebaseConfig = {
  apiKey: "AIzaSyC1Z9WxDtPeUDtYCvH5eQAm-eu2h-XQn9M",
  authDomain: "digisakhi-demo.firebaseapp.com",
  projectId: "digisakhi-demo",
  storageBucket: "digisakhi-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  // Sample products
  const products = [
    {
      name: "Handcrafted Wall Hanging",
      description: "Beautiful handcrafted wall hanging made with sustainable materials and traditional techniques.",
      price: 1200,
      imageURL: "https://via.placeholder.com/400x300?text=Wall+Hanging",
      category: "Handcraft",
      seller: {
        id: "user_1",
        name: "Crafts by Meera"
      },
      tags: ["handcraft", "decor", "sustainable"],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      name: "Organic Honey Set",
      description: "Pure organic honey sourced from the foothills of the Himalayas. Set of 3 different varieties.",
      price: 850,
      imageURL: "https://via.placeholder.com/400x300?text=Organic+Honey",
      category: "Food",
      seller: {
        id: "user_2",
        name: "Nature's Bounty"
      },
      tags: ["organic", "food", "honey"],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      name: "Block Print Saree",
      description: "Hand block printed cotton saree with traditional motifs. Natural dyes used.",
      price: 2800,
      imageURL: "https://via.placeholder.com/400x300?text=Block+Print+Saree",
      category: "Textiles",
      seller: {
        id: "user_3",
        name: "Village Weavers"
      },
      tags: ["textile", "handmade", "traditional"],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  ];

  // Sample courses
  const courses = [
    {
      title: "Digital Marketing for Artisans",
      description: "Learn how to market your business online and reach more customers with digital strategies.",
      price: 499,
      imageURL: "https://via.placeholder.com/400x300?text=Digital+Marketing",
      category: "Digital Marketing",
      instructor: {
        id: "instructor_1",
        name: "Priya Sharma",
        photoURL: "https://via.placeholder.com/150?text=Priya"
      },
      level: "beginner",
      duration: 180,
      modules: [
        {
          title: "Introduction to Digital Marketing",
          lessons: [
            {
              title: "Why Digital Marketing Matters",
              duration: 15
            },
            {
              title: "Setting Your Digital Marketing Goals",
              duration: 20
            }
          ]
        }
      ],
      rating: 4.8,
      enrolledCount: 245,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      title: "Financial Management for Small Businesses",
      description: "Master the essentials of financial management to make informed decisions for your business.",
      price: 599,
      imageURL: "https://via.placeholder.com/400x300?text=Financial+Management",
      category: "Financial Management",
      instructor: {
        id: "instructor_2",
        name: "Rahul Kapoor",
        photoURL: "https://via.placeholder.com/150?text=Rahul"
      },
      level: "intermediate",
      duration: 240,
      modules: [
        {
          title: "Basics of Business Finance",
          lessons: [
            {
              title: "Understanding Financial Statements",
              duration: 25
            },
            {
              title: "Cash Flow Management",
              duration: 30
            }
          ]
        }
      ],
      rating: 4.6,
      enrolledCount: 189,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  ];

  // Sample community posts
  const posts = [
    {
      title: "Looking for advice on selling handmade jewelry",
      content: "I've been making handcrafted jewelry for years as a hobby, but now I want to turn it into a small business. I'm unsure about pricing my items and finding the right platforms to sell. Has anyone here had success selling handmade jewelry? Would love some guidance!",
      authorId: "user_1",
      authorName: "Meera Patel",
      authorPhotoURL: "https://via.placeholder.com/150?text=Meera",
      category: "Business",
      tags: ["jewelry", "handmade", "pricing", "selling"],
      likes: 7,
      comments: [
        {
          id: "comment_1",
          authorId: "user_2",
          authorName: "Anjali Sharma",
          content: "I started selling jewelry two years ago. For pricing, calculate material cost + labor (your time) + 30% profit margin.",
          likes: 3,
          createdAt: Timestamp.now()
        }
      ],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      title: "Traditional textile techniques workshop in Delhi",
      content: "Hi everyone! I'm organizing a two-day workshop on traditional Indian textile techniques in Delhi next month. We'll cover block printing, basic handloom weaving, and natural dyeing methods. It's perfect for beginners and those looking to incorporate traditional methods into their craft.",
      authorId: "user_3",
      authorName: "Anjali Sharma",
      authorPhotoURL: "https://via.placeholder.com/150?text=Anjali",
      category: "Events",
      tags: ["workshop", "textiles", "crafts", "delhi", "traditional"],
      likes: 12,
      comments: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  ];

  // Add products to Firestore
  console.log("Adding products...");
  for (const product of products) {
    try {
      await addDoc(collection(db, "products"), product);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }

  // Add courses to Firestore
  console.log("Adding courses...");
  for (const course of courses) {
    try {
      await addDoc(collection(db, "courses"), course);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  }

  // Add posts to Firestore
  console.log("Adding community posts...");
  for (const post of posts) {
    try {
      await addDoc(collection(db, "communityPosts"), post);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  }

  console.log("Database seeded successfully!");
}

// Run the seed function
seedDatabase()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Seeding failed:", error);
    process.exit(1);
  }); 