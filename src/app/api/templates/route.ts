import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Template } from "@/models/Template";

const DEFAULT_TEMPLATES = [
  {
    name: "Drake Pointing",
    imageUrl: "https://i.imgflip.com/30b1gx.jpg",
    category: "Funny",
  },
  {
    name: "Distracted Boyfriend",
    imageUrl: "https://i.imgflip.com/1ur9b0.jpg",
    category: "Relatable",
  },
  {
    name: "Woman Yelling at Cat",
    imageUrl: "https://i.imgflip.com/345v97.jpg",
    category: "Funny",
  },
  {
    name: "This is Fine",
    imageUrl: "https://i.imgflip.com/26am.jpg",
    category: "Relatable",
  },
  {
    name: "Change My Mind",
    imageUrl: "https://i.imgflip.com/24y43o.jpg",
    category: "Tech",
  },
  {
    name: "Expanding Brain",
    imageUrl: "https://i.imgflip.com/1jhl0s.jpg",
    category: "Funny",
  },
  {
    name: "Two Buttons",
    imageUrl: "https://i.imgflip.com/1g8my4.jpg",
    category: "Relatable",
  },
  {
    name: "Wojak",
    imageUrl: "https://i.imgflip.com/1bhk.jpg",
    category: "Anime",
  },
];

export async function GET() {
  await connectToDB();
  
  // Check if templates exist, if not, seed default templates
  const existingTemplates = await Template.find();
  
  if (existingTemplates.length === 0) {
    try {
      await Template.insertMany(DEFAULT_TEMPLATES);
      console.log("Default templates seeded successfully");
    } catch (error) {
      console.error("Failed to seed default templates:", error);
    }
  }
  
  const templates = await Template.find().sort({ createdAt: -1 });
  return NextResponse.json(templates);
}

