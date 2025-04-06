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
  setDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { Course } from "../types";

const COURSES_COLLECTION = "courses";
const USER_PROGRESS_COLLECTION = "userProgress";

// Interface for user progress
export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  lessonNotes: {
    lessonId: string;
    note: string;
  }[];
  lastAccessed: any;
}

// Get courses with pagination
export const getCourses = async (
  lastVisible: DocumentSnapshot | null = null,
  itemsPerPage: number = 10,
  category?: string
) => {
  try {
    let coursesQuery: any;
    
    if (category) {
      coursesQuery = query(
        collection(db, COURSES_COLLECTION),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    } else {
      coursesQuery = query(
        collection(db, COURSES_COLLECTION),
        orderBy("createdAt", "desc")
      );
    }
    
    // Apply pagination if there's a last document
    if (lastVisible) {
      coursesQuery = query(
        coursesQuery,
        startAfter(lastVisible),
        limit(itemsPerPage)
      );
    } else {
      coursesQuery = query(coursesQuery, limit(itemsPerPage));
    }
    
    const querySnapshot = await getDocs(coursesQuery);
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    // Map the documents to course objects
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Course, 'id'>)
    })) as Course[];
    
    return { courses, lastVisible: lastVisibleDoc };
  } catch (error) {
    console.error("Error getting courses:", error);
    throw error;
  }
};

// Get featured courses
export const getFeaturedCourses = async (limitCount: number = 4) => {
  try {
    // In a real app, you'd have a 'featured' field or similar
    // For demo purposes, we'll just get the most popular courses
    const coursesQuery = query(
      collection(db, COURSES_COLLECTION),
      orderBy("enrolledCount", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(coursesQuery);
    
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Course, 'id'>)
    })) as Course[];
    
    return courses;
  } catch (error) {
    console.error("Error getting featured courses:", error);
    throw error;
  }
};

// Get course by ID
export const getCourseById = async (courseId: string) => {
  try {
    const docRef = doc(db, COURSES_COLLECTION, courseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Course;
    } else {
      throw new Error("Course not found");
    }
  } catch (error) {
    console.error("Error getting course:", error);
    throw error;
  }
};

