import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { playGameApi, viewAllGames } from "@/apiServices/igplApi";
import GameViewerNew from "./GameViewerNew";
import WaitLoader from "@/components/Loader";
import { TopBar } from "@/components/TopBar";
import { BottomNavBar } from "@/components/BottomNavBar";
import { useLanguage } from "@/components/context/LanguageContext";
import { ChevronLeft, Play } from "lucide-react";

interface Game {
  game_id: string;
  game_name: string;
  game_orientation?: string;
  game_url?: string;
  game_image_url?: string;
  game_gameboost_id?: string;
}

interface ApiResponse {
  status: boolean;
  data?: {
    gamesList?: Game[];
  };
  message?: string;
}

interface ViewAllGamesProps {
  title?: string;
  categoryId?: number;
}

const ViewAllGamesNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { title = "Games", categoryId } =
    (location?.state as ViewAllGamesProps) || {};

  const [gamesByCategory, setGamesByCategory] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [playURL, setPlayURL] = useState<string>("");
  const [gamePlayData, setGamePlayData] = useState<any | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Deterministic selector not needed, using premium card layouts

  // Play game API call
  const playGameApiCall = async (game: Game) => {
    try {
      const response = await playGameApi(game.game_id);
      if (response?.status && game.game_gameboost_id) {
        setGamePlayData(response?.data || null);
        setPlayURL(
          `https://games.igpl.pro/xml-api/play-game?partnercode=test-001&playerid=${response?.data?.playerProfileId}&gameid=${game.game_gameboost_id}`
        );
      }
    } catch (error) {
      console.error("Error in playGameApiCall:", error);
      setPlayURL("");
    }
  };

  const handleGameClick = async (game: Game) => {
    setSelectedGame(game);
    await playGameApiCall(game);
  };

  const fetchGamesForCategory = async () => {
    try {
      const safeCategoryKey = title?.split(" ")[0] ?? "";
      const response: ApiResponse = await viewAllGames(safeCategoryKey);

      if (response?.status && response?.data?.gamesList) {
        setGamesByCategory(response.data.gamesList);
      } else {
        setGamesByCategory([]);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      setGamesByCategory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchGamesForCategory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [title, categoryId]);

  return (
    <>
      <TopBar />

      <div className="pt-2 px-3 pb-10 max-w-md mx-auto min-h-screen bg-[#f8fafc] dark:bg-[#07192e] text-slate-800 dark:text-white">

        {/* Back Button & Category Header */}
        <div className="flex items-center gap-3 mb-5 mt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#0b2f5f] dark:bg-[#0d2540] dark:border-[#1e4a7a] dark:text-[#80c7c5] active:scale-95 hover:scale-105 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-wide uppercase text-[#0b2f5f] dark:text-white">
              <span className="text-[#076866] dark:text-[#80c7c5]">{title}</span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-muted-foreground font-semibold uppercase tracking-wider">
              {gamesByCategory.length} {gamesByCategory.length === 1 ? "Game" : "Games"} Available
            </p>
          </div>
        </div>

        {/* 3-Column Games Grid */}
        <div className="grid grid-cols-3 gap-2">
          {gamesByCategory.length > 0 ? (
            gamesByCategory.map((game, index: number) => {
              const isGold = index % 2 === 0;
              return (
                <div
                  key={game.game_id}
                  className={`group relative overflow-hidden rounded-[14px] bg-white dark:bg-[#0d2540] border-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 ${isGold
                    ? "border-[#fecb13]/80 dark:border-[#fecb13]/20"
                    : "border-[#80c7c5]/80 dark:border-[#80c7c5]/20"
                    }`}
                  onClick={() => handleGameClick(game)}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={game?.game_image_url || "/placeholder.png"}
                      alt={game.game_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Play icon bottom right */}
                    <div className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full bg-[#fecb13] flex items-center justify-center shadow-md z-10">
                      <Play className="w-2.5 h-2.5 text-[#07192e] fill-current ml-0.5" />
                    </div>
                    {/* Bottom gradient overlay for readability */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-transparent dark:from-[#0d2540] to-transparent pointer-events-none" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12 text-slate-400 dark:text-muted-foreground/60 text-xs font-medium bg-white dark:bg-[#0d2540]/45 border border-slate-200 dark:border-border rounded-3xl shadow-sm dark:shadow-none">
              No games available in this category.
            </div>
          )}
        </div>

      </div>

      <BottomNavBar />

      {selectedGame && (
        <GameViewerNew
          fromGame={true}
          url={playURL || ""}
          name={selectedGame?.game_name || "Untitled"}
          orientation={
            gamePlayData?.gameInfo?.game_screen === "1"
              ? "Portrait"
              : "Landscape"
          }
          onClose={() => {
            setSelectedGame(null);
            setPlayURL("");
            setGamePlayData(null);
          }}
        />
      )}

      {loading && <WaitLoader isOverlay />}
    </>
  );
};

export default ViewAllGamesNew;
