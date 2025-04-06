import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success!',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    close: 'Close',
  },
  header: {
    home: 'Home',
    marketplace: 'Marketplace',
    learning: 'Learning',
    community: 'Community',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    language: 'Language',
  },
  footer: {
    about: 'About Us',
    contact: 'Contact',
    careers: 'Careers',
    blog: 'Blog',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    copyright: '© 2023 DigiSakhi. All rights reserved.',
    links: {
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      contact: 'Contact Us'
    },
  },
  auth: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    phone: 'Phone Number',
    businessName: 'Business Name',
    businessType: 'Business Type',
    location: 'Location',
    signOut: 'Sign Out',
  },
  marketplace: {
    title: 'Marketplace',
    search: 'Search products...',
    categories: 'Categories',
    filters: 'Filters',
    sort: 'Sort By',
    price: 'Price',
    rating: 'Rating',
    seller: 'Seller',
    add_to_cart: 'Add to Cart',
    view_details: 'View Details',
    out_of_stock: 'Out of Stock',
    quantity: 'Quantity',
    description: 'Description',
    specifications: 'Specifications',
    reviews: 'Reviews',
    similar_products: 'Similar Products',
    cart: 'Shopping Cart',
    checkout: 'Checkout',
  },
  learning: {
    title: 'Learning Center',
    search: 'Search courses...',
    categories: 'Categories',
    filters: 'Filters',
    sort: 'Sort By',
    price: 'Price',
    rating: 'Rating',
    duration: 'Duration',
    level: 'Level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    instructor: 'Instructor',
    lessons: 'Lessons',
    progress: 'Progress',
    completed: 'Completed',
    continue: 'Continue Learning',
    enroll: 'Enroll Now',
    description: 'About this course',
    curriculum: 'Curriculum',
    reviews: 'Reviews',
    similar_courses: 'Similar Courses',
  },
  community: {
    title: 'Community',
    forums: 'Forums',
    mentors: 'Mentors',
    events: 'Events',
    stories: 'Success Stories',
    connect: 'Connect',
    latest_posts: 'Latest Posts',
    trending_topics: 'Trending Topics',
    ask_question: 'Ask a Question',
    join_discussion: 'Join Discussion',
    find_mentor: 'Find a Mentor',
    become_mentor: 'Become a Mentor',
    upcoming_events: 'Upcoming Events',
    past_events: 'Past Events',
    register_event: 'Register',
    share_story: 'Share Your Story',
  },
  form: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone Number',
    subject: 'Subject',
    message: 'Message',
    send: 'Send Message',
    sending: 'Sending...',
    success: 'Your message has been sent. We will get back to you soon!'
  },
};

// Hindi translations (simplified example)
const hiTranslations = {
  common: {
    loading: 'लोड हो रहा है...',
    error: 'एक त्रुटि हुई',
    success: 'सफलता!',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    view: 'देखें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    sort: 'क्रमबद्ध करें',
    back: 'वापस',
    next: 'अगला',
    previous: 'पिछला',
    submit: 'जमा करें',
    close: 'बंद करें',
  },
  header: {
    home: 'होम',
    marketplace: 'मार्केटप्लेस',
    learning: 'सीखना',
    community: 'समुदाय',
    login: 'लॉग इन',
    register: 'रजिस्टर',
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफाइल',
    logout: 'लॉग आउट',
    language: 'भाषा',
  },
  // Add more translations as needed
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      hi: {
        translation: hiTranslations,
      },
      // Add more languages as needed
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for React
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 