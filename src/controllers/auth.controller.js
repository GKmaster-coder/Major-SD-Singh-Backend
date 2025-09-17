import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// REGISTER
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, Email and Password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const user = await User.create({ name, email, password });
  const token = user.generateToken();

  // convert to plain object and remove sensitive fields
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: userObj, token },
        "User registered successfully"
      )
    );
});

// LOGIN
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = user.generateToken();

  // convert to plain object and remove sensitive fields
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: userObj, token }, "Login successful")
    );
});

export { registerUser, loginUser };
