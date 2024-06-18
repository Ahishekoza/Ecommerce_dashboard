import mongoose from "mongoose";

export const connectDB =async()=>{
    try {
        const connected = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected",connected.connection.host);
    } catch (error) {
        console.log('Unable to connect DB');
        throw new Error(error.message)
        
    }
}