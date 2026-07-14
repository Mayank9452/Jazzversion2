import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameViewerNew from "./GameViewerNew";
import { playGameApi } from "../../apiServices/igplApi";

interface Game {
  game_id: string;
  game_gameboost_id: string;
  game_name: string;
  game_category_id: string;
  game_category_type: string;
  game_level_from: string;
  game_level_to: string;
  game_image: string;
  game_play_link: string | null;
  game_promoted_to_home: string;
  game_high_score: string;
  game_width: string;
  game_height: string;
  game_screen: string;
  private_tournament: string;
  quick_tournament: string;
  isSuggested: string;
  isTop: string;
  isPublished: string;
  isTarget: string;
  isBattle: string;
  game_description: string;
  game_requirements: string;
  game_help: string;
  game_tip: string;
  added_on: string;
  updated_on: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  category_icon: string;
  category_status: string;
  game_image_url: string;
}

interface DisplayGameProps {
  title: string;
  data: Game[];
  category_id?: number;
  icon: string;
  bgColor?: string;
}

const DisplayGameNew: React.FC<DisplayGameProps> = ({
  title,
  data,
  category_id = 1,
  icon,
  bgColor
}) => {
  console.log(icon);
  const navigate = useNavigate();

  const [playURL, setPlayURL] = useState<any>("");
  const [gamePlayData, setGamePlayData] = useState<any | null>(null);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);

  const gradientClasses = ["gradient-1", "gradient-2"];

  // ✅ Assign gradient class by game_id
  const getGradientClass = (id: string) => {
    const index = Number(id) % gradientClasses.length;
    return gradientClasses[index];
  };

  const playGameApiCall = async (game: any) => {
    try {
      const response = await playGameApi(game.game_id);
      if (response.status) {
        setGamePlayData(response?.data);
        setPlayURL(
          `https://games.igpl.pro/xml-api/play-game?partnercode=test-001&playerid=${response?.data?.playerProfileId}&gameid=${response?.data?.gameInfo?.game_gameboost_id}`
        );
      } else {
        console.log("failed to playGameApiCall");
        setPlayURL("");
      }
    } catch (error) {
      console.log("Error playGameApiCall API", error);
      setPlayURL("");
    }
  };

  const handleViewAll = (title: string) => {
    navigate("/games/view-all-games", {
      state: {
        title: title,
        categoryId: category_id,
      },
    });
  };

  const handleGameClick = async (game: Game) => {
    setSelectedGame(game);
    playGameApiCall(game);
  };

  return (
    <div
      className={`container direction-rtl p-1 mb-1 gradient-5`}
      style={{ borderRadius: "20px" }}
    >
      {/* 🔥 Heading with shadow */}
      <div
        className="d-flex align-items-center justify-content-center mb-2"
        style={{
          
          padding: "0.2rem",
          background:
            "linear-gradient(to right, rgb(5, 76, 138), rgba(14, 14, 14, 0.12) 50%, rgb(5, 76, 138))",
          borderRadius: "30px 30px 0px 0px",
        }}
      >
        <strong
          className="mb-0 dark-mode-heading-color"
          style={{ color: "#0b2f5f", fontSize: "1.1rem", letterSpacing: "1px" }}
        >
          <i className={`${icon} mx-2`}></i>
          {title}
        </strong>
      </div>

      {/* Games Grid */}
      <div
        className={`d-flex flex-wrap gap-2 justify-content-around align-items-center rounded my-2 `}
      >
        {data.map((game, index: any) => {
          const gradientClass = getGradientClass(index);

          return (
            <div
              key={game.game_id}
              className={`game-card1 ${gradientClass}`} // No inline width here
              style={{padding: "1px"}}
              onClick={() => handleGameClick(game)}
            >
              <div style={{ position: "relative" }} >
                <img
                  src={game?.game_image_url || "/placeholder.png"}
                  alt={game.game_name}
                  style={{ width: "100%", borderRadius: "15px 0px 15px 15px" }}
                  className="border border-3"

                />
                {/* Play Icon Overlay */}
                <i
                  className="bi bi-play-circle-fill"
                  style={{
                    position: "absolute",
                    top: "13%",
                    left: "92%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "2rem",
                    color: "white",
                    textShadow: "0px 0px 6px rgba(0,0,0,0.7)",
                    pointerEvents: "none",
                  }}
                ></i>
              </div>
              <div style={{ padding: "3px" }}>
                <div className="game-title mt-0" style={{ color: "#0b2f5f" }}>
                  {game.game_name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex justify-content-center align-items-center mb-2">
        <button
          className="btn fw-semibold rounded-4"
          style={{
            background: "#80c7c5",
            color: "#0b2f5f",
            letterSpacing: "1px",
            width: "55%",
            margin: "auto",
          }}
          onClick={() => handleViewAll(title)}
        >
          View All
        </button>
      </div>

      {/* Game Viewer */}
      {selectedGame && (
        <GameViewerNew
          fromGame={true}
          url={playURL}
          name={selectedGame?.game_name}
          orientation={
            gamePlayData?.gameInfo?.game_screen === "1"
              ? "Portrait"
              : "Landscape"
          }
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
};

export default DisplayGameNew;
