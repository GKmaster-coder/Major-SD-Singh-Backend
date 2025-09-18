import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String, 
      default: null,
    },
    page: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "general",
    },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
