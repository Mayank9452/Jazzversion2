import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "./ui/button";
import { OTHER_API_URL } from "@/config/config";
import { useLanguage } from "./context/LanguageContext";

interface GameCardProps {
  game: any;
  index: number;
  bgClass: string;
  onPlay: (url: string) => void;
}

const GameCard = React.memo(({ game, index, bgClass, onPlay }: GameCardProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      viewport={{ once: true, amount: 0.15 }}
      className={`rounded-2xl shadow-lg ${bgClass} overflow-hidden text-white`}
      onClick={() => onPlay(`/games/${btoa(String(game.game_id))}`)}
    >
      <div className="relative w-full aspect-[4/3]">
        <img
          src={`${OTHER_API_URL}uploads/games/${game.game_image}`}
          alt={game.Name}
          className="object-cover h-full w-full"
          loading="lazy"
          decoding="async"
        />
        {game.isSuggested === "1" && (
          <span className="absolute top-2 left-2 bg-pink-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
            Suggested
          </span>
        )}
      </div>

      <div className="p-2">
        <Button
          size="xs"
          className="bg-white/20 mt-1 hover:bg-white/30 border w-full text-xs h-7 border-white/30 text-white backdrop-blur-sm transition-smooth font-semibold tracking-[0.3px]"
        >
          <Play className="w-3 h-3 mr-1" /> {t.playNow}
        </Button>
      </div>
    </motion.div>
  );
});

export default GameCard;
