import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },

    }, { timestamps: true }
);


// Hash password before saving
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    this.password =await bcrypt.hash(this.password,10);
    next();
})

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};



const User = mongoose.model("User", userSchema);
export default User;