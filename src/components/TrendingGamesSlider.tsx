"use client";

import React from "react";
import {
  Gamepad2,
  Zap,
  Compass,
  Puzzle,
  Trophy,
} from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchGamesData } from "@/features/games/gamesSlice";
import { useEffect, useMemo } from "react";

const GAME_CATEGORIES = [
  { id: 1, name: "Action", icon: Zap, color: "from-red-500 to-orange-500", matchKeywords: ["action"] },
  { id: 2, name: "Adventure", icon: Compass, color: "from-green-500 to-emerald-500", matchKeywords: ["adventure"] },
  { id: 3, name: "Arcade", icon: Gamepad2, color: "from-purple-500 to-fuchsia-500", matchKeywords: ["arcade"] },
  { id: 4, name: "Puzzle and Logic", icon: Puzzle, color: "from-blue-500 to-cyan-500", matchKeywords: ["puzzle", "logic", "strategy"] },
  { id: 5, name: "Sports and Racing", icon: Trophy, color: "from-pink-500 to-rose-500", matchKeywords: ["sports", "racing"] },
];

export default function TrendingGamesSlider() {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { data: gamesData, status } = useAppSelector((state) => state.games);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGamesData());
    }
  }, [dispatch, status]);

  const availableCategories = useMemo(() => {
    const freeGames = gamesData?.data?.freeGames || [];
    if (freeGames.length === 0) return [];

    // Extract all unique categories/genres from the games list
    const categorySet = new Set<string>();
    freeGames.forEach((game: any) => {
      // Check multiple potential field names
      const cat = game.category_name || game.game_category || game.category || game.genre || game.game_genre;
      if (cat) categorySet.add(cat.toLowerCase().trim());
    });

    // Filter our hardcoded GAME_CATEGORIES
    return GAME_CATEGORIES.filter((cat) => {
      // Check if any of the available categories from the API match our keywords
      return Array.from(categorySet).some(availableCat =>
        cat.matchKeywords.some(keyword =>
          availableCat.includes(keyword) || keyword.includes(availableCat)
        )
      );
    });
  }, [gamesData]);

  // If we have no categories yet and it's loading, we could show a loader, 
  // but for a slider it's better to show nothing or placeholders.
  if (availableCategories.length === 0 && status !== "loading") return null;

  return (
    <div className="bg-gray-50">
      <div className="px-2">
        {/* 🔹 HEADER + SLIDER (SAME GRADIENT CONTAINER) */}
        <div className="rounded-xl relative bg-gradient-to-r from-[#0a0f7ac4] to-pink-700 pt-4 pb-2 px-3 overflow-hidden">
          {/* Header */}
          <div className="relative z-10 mb-2">
            <div className="flex items-center justify-center gap-2">
              <div className=" backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white ">
                {t.trendingGames}
              </h1>

            </div>
            <p className="mt-1 text-center text-white/90 text-sm font-semibold ">{t.popularGamesDescription}</p>
          </div>

          {/* 🔹 SLIDER INSIDE GRADIENT */}
          <div className="relative overflow-hidden py-2">
            <div className="flex gap-4 w-max px-2 animate-slide-right hover:[animation-play-state:paused] will-change-transform">
              {[...availableCategories, ...availableCategories, ...availableCategories].map((category, index) => (
                <CategoryCard
                  key={`${category.id}-${index}`}
                  category={category}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CategoryCard = React.memo(({
  category,
}: {
  category: typeof GAME_CATEGORIES[0];
}) => {
  const Icon = category.icon;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games`);
  };

  return (
    <button
      className="
        relative flex-shrink-0 w-16 h-16 rounded-2xl
        bg-white shadow-lg border border-black/5
        active:scale-95 transition-transform
      "
      onClick={handleClick}
    >
      {/* Decorative faded icon */}
      <Icon className="absolute -right-2 -bottom-2 w-16 h-16 text-black/5 rotate-12" />

      <div className="relative z-10 flex items-center justify-center h-full">
        {/* Icon with CATEGORY COLOR */}
        <div
          className={`
            w-12 h-12 rounded-xl
            flex items-center justify-center
            bg-gradient-to-br ${category.color}
          `}
        >
          <Icon
            className="w-7 h-7 text-white"
            strokeWidth={2.5}
          />
        </div>
      </div>
    </button>
  );
});
