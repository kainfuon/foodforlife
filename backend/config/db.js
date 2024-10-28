import mongoose from "mongoose";
//const MONGO_URL = 'mongodb+srv://kainfuon:Test1234567@cluster0.ayrph.mongodb.net/food-del'

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://kainfuon:<db_password>@cluster0.ayrph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(() => {
            console.log('Database is connected');
        })
}