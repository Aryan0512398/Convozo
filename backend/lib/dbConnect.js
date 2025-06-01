import mongoose from "mongoose";

// Connection of DB
const connectDb=async()=>{
    try {
        mongoose.connection.on('connected',()=> console.log("Databse Connected Successfully"))
        await mongoose.connect(`${process.env.MONGO_URL}/convozo`)
    } catch (error) {
        console.log("Error occurs", error)
    }
}
export default connectDb