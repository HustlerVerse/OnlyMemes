import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Meme } from "@/models/Meme";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({ dest: "public/uploads/" });

export async function GET(req: Request) {
  await connectToDB();
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId");
  const filter = ownerId ? { ownerId } : {};
  const memes = await Meme.find(filter).sort({ createdAt: -1 }).limit(10);
  return NextResponse.json(memes);
}

export async function POST(req: Request) {
  await connectToDB();
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const tags = formData.get("tags") as string;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = await file.arrayBuffer();
  const filename = Date.now() + path.extname(file.name || ".jpg");
  const filepath = `/uploads/${filename}`;
  fs.writeFileSync(`public${filepath}`, Buffer.from(buffer));

  const meme = new Meme({
    title,
    description,
    imageUrl: filepath,
    category,
    tags: tags.split(","),
    ownerId: "user-id-from-session", // Get from auth, assume middleware or header
  });
  await meme.save();
  return NextResponse.json(meme);
}

// For other methods like DELETE, add similarly
