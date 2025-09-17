import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadFile,
  getFilesByPage,
  getFilesByCategory,
  deleteFile,
} from "../controllers/file.controller.js";

const router = express.Router();

// Upload route (single or multiple)
router.post("/upload", upload.any(), uploadFile);

// Get by page
router.get("/page/:page", getFilesByPage);

// Get by category
router.get("/category/:category", getFilesByCategory);

// Delete by id
router.delete("/:id", deleteFile);

export default router;
