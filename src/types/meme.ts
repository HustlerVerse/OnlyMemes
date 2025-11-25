export type MemeReactions = {
  likes: number;
  laughs: number;
  wows: number;
  sads: number;
  dislikes: number;
};

export type UIMeme = {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  memeUrl?: string;
  videoUrl?: string;
  cloudinaryPublicId?: string;
  cloudinaryResourceType?: "image" | "video";
  mediaType?: "image" | "video";
  category: string;
  tags?: string[];
  ownerId?: string;
  ownerName?: string;
  reactions: MemeReactions;
  likedBy?: string[];
  isLiked?: boolean;
  downloads?: number;
  shares?: number;
  views?: number;
  createdAt?: string;
};

export const emptyReactions: MemeReactions = {
  likes: 0,
  laughs: 0,
  wows: 0,
  sads: 0,
  dislikes: 0,
};

