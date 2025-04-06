// Types shared across the application
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageURL?: string;
  category: string;
  seller?: {
    id: string;
    name: string;
  };
  tags?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageURL?: string;
  category: string;
  instructor: {
    id: string;
    name: string;
    photoURL?: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  modules?: {
    title: string;
    lessons: {
      title: string;
      duration: number;
    }[];
  }[];
  rating?: number;
  enrolledCount?: number;
  tags?: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  category: string;
  tags?: string[];
  imageURL?: string;
  likes: number;
  comments: Comment[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  likes: number;
  createdAt: any;
} 