import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import { Meme } from "@/models/Meme";
import { auth } from "@/app/api/auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    await connectToDB();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { reactionType } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid meme id" }, { status: 400 });
    }

    // Only support likes for now (toggle behavior)
    if (reactionType !== "likes") {
      return NextResponse.json({ error: "Only likes are supported" }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const meme = await Meme.findById(id);

    if (!meme) {
      return NextResponse.json({ error: "Meme not found" }, { status: 404 });
    }

    const likedBy = (meme.likedBy || []) as mongoose.Types.ObjectId[];
    const isLiked = likedBy.some(
      (likedUserId: mongoose.Types.ObjectId) => likedUserId.toString() === userId.toString()
    );

    let updateOperation;
    if (isLiked) {
      // Unlike: remove user from likedBy and decrement likes
      updateOperation = {
        $pull: { likedBy: userId },
        $inc: { "reactions.likes": -1 },
      };
    } else {
      // Like: add user to likedBy and increment likes
      updateOperation = {
        $addToSet: { likedBy: userId },
        $inc: { "reactions.likes": 1 },
      };
    }

    await Meme.findByIdAndUpdate(id, updateOperation);
    const updated = await Meme.findById(id);

    return NextResponse.json({
      success: true,
      reactions: updated?.reactions,
      isLiked: !isLiked,
    });
  } catch (error) {
    console.error("Failed to react to meme", error);
    return NextResponse.json({ error: "Failed to react" }, { status: 500 });
  }
}

