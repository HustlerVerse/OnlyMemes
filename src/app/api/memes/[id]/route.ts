import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import { Meme } from "@/models/Meme";
import { auth } from "@/app/api/auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  await connectToDB();
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid meme id" }, { status: 400 });
  }
  const meme = await Meme.findById(id);
  if (!meme) {
    return NextResponse.json({ error: "Meme not found" }, { status: 404 });
  }

  // Check if current user has liked this meme
  const session = await auth();
  const userId = session?.user?.id;
  let isLiked = false;

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const likedBy = (meme.likedBy || []) as mongoose.Types.ObjectId[];
    isLiked = likedBy.some(
      (likedUserId: mongoose.Types.ObjectId) => likedUserId.toString() === userId
    );
  }

  const memeObj = meme.toObject();
  return NextResponse.json({
    ...memeObj,
    isLiked,
  });
}

