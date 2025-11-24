import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Meme } from "@/models/Meme";

export async function GET() {
  await connectToDB();
  const memes = await Meme.find()
    .sort({ "reactions.likes": -1, views: -1 })
    .limit(10);
  return NextResponse.json(memes);
}
