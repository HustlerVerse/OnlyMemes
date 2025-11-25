import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import { Meme } from "@/models/Meme";
import { auth } from "@/app/api/auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ category: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  await connectToDB();
  const { category } = await context.params;
  const memes = await Meme.find({ category }).sort({ createdAt: -1 }).limit(20);

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

