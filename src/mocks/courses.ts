import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Digital Marketing for Small Businesses',
    description: 'Learn how to effectively market your small business online. This course covers social media marketing, content creation, SEO basics, and digital advertising on a budget.',
    price: 1499,
    imageURL: 'https://images.pexels.com/photos/935979/pexels-photo-935979.jpeg',
    category: 'Marketing',
    instructor: {
      id: 'instructor1',
      name: 'Priya Sharma',
      photoURL: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg'
    },
    level: 'beginner',
    duration: 480, // 8 hours in minutes
    modules: [
      {
        title: 'Introduction to Digital Marketing',
        lessons: [
          { title: 'Why Digital Marketing Matters for Small Businesses', duration: 15 },
          { title: 'Setting Your Digital Marketing Goals', duration: 20 },
          { title: 'Understanding Your Target Audience', duration: 25 }
        ]
      },
      {
        title: 'Social Media Marketing',
        lessons: [
          { title: 'Choosing the Right Platforms', duration: 30 },
          { title: 'Creating Engaging Content', duration: 45 },
          { title: 'Building a Social Media Calendar', duration: 30 }
        ]
      }
    ],
    rating: 4.8,
    enrolledCount: 325,
    tags: ['digital marketing', 'social media', 'small business', 'SEO', 'online advertising']
  },
  {
    id: 'c2',
    title: 'Financial Management for Entrepreneurs',
    description: 'Master the essentials of financial management for your business. Learn budgeting, cash flow management, pricing strategies, and basic accounting principles.',
    price: 1999,
    imageURL: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg',
    category: 'Finance',
    instructor: {
      id: 'instructor2',
      name: 'Rajesh Gupta',
      photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    level: 'intermediate',
    duration: 600, // 10 hours in minutes
    modules: [
      {
        title: 'Business Finance Fundamentals',
        lessons: [
          { title: 'Understanding Business Financial Statements', duration: 40 },
          { title: 'Profit & Loss Management', duration: 35 },
          { title: 'Balance Sheets Simplified', duration: 30 }
        ]
      },
      {
        title: 'Cash Flow & Budgeting',
        lessons: [
          { title: 'Cash Flow Management Techniques', duration: 45 },
          { title: 'Creating Effective Business Budgets', duration: 40 },
          { title: 'Financial Planning for Growth', duration: 50 }
        ]
      }
    ],
    rating: 4.6,
    enrolledCount: 212,
    tags: ['finance', 'accounting', 'budgeting', 'cash flow', 'financial planning']
  },
  {
    id: 'c3',
    title: 'Product Photography Basics',
    description: 'Learn how to take professional-quality photos of your products using just a smartphone and affordable equipment. Ideal for online sellers looking to improve their product listings.',
    price: 899,
    imageURL: 'https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg',
    category: 'Photography',
    instructor: {
      id: 'instructor3',
      name: 'Anita Desai',
      photoURL: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    level: 'beginner',
    duration: 300, // 5 hours in minutes
    modules: [
      {
        title: 'Equipment & Setup',
        lessons: [
          { title: 'Affordable Photography Equipment', duration: 25 },
          { title: 'Creating a DIY Light Box', duration: 30 },
          { title: 'Setting Up Your Shooting Space', duration: 20 }
        ]
      },
      {
        title: 'Photography Techniques',
        lessons: [
          { title: 'Lighting Basics for Product Photography', duration: 35 },
          { title: 'Composition & Angles', duration: 30 },
          { title: 'Shooting Different Types of Products', duration: 45 }
        ]
      }
    ],
    rating: 4.9,
    enrolledCount: 478,
    tags: ['photography', 'product photos', 'smartphone photography', 'e-commerce']
  },
  {
    id: 'c4',
    title: 'E-commerce Website Development',
    description: 'Build your own e-commerce website from scratch using popular platforms like Shopify and WooCommerce. No coding experience required.',
    price: 2499,
    imageURL: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
    category: 'Web Development',
    instructor: {
      id: 'instructor4',
      name: 'Arjun Mehta',
      photoURL: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
    },
    level: 'intermediate',
    duration: 720, // 12 hours in minutes
    modules: [
      {
        title: 'E-commerce Platforms Overview',
        lessons: [
          { title: 'Choosing the Right Platform for Your Business', duration: 30 },
          { title: 'Domain Names and Hosting', duration: 25 },
          { title: 'Setting Up Your Store Basics', duration: 45 }
        ]
      },
      {
        title: 'Building Your Store with Shopify',
        lessons: [
          { title: 'Shopify Store Setup', duration: 60 },
          { title: 'Product Listings & Categories', duration: 40 },
          { title: 'Payment & Shipping Configuration', duration: 35 }
        ]
      }
    ],
    rating: 4.7,
    enrolledCount: 156,
    tags: ['e-commerce', 'website', 'shopify', 'woocommerce', 'online store']
  },
  {
    id: 'c5',
    title: 'Traditional Embroidery Techniques',
    description: 'Learn the art of traditional Indian embroidery techniques including Kantha, Chikankari, and Phulkari. This course covers basic to advanced stitches with practical projects.',
    price: 1299,
    imageURL: 'https://images.pexels.com/photos/6192554/pexels-photo-6192554.jpeg',
    category: 'Crafts',
    instructor: {
      id: 'instructor5',
      name: 'Lakshmi Devi',
      photoURL: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
    },
    level: 'beginner',
    duration: 540, // 9 hours in minutes
    modules: [
      {
        title: 'Embroidery Basics',
        lessons: [
          { title: 'Tools and Materials', duration: 20 },
          { title: 'Basic Stitches & Techniques', duration: 45 },
          { title: 'Color Selection & Design Basics', duration: 30 }
        ]
      },
      {
        title: 'Traditional Techniques',
        lessons: [
          { title: 'Introduction to Kantha Embroidery', duration: 60 },
          { title: 'Chikankari Basics', duration: 50 },
          { title: 'Phulkari Embroidery Project', duration: 70 }
        ]
      }
    ],
    rating: 4.9,
    enrolledCount: 289,
    tags: ['embroidery', 'handicrafts', 'traditional', 'kantha', 'chikankari']
  },
  {
    id: 'c6',
    title: 'Supply Chain Management for Small Businesses',
    description: 'Understand the fundamentals of supply chain management to optimize your business operations. Learn inventory management, supplier relationships, and logistics planning.',
    price: 1799,
    imageURL: 'https://images.pexels.com/photos/7203788/pexels-photo-7203788.jpeg',
    category: 'Business Operations',
    instructor: {
      id: 'instructor6',
      name: 'Vikram Singh',
      photoURL: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg'
    },
    level: 'intermediate',
    duration: 420, // 7 hours in minutes
    modules: [
      {
        title: 'Supply Chain Fundamentals',
        lessons: [
          { title: 'Introduction to Supply Chain Management', duration: 30 },
          { title: 'Supply Chain Components', duration: 25 },
          { title: 'Common Challenges for Small Businesses', duration: 35 }
        ]
      },
      {
        title: 'Inventory & Supplier Management',
        lessons: [
          { title: 'Inventory Management Techniques', duration: 45 },
          { title: 'Building Supplier Relationships', duration: 30 },
          { title: 'Quality Control Processes', duration: 40 }
        ]
      }
    ],
    rating: 4.5,
    enrolledCount: 132,
    tags: ['supply chain', 'inventory management', 'logistics', 'operations', 'business']
  }
];

// Function to simulate fetching courses from an API
export const getCoursesData = () => {
  return {
    courses: mockCourses,
    hasMore: false
  };
};

// Function to get a course by ID
export const getCourseById = (courseId: string) => {
  return mockCourses.find(course => course.id === courseId);
};

// Function to get courses by category
export const getCoursesByCategory = (category: string) => {
  return mockCourses.filter(course => course.category === category);
};

// Function to get courses by instructor
export const getCoursesByInstructor = (instructorId: string) => {
  return mockCourses.filter(course => course.instructor.id === instructorId);
};

// Function to get courses by level
export const getCoursesByLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
  return mockCourses.filter(course => course.level === level);
};

// Function to search courses
export const searchCourses = (query: string) => {
  const searchTerm = query.toLowerCase();
  return mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm) ||
    course.description.toLowerCase().includes(searchTerm) ||
    course.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}; 