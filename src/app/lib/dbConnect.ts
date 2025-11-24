import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://birlapranjal460:2004@firstcluster.uziz0.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster';
        
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return;
        }
        
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error;
    }
};

export default dbConnect;
