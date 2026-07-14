import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { playGameApi, viewAllGames } from "../../apiServices/igplApi";
import GameViewerNew from "./GameViewerNew";
import WaitLoader from "@/components/Loader";
import { TopBar } from "@/components/TopBar";
import { BottomNavBar } from "@/components/BottomNavBar";
import { useLanguage } from "@/components/context/LanguageContext";
import { ChevronLeft } from "lucide-react";

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

const ViewAllGames = () => {
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

  const gradientClasses = ["gradient-1", "gradient-2"];

  // Pick gradient (deterministic by game_id so it stays the same)
  const getGradientClass = (id: string) => {
    const index = Number(id) % gradientClasses.length;
    return gradientClasses[index];
  };

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

      <div className="pt-2 px-3 pb-24 max-w-md mx-auto min-h-screen bg-background text-foreground">
        
        {/* Back Button & Category Header */}
        <div className="flex items-center gap-3 mb-5 mt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-wide uppercase">
              <span className="text-gradient-gold">{title}</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              {gamesByCategory.length} {gamesByCategory.length === 1 ? "Game" : "Games"} Available
            </p>
          </div>
        </div>

        {/* 3-Column Games Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {gamesByCategory.length > 0 ? (
            gamesByCategory.map((game, index: number) => {
              const gradientClass = getGradientClass(game.game_id);

              return (
                <div
                  key={game.game_id}
                  className={`game-card ${gradientClass} group relative overflow-hidden rounded-xl border border-border bg-card/60 p-1 cursor-pointer shadow-sm hover:border-primary/50 transition-all duration-300`}
                  onClick={() => handleGameClick(game)}
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden relative mb-1">
                    <img
                      src={game?.game_image_url || "/placeholder.png"}
                      alt={game.game_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-0.5 py-0.5 text-center">
                    <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                      {t?.playNow || "Play Now"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground/60 text-xs font-medium bg-card/45 border border-border rounded-3xl">
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

export default ViewAllGames;
