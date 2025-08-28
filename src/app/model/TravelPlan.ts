import mongoose from 'mongoose';

const travelPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  destination: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords: number[]) {
          return Array.isArray(coords) && 
                 coords.length === 2 && 
                 coords[0] >= -180 && 
                 coords[0] <= 180 && 
                 coords[1] >= -90 && 
                 coords[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },
  formattedAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create the 2dsphere index
travelPlanSchema.index({ coordinates: '2dsphere' });

const TravelPlan = mongoose.models.TravelPlan || mongoose.model('TravelPlan', travelPlanSchema);

export default TravelPlan;