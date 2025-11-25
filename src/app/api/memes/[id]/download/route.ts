import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import { Meme } from "@/models/Meme";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_: Request, context: RouteContext) {
  await connectToDB();
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid meme id" }, { status: 400 });
  }
  await Meme.findByIdAndUpdate(id, { $inc: { downloads: 1 } });
  return NextResponse.json({ success: true });
}

