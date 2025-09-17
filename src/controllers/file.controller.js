import File from "../models/file.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Upload File(s)
const uploadFile = asyncHandler(async (req, res) => {
  if ((!req.file && !req.files) || (req.files && req.files.length === 0)) {
    throw new ApiError(400, "No file uploaded");
  }

  let uploadedFiles = [];
  const filesToUpload = req.files && req.files.length > 0 ? req.files : [req.file];

  for (const file of filesToUpload) {
    const cloudResult = await uploadOnCloudinary(file.path);
    if (!cloudResult) throw new ApiError(500, "Upload failed");

    const newFile = await File.create({
      title: req.body.title || file.originalname,
      type: file.mimetype,
      url: cloudResult.secure_url,
      page: req.body.page,
      category: req.body.category || "general",
    });

    uploadedFiles.push(newFile);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, uploadedFiles, "File(s) uploaded successfully"));
});

// Get Files by Page
const getFilesByPage = asyncHandler(async (req, res) => {
  const files = await File.find({ page: req.params.page });
  return res.status(200).json(new ApiResponse(200, files, "Files fetched successfully"));
});

// Get Files by Category
const getFilesByCategory = asyncHandler(async (req, res) => {
  const files = await File.find({ category: req.params.category });
  return res.status(200).json(new ApiResponse(200, files, "Files fetched successfully"));
});

// Delete File
const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) throw new ApiError(404, "File not found");

  await File.findByIdAndDelete(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "File deleted successfully"));
});

export {
  uploadFile,
  getFilesByPage,
  getFilesByCategory,
  deleteFile
};