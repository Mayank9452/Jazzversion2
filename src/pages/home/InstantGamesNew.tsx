import React, { useEffect, useState } from 'react';
import SectionLabel from './SectionLabel';
import GameViewerNew from '../games/GameViewerNew';
import { playGameApi } from '../../apiServices/igplApi';

// Define interfaces for type safety
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
  quick_tournament: string | null;
  isSuggested: string;
  isTop: string;
  isPublished: string;
  isTarget: string | null;
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

interface Category {
  category_name: string;
  games: Game[];
}

interface CategoryGames {
  [key: string]: Category;
}

interface InstantGamesProps {
  userInfo: any; // Define a more specific type if needed
  instantGames: CategoryGames;
}

const InstantGamesNew: React.FC<InstantGamesProps> = ({ userInfo, instantGames }) => {


  // Define the category keys to display (1 to 5)
  const categories = ['1', '2', '3', '4', '5'];

  const [playURL, setPlayURL] = useState<any>("");
  const [gamePlayData, setGamePlayData] = useState<any | null>(null);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);

  const playGameApiCall = async (game: any) => {
    try {
      const response = await playGameApi(game.game_id);
      if (response?.status) {
        setGamePlayData(response?.data);
        setPlayURL(`https://games.igpl.pro/xml-api/play-game?partnercode=test-001&playerid=${response?.data?.playerProfileId}&gameid=${game.game_gameboost_id}`)
      }
    } catch (error) {
      console.log("Error playGameApiCall API", error);
      setPlayURL("");
    }
  }

  const handleGameClick = (game: any) => {
    setSelectedGame(game);
    playGameApiCall(game);
  };


  return (
    <>
      <div className="container px-1">
        <SectionLabel text="Instant Games" bgColor="white" />
        <div
          className="rounded"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(270px, 1fr))',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            gap: '0.5rem',
          }}
        >
          {instantGames && categories.map((cat, catIndex) => {
            const category = instantGames[cat];
            if (!category || !category.games || category.games.length === 0) {
              return (
                <div
                  key={cat}
                  className="p-2"
                  style={{
                    minWidth: '200px',
                    scrollSnapAlign: 'start',
                    height: 'fit-content',
                  }}
                >
                  <h6 className="text-center mb-3 fw-bold">
                    {category?.category_name || `Category ${cat}`}
                  </h6>
                  <p className="text-center text-muted small">No games available</p>
                </div>
              );
            }
            return (
              <div
                key={cat}
                className="p-2"
                style={{
                  minWidth: '250px',
                  scrollSnapAlign: 'start',
                  height: 'fit-content',
                }}
              >

                {category?.games.map((game: Game, index: number) => (
                  <div
                    key={game?.game_id}
                    className="d-flex align-items-center mb-2 p-2 animated-gradient-border"
                    onClick={() => handleGameClick(game)}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}

                  >
                    <img
                      src={game?.game_image_url}
                      alt={game?.game_name}
                      className="rounded"
                      style={{ width: '60px', height: '45px', objectFit: 'cover', border: '1px solid black' }}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/webp/125X90/default.webp'; // Fallback image
                      }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <div className="fw-bold fs-12 text-muted">{game?.game_name}</div>
                      <div className="fw-semibold text-muted small fs-10">{category?.category_name}</div>
                    </div>
                    <button
                      className="btn btn-outline-dark btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px', fontSize: '12px', background: '#35b6a8' }}
                    >
                      ▶
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {selectedGame && (
        <GameViewerNew
          fromGame={true}
          url={playURL}
          name={selectedGame?.game_name}
          orientation={gamePlayData?.game_screen === "1" ? "Portrait" : "Landscape"}
          onClose={() => setSelectedGame(null)}
        />
      )}

    </>
  );
};

export default InstantGamesNew;