import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://ruchihaar:ruchihaar123@cluster0.xmqkdts.mongodb.net/food-del').then(()=>console.log("DB Connected"));
   
}
