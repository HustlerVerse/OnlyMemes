import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectToDB();
  const { name, username, email, password } = await req.json();
  if (!name || !username || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing)
    return NextResponse.json({ error: "User exists" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, username, email, password: hashed });
  await user.save();
  return NextResponse.json(user);
}
