import { useEffect, useRef, useState } from "react";
import ScrollTop from "../common/ScrollTop";
import HeaderNine from "../../layouts/headers/HeaderNine";
import FooterTwo from "../../layouts/footers/FooterTwo";
import DisplayGameNew from "./DisplayGameNew";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  fetchGamesPageCategories,
  playGameApi,
  randomGames,
} from "../../apiServices/igplApi";
import SpinnersArea from "../spinners/SpinnersArea";
import GameViewerNew from "./GameViewerNew";

const gradientClasses1 = ["gradient-4", "gradient-5"];
const gradientClasses2 = ["gradient-1", "gradient-2"];

const getGradientClass = (id: string) => {
  const index = Number(id) % gradientClasses1.length;
  return gradientClasses1[index];
};

const getGradientClassFun = (id: string) => {
  const index = Number(id) % gradientClasses2.length;
  return gradientClasses2[index];
};

export interface GameReport {
  report_id: string;
  report_user_id: string;
  report_game_id: string;
  report_tournament_id: string;
  report_practice_counts: string;
  report_tournament_counts: string;
  report_tournament_practice_counts: string;
  report_target_count: string;
  report_date: string;
  added_on: string;
  updated_on: string;

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
  game_image_url: string;
}

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

interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
  category_icon: string;
  category_status: string;
  games?: Game[];
}

interface ApiResponse {
  status: boolean;
  categoriesList: Category[];
}

const Games = () => {
  const textColor =
    localStorage.getItem("theme") === "dark" ? "text-white" : "text-muted";
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [icon, setIcon] = useState<string>("bi bi-controller");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [randomGamesData, setRandomGamesData] = useState<any | null>(null);
  const [playURL, setPlayURL] = useState<any>("");
  const [gamePlayData, setGamePlayData] = useState<any | null>(null);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);

  // Map category name → icon
  const iconMap: Record<string, string> = {
    Action: "bi bi-lightning-charge",
    Adventure: "bi bi-map",
    Arcade: "bi bi-controller",
    "Puzzle & Logic": "bi bi-puzzle",
    "Sports & Racing": "bi bi-flag",
  };

  // Fetch categories
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchGamesPageCategories();
        if (response?.status && response?.categoriesList?.length > 0) {
          setCategories(response.categoriesList);
          setActiveTab(response.categoriesList[0].category_name ?? "");
        }
        // else {
        //   setCategories([]);
        //   setActiveTab("");
        // }
      } catch (error) {
        console.error("Error fetching games:", error);
        setCategories([]);
        setActiveTab("");
      } finally {
        setLoading(false);
      }
    };
    fetchRandomGames();
    fetchGames();
  }, []);

  // Update icon
  useEffect(() => {
    const activeCategory = categories.find(
      (cat) => cat.category_name === activeTab
    );
    setIcon(
      activeCategory
        ? iconMap[activeCategory.category_name] || "bi bi-controller"
        : "bi bi-controller"
    );
  }, [activeTab, categories]);

  // Tab click → scroll
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const section = sectionRefs.current[tab];
    if (section) {
      const headerOffset = 100;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      Object.entries(sectionRefs.current).forEach(([tab, ref]) => {
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveTab(tab);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch reward coins
  const fetchRandomGames = async () => {
    try {
      const response = await randomGames();
      if (response?.status) {
        setRandomGamesData(response?.data);
      } else {
        console.error("Failed to fetch fetchRandomGames");
      }
    } catch (error) {
      console.error("Error fetching fetchRandomGames:", error);
    }
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

  const handleGameClick = async (game: GameReport) => {
    setSelectedGame(game);
    playGameApiCall(game);
  };

  return (
    <>
      {loading && <SpinnersArea />}
      {!loading && categories.length > 0 && (
        <>
          <ScrollTop />
          <HeaderNine title="Games" />
          <div className="page-content-wrapper py-2 direction-rtl">
            <div className="container rounded-4 gradient-5 mb-2 pb-2">
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
                  style={{
                    color: "#0b2f5f",
                    fontSize: "1.1rem",
                  }}
                >
                  <i className={`${icon} mx-2`}></i>
                  Player Games
                </strong>
              </div>
              <Swiper
                loop={true}
                // centeredSlides={true}
                slidesPerView={2.2}
                spaceBetween={10}
                autoplay={{
                  delay: 2500, // time between slides (in ms)
                  disableOnInteraction: false, // continue autoplay after user interaction
                }}
                breakpoints={{
                  650: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                }}
                pagination={{
                  el: ".tns-nav",
                  clickable: true,
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="tiny-slider-one"
              >
                {randomGamesData?.usergamesList?.map(
                  (game: GameReport, index: any) => {
                    const gradientClass = getGradientClassFun(index);
                    return (
                      <SwiperSlide
                        key={game.report_game_id}
                        className={`${gradientClass} rounded-4 border`}
                        onClick={() => handleGameClick(game)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className={` rounded-4 `}>
                          {/* Image */}
                          <div
                            className="rounded overflow-hidden"
                            style={{ position: "relative" }}
                          >
                            <img
                              src={game?.game_image_url}
                              alt=""
                              className="w-100 d-block border rounded-4"
                              style={{ objectFit: "cover" }}
                            />
                            {/* Play Icon Overlay */}
                            <i
                              className="bi bi-play-circle-fill"
                              style={{
                                position: "absolute",
                                top: "8%",
                                left: "90%",
                                transform: "translate(-50%, -50%)",
                                fontSize: "2rem",
                                color: "white",
                                textShadow: "0px 0px 6px rgba(0,0,0,0.7)",
                                pointerEvents: "none",
                              }}
                            ></i>
                          </div>

                          {/* Button */}
                          <div style={{ padding: "3px" }}>
                            <div
                              className="game-title mt-0"
                              style={{ color: "#0b2f5f" }}
                            >
                              {game.game_name}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  }
                )}
              </Swiper>
            </div>

            <div className="rounded px-1">
              {categories.map((category, index: any) => {
                const gradientClass = getGradientClass(index);
                return (
                  <div
                    key={category.category_id}
                    ref={(el) =>
                      (sectionRefs.current[category.category_name] = el)
                    }
                    id={`${category.category_slug}-section`}
                  >
                    <DisplayGameNew
                      title={category.category_name}
                      data={category.games ?? []} // ✅ safe fallback
                      category_id={parseInt(category.category_id, 10)}
                      icon={
                        iconMap[category.category_name] || "bi bi-controller"
                      }
                      bgColor={`${gradientClass}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {/* Game Viewer */}
          {selectedGame && (
            <GameViewerNew
              fromGame={true}
              url={playURL}
              name={selectedGame?.game_name}
              orientation={
                selectedGame?.game_screen === "1" ? "Portrait" : "Landscape"
              }
              onClose={() => setSelectedGame(null)}
            />
          )}
          <FooterTwo />
        </>
      )}
    </>
  );
};

export default Games;
