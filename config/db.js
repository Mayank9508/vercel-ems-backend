import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    let res = await mongoose.connect(process.env.MONGODB_URL);
    if (res) {
      console.log("mongoDb connected");
    }
  } catch (error) {
    console.log("error while connecting in mongodb");
  }
};

// xZMLiKjPuHowOTWE
// mayankkumar737003_db_user
// mongodb+srv://mayankkumar737003_db_user:xZMLiKjPuHowOTWE@emsdatabase.vbnqyil.mongodb.net/