import mongoose from "mongoose";
// Define the User schema
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model("User", userSchema);
// Export the model
export default User;
