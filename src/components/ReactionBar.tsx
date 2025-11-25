import { useState } from "react";
import { ThumbsUp, Laugh, Zap, Frown, ThumbsDown } from "lucide-react";

interface Props {
  memeId: string;
  reactions: {
    likes: number;
    laughs: number;
    wows: number;
    sads: number;
    dislikes: number;
  };
}

export function ReactionBar({ memeId, reactions }: Props) {
  const [localReactions, setLocalReactions] = useState(reactions);

  const handleReact = async (type: keyof typeof reactions) => {
    try {
      const res = await fetch(`/api/memes/${memeId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType: type }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reactions) {
          setLocalReactions(data.reactions);
        } else {
          setLocalReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
        }
      }
    } catch (error) {
      console.error("Failed to react", error);
    }
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={() => handleReact("likes")}
        className="flex items-center"
      >
        <ThumbsUp className="w-5 h-5" /> {localReactions.likes}
      </button>
      <button
        onClick={() => handleReact("laughs")}
        className="flex items-center"
      >
        <Laugh className="w-5 h-5" /> {localReactions.laughs}
      </button>
      <button onClick={() => handleReact("wows")} className="flex items-center">
        <Zap className="w-5 h-5" /> {localReactions.wows}
      </button>
      <button onClick={() => handleReact("sads")} className="flex items-center">
        <Frown className="w-5 h-5" /> {localReactions.sads}
      </button>
      <button
        onClick={() => handleReact("dislikes")}
        className="flex items-center"
      >
        <ThumbsDown className="w-5 h-5" /> {localReactions.dislikes}
      </button>
    </div>
  );
}
