import mongoose from "mongoose";
export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("Mongo uri is not defined");
    }
    try {
        const conn = await mongoose.connect(uri);
        console.log("Connected to DB successfully: " + conn.connection.host);
    }
    catch (err) {
        console.log(err);
    }
};
