import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Meme } from "@/models/Meme";

export async function GET() {
  await connectToDB();
  // Simple logic
  const trendingCategories = await Meme.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);
  const suggestions = trendingCategories.map(
    (cat) => `Try making memes in ${cat._id} category, it's trending!`
  );
  return NextResponse.json(suggestions);
}
