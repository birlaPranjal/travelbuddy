import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
    email: { type: String, required: true },
    searchedDestination: { type: String, required: true },
    travelDate: { type: Date, required: true }, // New field for travel date
    timestamp: { type: Date, default: Date.now },
  });
  
const DestinationModel = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);
  export default DestinationModel;
  