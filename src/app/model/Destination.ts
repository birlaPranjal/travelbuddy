import mongoose, { Document, Schema } from 'mongoose';

interface ITrip extends Document {
  user: mongoose.Schema.Types.ObjectId;
  latitude: number;
  longitude: number;
  dateFrom: Date;
  dateTo: Date;
  budgetRange: { min: number; max: number };
}

const tripSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    budgetRange: { 
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

const TripModel = mongoose.models.Trip || mongoose.model<ITrip>('Trip', tripSchema);
export default TripModel;
