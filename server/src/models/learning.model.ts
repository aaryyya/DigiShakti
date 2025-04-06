import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson {
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  lessons: ILesson[];
  instructor: mongoose.Types.ObjectId;
  enrolledUsers: mongoose.Types.ObjectId[];
  completedUsers: mongoose.Types.ObjectId[];
  rating: number;
  numReviews: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProgress extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedLessons: number[];
  lastAccessedAt: Date;
  certificateIssued: boolean;
  certificateUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a lesson description'],
  },
  content: {
    type: String,
    required: [true, 'Please provide lesson content'],
  },
  videoUrl: {
    type: String,
  },
  duration: {
    type: Number,
    required: [true, 'Please provide lesson duration in minutes'],
    default: 0,
  },
  order: {
    type: Number,
    required: [true, 'Please provide the lesson order'],
  },
});

const CourseSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [100, 'Course title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a course category'],
      enum: [
        'Business',
        'Technology',
        'Marketing',
        'Finance',
        'Skills',
        'Entrepreneurship',
        'Other',
      ],
    },
    level: {
      type: String,
      required: [true, 'Please provide the course level'],
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    thumbnail: {
      type: String,
      required: [true, 'Please provide a course thumbnail'],
    },
    lessons: [LessonSchema],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    completedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      required: [true, 'Please specify the course language'],
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

const UserProgressSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLessons: [
      {
        type: Number,
      },
    ],
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema); 