// Add course
export const addCourse = async (
  course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>,
  thumbnailFile: File
) => {
  try {
    // Upload thumbnail to Firebase Storage
    const storageRef = ref(storage, `courses/${Date.now()}_${thumbnailFile.name}`);
    const uploadResult = await uploadBytes(storageRef, thumbnailFile);
    const thumbnailUrl = await getDownloadURL(uploadResult.ref);
    
    // Add course to Firestore
    const courseData = {
      ...course,
      thumbnailUrl,
      enrollmentCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COURSES_COLLECTION), courseData);
    
    return {
      id: docRef.id,
      ...courseData
    };
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

// Update course
export const updateCourse = async (
  courseId: string, 
  courseData: Partial<Course>, 
  newThumbnailFile?: File
) => {
  try {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    
    // Get the current course data
    const courseSnap = await getDoc(courseRef);
    if (!courseSnap.exists()) {
      throw new Error("Course not found");
    }
    
    const currentData = courseSnap.data() as Course;
    
    // Handle thumbnail update if there's a new image
    let imageURL = currentData.imageURL;
    
    if (newThumbnailFile) {
      // Delete the old thumbnail if it exists
      if (currentData.imageURL) {
        try {
          // Extract the path from the URL
          const oldImagePath = currentData.imageURL.split('courses%2F')[1].split('?')[0];
          const oldImageRef = ref(storage, `courses/${oldImagePath}`);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
      
      // Upload the new image
      const storageRef = ref(storage, `courses/${Date.now()}_${newThumbnailFile.name}`);
      const uploadResult = await uploadBytes(storageRef, newThumbnailFile);
      imageURL = await getDownloadURL(uploadResult.ref);
    }
    
    // Update course in Firestore
    const updatedData = {
      ...courseData,
      imageURL,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(courseRef, updatedData);
    
    return {
      ...currentData,
      ...updatedData,
      id: courseId
    } as Course;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Delete course
export const deleteCourse = async (courseId: string) => {
  try {
    // Get the course data to retrieve the thumbnail URL
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (!courseSnap.exists()) {
      throw new Error("Course not found");
    }
    
    const courseData = courseSnap.data() as Course;
    
    // Delete the thumbnail from Storage
    if (courseData.imageURL) {
      try {
        // Extract the path from the URL
        const imagePath = courseData.imageURL.split('courses%2F')[1].split('?')[0];
        const imageRef = ref(storage, `courses/${imagePath}`);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting thumbnail (continuing anyway):", error);
      }
    }
    
    // Delete the course from Firestore
    await deleteDoc(courseRef);
    
    return { id: courseId, success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

// Get user's progress for a course
export const getUserCourseProgress = async (userId: string, courseId: string) => {
  try {
    const progressRef = doc(db, USER_PROGRESS_COLLECTION, `${userId}_${courseId}`);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return progressSnap.data() as UserProgress;
    } else {
      // Create an initial progress record if it doesn't exist
      const initialProgress: UserProgress = {
        userId,
        courseId,
        completedLessons: [],
        lessonNotes: [],
        lastAccessed: serverTimestamp()
      };
      
      await setDoc(progressRef, initialProgress);
      return initialProgress;
    }
  } catch (error) {
    console.error("Error getting user progress:", error);
    throw error;
  }
};

// Function to calculate progress percentage for a course
const calculateProgress = (completedLessons: string[], course: Course): number => {
  // Count total lessons across all modules
  let totalLessons = 0;
  
  if (course.modules) {
    course.modules.forEach(module => {
      totalLessons += module.lessons.length;
    });
  }
  
  return totalLessons > 0 
    ? Math.round((completedLessons.length / totalLessons) * 100) 
    : 0;
};

// Mark a lesson as completed
export const markLessonAsCompleted = async (
  userId: string, 
  courseId: string, 
  lessonId: string,
  course: Course
) => {
  try {
    // Get the progress document
    const progressQuery = query(
      collection(db, USER_PROGRESS_COLLECTION),
      where("userId", "==", userId),
      where("courseId", "==", courseId)
    );
    
    const querySnapshot = await getDocs(progressQuery);
    
    let progressRef;
    let userProgress: UserProgress;
    
    if (querySnapshot.empty) {
      // Create new progress document
      userProgress = {
        userId,
        courseId,
        completedLessons: [lessonId],
        lessonNotes: [],
        lastAccessed: serverTimestamp()
      };
      
      progressRef = await addDoc(collection(db, USER_PROGRESS_COLLECTION), userProgress);
    } else {
      // Update existing progress
      progressRef = doc(db, USER_PROGRESS_COLLECTION, querySnapshot.docs[0].id);
      const existingProgress = querySnapshot.docs[0].data() as UserProgress;
      
      // Check if lesson is already marked as completed
      if (!existingProgress.completedLessons.includes(lessonId)) {
        await updateDoc(progressRef, {
          completedLessons: arrayUnion(lessonId),
          lastAccessed: serverTimestamp()
        });
      }
      
      // Get updated progress after update
      const updatedDoc = await getDoc(progressRef);
      userProgress = updatedDoc.data() as UserProgress;
    }
    
    // Get the updated document
    const updatedDoc = await getDoc(progressRef);
    
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      progressPercentage: calculateProgress(userProgress.completedLessons, course)
    };
  } catch (error) {
    console.error("Error marking lesson as completed:", error);
    throw error;
  }
};

// Add a note to a lesson
export const addLessonNote = async (
  userId: string,
  courseId: string,
  lessonId: string,
  noteContent: string
) => {
  try {
    const progressRef = doc(db, USER_PROGRESS_COLLECTION, `${userId}_${courseId}`);
    
    const note = {
      lessonId,
      note: noteContent,
      createdAt: serverTimestamp()
    };
    
    await updateDoc(progressRef, {
      lessonNotes: arrayUnion(note),
      lastAccessed: serverTimestamp()
    });
    
    return note;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

// Get instructor's courses
export const getInstructorCourses = async (instructorId: string) => {
  try {
    const instructorQuery = query(
      collection(db, COURSES_COLLECTION),
      where("instructor.uid", "==", instructorId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(instructorQuery);
    
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Course[];
    
    return courses;
  } catch (error) {
    console.error("Error getting instructor courses:", error);
    throw error;
  }
};

// For development purposes: Seed courses
export const seedCourses = async () => {
  try {
    const courses = [
      {
        title: "Digital Marketing for Small Businesses",
        description: "Learn how to market your products and services online effectively with limited resources.",
        price: 499,
        imageURL: "https://source.unsplash.com/random/800x600/?marketing",
        category: "Business",
        instructor: {
          id: "instructor_1",
          name: "Priya Sharma",
          photoURL: "https://source.unsplash.com/random/100x100/?woman"
        },
        level: "beginner",
        duration: 180, // in minutes
        modules: [
          {
            title: "Social Media Marketing",
            lessons: [
              { title: "Choosing the Right Platforms", duration: 20 },
              { title: "Creating Engaging Content", duration: 25 },
              { title: "Building Your Community", duration: 20 }
            ]
          },
          {
            title: "Email Marketing",
            lessons: [
              { title: "Building Your List", duration: 15 },
              { title: "Crafting Effective Emails", duration: 25 },
              { title: "Measuring Success", duration: 20 }
            ]
          }
        ],
        rating: 4.5,
        enrolledCount: 875
      },
      {
        title: "Traditional Embroidery Techniques",
        description: "Learn the art of traditional Indian embroidery with step-by-step instructions and cultural context.",
        price: 799,
        imageURL: "https://source.unsplash.com/random/800x600/?embroidery",
        category: "Crafts",
        instructor: {
          id: "instructor_2",
          name: "Lakshmi Devi",
          photoURL: "https://source.unsplash.com/random/100x100/?indian,woman"
        },
        level: "intermediate",
        duration: 240, // in minutes
        modules: [
          {
            title: "Introduction to Embroidery",
            lessons: [
              { title: "History and Cultural Significance", duration: 30 },
              { title: "Essential Tools and Materials", duration: 20 }
            ]
          },
          {
            title: "Basic Stitches",
            lessons: [
              { title: "Running Stitch and Its Variations", duration: 45 },
              { title: "Chain Stitch Mastery", duration: 50 }
            ]
          }
        ],
        rating: 4.9,
        enrolledCount: 450
      }
    ];
    
    for (const course of courses) {
      await addDoc(collection(db, COURSES_COLLECTION), {
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log(`Successfully seeded ${courses.length} courses`);
    return { success: true, count: courses.length };
  } catch (error) {
    console.error("Error seeding courses:", error);
    throw error;
  }
}; 