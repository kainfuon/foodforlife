import mongoose from "mongoose";
//const MONGO_URL = 'mongodb+srv://kainfuon:Test12345678@cluster0.ayrph.mongodb.net/food-del'

export const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/my_database')
        .then(() => {
            console.log('Database is connected');
        })
}