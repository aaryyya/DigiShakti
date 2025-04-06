import mongoose, { Schema, Document } from 'mongoose';

export interface IForumPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  category: string;
  likes: mongoose.Types.ObjectId[];
  comments: {
    content: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  organizer: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  category: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISuccessStory extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  featuredImage: string;
  published: boolean;
  likes: mongoose.Types.ObjectId[];
  businessSector: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMentorship extends Document {
  mentor: mongoose.Types.ObjectId;
  mentee: mongoose.Types.ObjectId;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  startDate?: Date;
  endDate?: Date;
  goals: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ForumPostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide post content'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Business',
        'Technology',
        'Marketing',
        'Finance',
        'Skills',
        'Entrepreneurship',
        'Networking',
        'Other',
      ],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        content: {
          type: String,
          required: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location or "Virtual"'],
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: String,
      required: [true, 'Please provide an event category'],
      enum: [
        'Workshop',
        'Networking',
        'Webinar',
        'Trade Show',
        'Conference',
        'Training',
        'Other',
      ],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SuccessStorySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a story title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide story content'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featuredImage: {
      type: String,
      required: [true, 'Please provide a featured image'],
    },
    published: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    businessSector: {
      type: String,
      required: [true, 'Please provide a business sector'],
      enum: [
        'Handcraft',
        'Textiles',
        'Food',
        'Agriculture',
        'Beauty',
        'Technology',
        'Services',
        'Other',
      ],
    },
  },
  {
    timestamps: true,
  }
);

const MentorshipSchema: Schema = new Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'completed', 'rejected'],
      default: 'pending',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    goals: {
      type: String,
      required: [true, 'Please provide the mentorship goals'],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const ForumPost = mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
export const Event = mongoose.model<IEvent>('Event', EventSchema);
export const SuccessStory = mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);
export const Mentorship = mongoose.model<IMentorship>('Mentorship', MentorshipSchema); 