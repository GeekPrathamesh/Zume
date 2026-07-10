import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    await mongoose.connect(process.env.MONGO_URI);

    // Clean up any deprecated Clerk unique index from database
    try {
      await mongoose.connection.db.collection("users").dropIndex("clerkId_1");
      console.log("Dropped obsolete clerkId_1 index");
    } catch (err) {
      // Index does not exist, safe to ignore
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};
