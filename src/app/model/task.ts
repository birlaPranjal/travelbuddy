import mongoose from 'mongoose';

export interface ITask {
  userId: string;
  taskId: string;
  title: string;
  description: string;
  category: 'transportation' | 'accommodation' | 'activities' | 'documentation' | 'planning';
  status: 'pending' | 'completed' | 'verified';
  completedAt?: Date;
  verifiedAt?: Date;
  nftTokenId?: string;
  metadataUri?: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  taskId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['transportation', 'accommodation', 'activities', 'documentation', 'planning'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'verified'],
    default: 'pending'
  },
  completedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },
  nftTokenId: {
    type: String
  },
  metadataUri: {
    type: String
  }
}, {
  timestamps: true
});

export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);

// Predefined travel tasks
export const TRAVEL_TASKS = [
  {
    taskId: 'flight-booking',
    title: 'Book Flight Tickets',
    description: 'Research and book flight tickets for your trip',
    category: 'transportation'
  },
  {
    taskId: 'hotel-reservation',
    title: 'Reserve Accommodation',
    description: 'Book your hotel or other accommodation',
    category: 'accommodation'
  },
  {
    taskId: 'visa-application',
    title: 'Apply for Visa',
    description: 'Complete visa application process',
    category: 'documentation'
  },
  {
    taskId: 'travel-insurance',
    title: 'Purchase Travel Insurance',
    description: 'Get travel insurance coverage',
    category: 'documentation'
  },
  {
    taskId: 'itinerary-planning',
    title: 'Plan Daily Itinerary',
    description: 'Create a detailed travel itinerary',
    category: 'planning'
  },
  {
    taskId: 'local-transport',
    title: 'Research Local Transportation',
    description: 'Research local transport options at destination',
    category: 'transportation'
  },
  {
    taskId: 'packing-list',
    title: 'Create Packing List',
    description: 'Prepare a comprehensive packing list',
    category: 'planning'
  },
  {
    taskId: 'currency-exchange',
    title: 'Arrange Currency Exchange',
    description: 'Exchange currency for your trip',
    category: 'planning'
  },
  {
    taskId: 'local-activities',
    title: 'Research Local Activities',
    description: 'Find and plan local activities',
    category: 'activities'
  },
  {
    taskId: 'emergency-contacts',
    title: 'Save Emergency Contacts',
    description: 'Save important emergency contacts',
    category: 'planning'
  }
]; 