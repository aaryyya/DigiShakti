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
  arrayUnion,
  arrayRemove,
  increment,
  setDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { Post, Comment } from "../types";

const POSTS_COLLECTION = "posts";
const LIKED_POSTS_COLLECTION = "likedPosts";

// Get all community posts with pagination
export const getPosts = async (
  lastVisible: DocumentSnapshot | null = null,
  itemsPerPage: number = 10,
  category?: string
) => {
  try {
    let postsQuery: any;
    
    if (category) {
      postsQuery = query(
        collection(db, POSTS_COLLECTION),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    } else {
      postsQuery = query(
        collection(db, POSTS_COLLECTION),
        orderBy("createdAt", "desc")
      );
    }
    
    // Apply pagination if there's a last document
    if (lastVisible) {
      postsQuery = query(
        postsQuery,
        startAfter(lastVisible),
        limit(itemsPerPage)
      );
    } else {
      postsQuery = query(postsQuery, limit(itemsPerPage));
    }
    
    const querySnapshot = await getDocs(postsQuery);
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    // Map the documents to post objects
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Post, 'id'>)
    })) as Post[];
    
    return { posts, lastVisible: lastVisibleDoc };
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

// Get trending posts (most liked or commented in the last week)
export const getTrendingPosts = async (limitCount: number = 4) => {
  try {
    // Get posts from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // In a real implementation, you'd want to use a more sophisticated
    // algorithm and perhaps store trending scores in the documents
    const postsQuery = query(
      collection(db, POSTS_COLLECTION),
      orderBy("likes", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(postsQuery);
    
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Post, 'id'>)
    })) as Post[];
    
    return posts;
  } catch (error) {
    console.error("Error getting trending posts:", error);
    throw error;
  }
};

// Get post by ID
export const getPostById = async (postId: string) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error("Post not found");
    }
    
    const postData = postSnap.data() as Omit<Post, 'id'>;
    
    return {
      id: postSnap.id,
      ...postData
    } as Post;
  } catch (error) {
    console.error("Error getting post:", error);
    throw error;
  }
};

// Add a new post
export const addPost = async (
  postData: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>,
  imageFile?: File
) => {
  try {
    let imageURL = postData.imageURL;
    
    // If an image was provided, upload it to storage
    if (imageFile) {
      const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(uploadResult.ref);
    }
    
    // Add the post to Firestore
    const newPost = {
      ...postData,
      imageURL,
      likes: 0,
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const postRef = await addDoc(collection(db, POSTS_COLLECTION), newPost);
    
    return {
      id: postRef.id,
      ...newPost,
      comments: [] // Ensure comments is an array
    } as Post;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

// Update an existing post
export const updatePost = async (
  postId: string, 
  postData: Partial<Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>>, 
  imageFile?: File
) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    let updateData = { ...postData, updatedAt: serverTimestamp() };
    
    // If an image was provided, upload it to storage
    if (imageFile) {
      // Delete previous image if exists
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const currentData = postSnap.data();
        if (currentData.imageURL) {
          try {
            const oldImageRef = ref(storage, currentData.imageURL);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.warn("Could not delete old image:", error);
          }
        }
      }
      
      // Upload new image
      const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageURL = await getDownloadURL(uploadResult.ref);
      
      updateData = { ...updateData, imageURL };
    }
    
    await updateDoc(postRef, updateData);
    
    // Get the updated post
    const updatedPostSnap = await getDoc(postRef);
    const updatedPostData = updatedPostSnap.data() as Omit<Post, 'id'>;
    
    return {
      id: postId,
      ...updatedPostData
    } as Post;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId: string) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    
    // Get the post to check for an image to delete
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const postData = postSnap.data();
      if (postData.imageURL) {
        try {
          const imageRef = ref(storage, postData.imageURL);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn("Could not delete post image:", error);
        }
      }
    }
    
    // Delete the post document
    await deleteDoc(postRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Add a comment to a post
export const addComment = async (
  postId: string,
  commentData: Omit<Comment, 'id' | 'likes' | 'createdAt'>
) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    
    // Create the comment object
    const newComment: Comment = {
      id: Date.now().toString(), // Simple ID generation
      ...commentData,
      likes: 0,
      createdAt: serverTimestamp()
    };
    
    // Add comment to the post
    await updateDoc(postRef, {
      comments: arrayUnion(newComment),
      updatedAt: serverTimestamp()
    });
    
    return newComment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Delete a comment from a post
export const deleteComment = async (
  postId: string,
  userId: string,
  commentId: string
) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error("Post not found");
    }
    
    const postData = postSnap.data() as Post;
    
    // Find the comment
    const comment = postData.comments.find(c => c.id === commentId);
    
    if (!comment) {
      throw new Error("Comment not found");
    }
    
    // Check if the user is the comment author or post author
    if (userId !== comment.authorId && userId !== postData.authorId) {
      throw new Error("Unauthorized: You can only delete your own comments or comments on your posts");
    }
    
    // Remove the comment
    await updateDoc(postRef, {
      comments: arrayRemove(comment),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, commentId };
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Like a post
export const likePost = async (postId: string) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    
    await updateDoc(postRef, {
      likes: increment(1)
    });
    
    // Get the updated post
    const updatedPostSnap = await getDoc(postRef);
    const updatedPostData = updatedPostSnap.data() as Omit<Post, 'id'>;
    
    return {
      id: postId,
      ...updatedPostData
    } as Post;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// Unlike a post
export const unlikePost = async (postId: string) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    
    // Get current likes to ensure it doesn't go below 0
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) {
      throw new Error("Post not found");
    }
    
    const currentLikes = postSnap.data().likes || 0;
    
    await updateDoc(postRef, {
      likes: increment(currentLikes > 0 ? -1 : 0)
    });
    
    // Get the updated post
    const updatedPostSnap = await getDoc(postRef);
    const updatedPostData = updatedPostSnap.data() as Omit<Post, 'id'>;
    
    return {
      id: postId,
      ...updatedPostData
    } as Post;
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
};

