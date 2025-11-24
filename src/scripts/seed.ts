import { connectToDB } from "../lib/db";
import { Meme } from "../models/Meme";
import { Template } from "../models/Template";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

async function seed() {
  await connectToDB();

  // Create a fake user
  const hashed = await bcrypt.hash("password", 10);
  const user = await User.findOneAndUpdate(
    { email: "test@example.com" },
    {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: hashed,
    },
    { upsert: true, new: true }
  );

  // 10 fake memes (using unsplash placeholders for meme-like images)
  const fakeMemes = [
    {
      title: "Funny Cat",
      category: "Funny",
      imageUrl: "https://source.unsplash.com/random/400x300/?cat,meme",
    },
    {
      title: "Relatable Work",
      category: "Relatable",
      imageUrl: "https://source.unsplash.com/random/400x300/?work,meme",
    },
    {
      title: "Anime Moment",
      category: "Anime",
      imageUrl: "https://source.unsplash.com/random/400x300/?anime,meme",
    },
    {
      title: "Dark Joke",
      category: "Dark Humor",
      imageUrl: "https://source.unsplash.com/random/400x300/?dark,meme",
    },
    {
      title: "Wholesome Dog",
      category: "Wholesome",
      imageUrl: "https://source.unsplash.com/random/400x300/?dog,meme",
    },
    {
      title: "Tech Fail",
      category: "Tech",
      imageUrl: "https://source.unsplash.com/random/400x300/?tech,meme",
    },
    {
      title: "Funny Fail",
      category: "Funny",
      imageUrl: "https://source.unsplash.com/random/400x300/?fail,meme",
    },
    {
      title: "Relatable Life",
      category: "Relatable",
      imageUrl: "https://source.unsplash.com/random/400x300/?life,meme",
    },
    {
      title: "Anime Funny",
      category: "Anime",
      imageUrl: "https://source.unsplash.com/random/400x300/?anime,funny",
    },
    {
      title: "Tech Joke",
      category: "Tech",
      imageUrl: "https://source.unsplash.com/random/400x300/?tech,joke",
    },
  ];

  for (const fm of fakeMemes) {
    await new Meme({ ...fm, ownerId: user._id, tags: [fm.category] }).save();
  }

  // 5 fake templates
  const fakeTemplates = [
    {
      name: "Distracted Boyfriend",
      category: "Funny",
      imageUrl: "https://source.unsplash.com/random/400x300/?template1",
    },
    {
      name: "This Is Fine",
      category: "Relatable",
      imageUrl: "https://source.unsplash.com/random/400x300/?template2",
    },
    {
      name: "Expanding Brain",
      category: "Tech",
      imageUrl: "https://source.unsplash.com/random/400x300/?template3",
    },
    {
      name: "Drake Hotline",
      category: "Funny",
      imageUrl: "https://source.unsplash.com/random/400x300/?template4",
    },
    {
      name: "Success Kid",
      category: "Wholesome",
      imageUrl: "https://source.unsplash.com/random/400x300/?template5",
    },
  ];

  for (const ft of fakeTemplates) {
    await new Template(ft).save();
  }

  console.log("Seeded 10 memes and 5 templates");
  process.exit(0);
}

seed();
