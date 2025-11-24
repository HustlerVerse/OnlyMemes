import { UIMeme } from "@/types/meme";
import { TemplateCardData } from "@/types/template";

const baseUrl = "https://images.unsplash.com";

const baseReactions = {
  likes: 4,
  laughs: 7,
  wows: 2,
  sads: 0,
  dislikes: 1,
};

export const placeholderMemes: UIMeme[] = [
  {
    _id: "placeholder-1",
    title: "Hustlerverse",
    category: "Dark Humor",
    ownerName: "n",
    mediaType: "image",
    imageUrl: `${baseUrl}/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=900&q=80`,
    reactions: { ...baseReactions, likes: 9 },
    tags: ["#hustle", "#code"],
  },
  {
    _id: "placeholder-2",
    title: "Browser Tabs",
    category: "Relatable",
    ownerName: "lol",
    mediaType: "image",
    imageUrl: `${baseUrl}/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80`,
    reactions: { ...baseReactions, laughs: 10 },
    tags: ["#developer", "#tabs"],
  },
  {
    _id: "placeholder-3",
    title: "Anime Night",
    category: "Anime",
    ownerName: "otaku",
    mediaType: "image",
    imageUrl: `${baseUrl}/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80`,
    reactions: { ...baseReactions, likes: 12 },
    tags: ["#anime", "#meme"],
  },
  {
    _id: "placeholder-4",
    title: "Crypto Dip",
    category: "Funny",
    ownerName: "ape",
    mediaType: "video",
    imageUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    reactions: { ...baseReactions, wows: 5 },
    tags: ["#crypto", "#hold"],
  },
  {
    _id: "placeholder-5",
    title: "Dark Mode Forever",
    category: "Tech",
    ownerName: "dev",
    mediaType: "image",
    imageUrl: `${baseUrl}/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=900&q=80`,
    reactions: { ...baseReactions, likes: 6 },
    tags: ["#darkmode"],
  },
  {
    _id: "placeholder-6",
    title: "Two Buttons",
    category: "Funny",
    ownerName: "memelord",
    mediaType: "image",
    imageUrl: `${baseUrl}/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=900&q=80`,
    reactions: { ...baseReactions, laughs: 12 },
    tags: ["#twobuttons"],
  },
  {
    _id: "placeholder-7",
    title: "Distracted Dev",
    category: "Relatable",
    ownerName: "focus",
    mediaType: "image",
    imageUrl: `${baseUrl}/photo-1461344577544-4e5dc9487184?auto=format&fit=crop&w=900&q=80`,
    reactions: { ...baseReactions, likes: 3 },
    tags: ["#productivity"],
  },
  {
    _id: "placeholder-8",
    title: "Weekend Deploy",
    category: "Wholesome",
    ownerName: "ops",
    mediaType: "image",
    imageUrl: `${baseUrl}/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=900&q=80`,
    reactions: { ...baseReactions, likes: 8 },
    tags: ["#devops"],
  },
];

export const placeholderTemplates: TemplateCardData[] = [
  {
    _id: "template-1",
    name: "Drake Hotline Bling",
    category: "Funny",
    imageUrl: `${baseUrl}/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80`,
    tags: ["Classic"],
  },
  {
    _id: "template-2",
    name: "Distracted Boyfriend",
    category: "Relatable",
    imageUrl: `${baseUrl}/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80`,
  },
  {
    _id: "template-3",
    name: "Two Buttons",
    category: "Funny",
    imageUrl: `${baseUrl}/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80`,
  },
  {
    _id: "template-4",
    name: "Change My Mind",
    category: "Relatable",
    imageUrl: `${baseUrl}/photo-1502764613149-7f1d229e230f?auto=format&fit=crop&w=900&q=80`,
  },
  {
    _id: "template-5",
    name: "Surprised Pikachu",
    category: "Anime",
    imageUrl: `${baseUrl}/photo-1517705008122-361805f42e86?auto=format&fit=crop&w=900&q=80`,
  },
  {
    _id: "template-6",
    name: "UNO Draw 25",
    category: "Funny",
    imageUrl: `${baseUrl}/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80`,
  },
  {
    _id: "template-7",
    name: "Galaxy Brain",
    category: "Tech",
    imageUrl: `${baseUrl}/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=900&q=80`,
  },
  {
    _id: "template-8",
    name: "Is This A Pigeon",
    category: "Anime",
    imageUrl: `${baseUrl}/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80`,
  },
];