// Check if user has liked a post
export const checkPostLiked = async (postId: string, userId: string) => {
  try {
    const likeRef = doc(db, LIKED_POSTS_COLLECTION, `${userId}_${postId}`);
    const likeDoc = await getDoc(likeRef);
    
    return likeDoc.exists();
  } catch (error) {
    console.error("Error checking if post is liked:", error);
    throw error;
  }
};

// Get posts by user
export const getUserPosts = async (userId: string) => {
  try {
    const userPostsQuery = query(
      collection(db, POSTS_COLLECTION),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(userPostsQuery);
    
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    
    return posts;
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

// Search posts
export const searchPosts = async (
  searchTerm: string,
  limitCount: number = 10
) => {
  try {
    // Firebase doesn't support text search directly, so we're using a client-side approach
    searchTerm = searchTerm.toLowerCase();
    
    // Get all posts (in a real app, you'd need pagination)
    const querySnapshot = await getDocs(collection(db, POSTS_COLLECTION));
    
    // Filter posts that contain the search term in title, content, or tags
    const posts = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, 'id'>)
      }))
      .filter(post => {
        const title = post.title.toLowerCase();
        const content = post.content.toLowerCase();
        const tags = post.tags?.map(tag => tag.toLowerCase()) || [];
        
        return (
          title.includes(searchTerm) || 
          content.includes(searchTerm) ||
          tags.some(tag => tag.includes(searchTerm))
        );
      })
      .slice(0, limitCount);
    
    return posts;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
};

// Seed initial community posts (for development)
export const seedCommunityPosts = async () => {
  const samplePosts = [
    {
      title: "Looking for advice on selling handmade jewelry",
      content: "I've been making handcrafted jewelry for years as a hobby, but now I want to turn it into a small business. I'm unsure about pricing my items and finding the right platforms to sell. Has anyone here had success selling handmade jewelry? Would love some guidance!",
      authorId: "user_1",
      authorName: "Meera Patel",
      authorPhotoURL: "https://via.placeholder.com/150?text=Meera",
      category: "Business",
      tags: ["jewelry", "handmade", "pricing", "selling"]
    },
    {
      title: "Traditional textile techniques workshop in Delhi",
      content: "Hi everyone! I'm organizing a two-day workshop on traditional Indian textile techniques in Delhi next month. We'll cover block printing, basic handloom weaving, and natural dyeing methods. It's perfect for beginners and those looking to incorporate traditional methods into their craft. Limited spots available, please comment if you're interested!",
      authorId: "user_2",
      authorName: "Anjali Sharma",
      authorPhotoURL: "https://via.placeholder.com/150?text=Anjali",
      category: "Events",
      tags: ["workshop", "textiles", "crafts", "delhi", "traditional"]
    },
    {
      title: "Success story: How I started my catering business from home",
      content: "Three years ago, I was a homemaker with a passion for cooking. Today, I run a successful catering business specializing in regional cuisine for events and corporate meetings. It wasn't easy, but with determination and smart planning, I've built a brand that supports my family. In this post, I want to share my journey and the key lessons I learned along the way...",
      authorId: "user_3",
      authorName: "Lakshmi Iyer",
      authorPhotoURL: "https://via.placeholder.com/150?text=Lakshmi",
      category: "Success Stories",
      tags: ["catering", "food", "business", "entrepreneurship", "success"]
    }
  ];
  
  try {
    // Add each post to Firestore
    for (const post of samplePosts) {
      const postData = {
        ...post,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, POSTS_COLLECTION), postData);
    }
    
    console.log(`Added ${samplePosts.length} sample community posts`);
    return true;
  } catch (error) {
    console.error("Error seeding community posts:", error);
    throw error;
  }
}; 