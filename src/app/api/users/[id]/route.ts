import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  await connectToDB();
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }
  const user = await User.findById(id).select("-password");
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
  });
}
