import mongoose from "mongoose";

const memeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  memeUrl: { type: String },
  videoUrl: { type: String },
  cloudinaryPublicId: { type: String },
  cloudinaryResourceType: { type: String, enum: ["image", "video"], default: "image" },
  mediaType: {
    type: String,
    enum: ["image", "video"],
    default: "image",
  },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reactions: {
    likes: { type: Number, default: 0 },
    laughs: { type: Number, default: 0 },
    wows: { type: Number, default: 0 },
    sads: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  downloads: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Meme = mongoose.models.Meme || mongoose.model("Meme", memeSchema);
