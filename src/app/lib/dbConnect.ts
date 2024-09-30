import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        await mongoose.connect('mongodb+srv://birlapranjal460:2004@firstcluster.uziz0.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

export default dbConnect;
