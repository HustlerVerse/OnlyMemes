import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Meme } from "@/models/Meme";
import mongoose from "mongoose";
import cloudinary, { isCloudinaryConfigured } from "@/lib/cloudinary";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

type StorageResult = {
  url: string;
  mediaType: "image" | "video";
  publicId?: string;
};

async function uploadToCloudinary(file: File): Promise<StorageResult> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUri = `data:${file.type || "image/jpeg"};base64,${base64}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "onlymemes/memes",
    resource_type: "auto",
  });
  return {
    url: result.secure_url,
    mediaType: result.resource_type === "video" ? "video" : "image",
    publicId: result.public_id,
  };
}

export async function GET(req: Request) {
  await connectToDB();
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId");
  const filter =
    ownerId && mongoose.Types.ObjectId.isValid(ownerId)
      ? { ownerId: new mongoose.Types.ObjectId(ownerId) }
      : {};
  const memes = await Meme.find(filter).sort({ createdAt: -1 });

  // Check if current user has liked each meme
  const session = await auth();
  const userId = session?.user?.id;

  const memesWithLikedStatus = memes.map((meme) => {
    const memeObj = meme.toObject();
    let isLiked = false;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const likedBy = (meme.likedBy || []) as mongoose.Types.ObjectId[];
      isLiked = likedBy.some(
        (likedUserId: mongoose.Types.ObjectId) => likedUserId.toString() === userId
      );
    }

    return {
      ...memeObj,
      isLiked,
    };
  });

  return NextResponse.json(memesWithLikedStatus);
}

export async function POST(req: Request) {
  try {
    await connectToDB();
    const session = await auth();
    const ownerId = session?.user?.id;

    if (!ownerId || !mongoose.Types.ObjectId.isValid(ownerId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isCloudinaryConfigured) {
      return NextResponse.json(
        {
          error:
            "Cloudinary environment variables are missing. Configure them to enable uploads.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const title = formData.get("title")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const category = formData.get("category")?.toString() ?? "General";
    const tags = formData.get("tags")?.toString() ?? "";

    const storageResult = await uploadToCloudinary(file);

    const parsedTags =
      tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) ?? [];

    const meme = await Meme.create({
      title,
      description,
      imageUrl: storageResult.url,
      memeUrl: storageResult.url,
      videoUrl: storageResult.mediaType === "video" ? storageResult.url : undefined,
      cloudinaryPublicId: storageResult.publicId,
      cloudinaryResourceType: storageResult.mediaType,
      category,
      tags: parsedTags,
      ownerId: new mongoose.Types.ObjectId(ownerId),
      mediaType: storageResult.mediaType,
      reactions: { likes: 0, laughs: 0, wows: 0, sads: 0, dislikes: 0 },
      downloads: 0,
      shares: 0,
      views: 0,
    });

    return NextResponse.json(meme, { status: 201 });
  } catch (error) {
    console.error("Failed to upload meme", error);
    return NextResponse.json(
      { error: "Failed to upload meme" },
      { status: 500 }
    );
  }
}
