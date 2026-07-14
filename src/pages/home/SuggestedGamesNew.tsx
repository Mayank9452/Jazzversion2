import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionLabel from "./SectionLabel";
import { useState, useEffect } from "react";
import { fetchSuggestedGames, playGameApi } from "../../apiServices/igplApi";
import GameViewerNew from "../games/GameViewerNew";
import { useTheme } from "next-themes";

export interface SuggestedGame {
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


const SuggestedGamesNew = () => {
    const [jazzSuggestedGamesData, setJazzSuggestedGamesData] = useState<SuggestedGame[]>([]);

    const [loading, setLoading] = useState(false);
    const [selectedGame, setSelectedGame] = useState<any | null>(null);
    const [playURL, setPlayURL] = useState<any>("");
    const [gamePlayData, setGamePlayData] = useState<any | null>(null);
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const fetchJazzSuggestedGames = async () => {
        setLoading(true);
        try {
            const response = await fetchSuggestedGames();
            if (response?.status === "success") {
                setJazzSuggestedGamesData(response.data.suggestedGames);
            } else {
                console.error("Failed to fetch Homepage:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching Homepage:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchJazzSuggestedGames();
    }, []);

    const handleGameClick = (game: any) => {
        setSelectedGame(game);
        playGameApiCall(game);
    };


    const playGameApiCall = async (game: any) => {
        try {
            const response = await playGameApi(game.game_id);
            if (response.status) {
                setGamePlayData(response?.data);
                setPlayURL(`https://games.igpl.pro/xml-api/play-game?partnercode=test-001&playerid=${response?.data?.playerProfileId}&gameid=${game.game_gameboost_id}`);
            }
        } catch (error) {
            console.log("Error playGameApiCall API", error);
            setPlayURL("");
        }
    }

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <>
            <div className="">

                <Swiper
                    loop={true}
                    centeredSlides={false}
                    slidesPerView={2.5}
                    spaceBetween={12}
                    breakpoints={{
                        650: {
                            slidesPerView: 2.5,
                            spaceBetween: 10,
                        },
                    }}
                    // autoplay={{
                    //     delay: 2500,
                    //     disableOnInteraction: false,
                    // }}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="tiny-slider-one"
                >
                    {jazzSuggestedGamesData.map((game) => {
                        const borderClass = isDark
                            ? "border-white/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                            : "border-slate-200/60 shadow-[0_6px_20px_rgba(6,182,212,0.06)]";
                        const cardBg = isDark
                            ? "bg-white/[0.03] backdrop-blur-md"
                            : "bg-white";

                        return (
                            <SwiperSlide
                                key={game.game_id}
                                className="overflow-hidden cursor-pointer group"
                                onClick={() => handleGameClick(game)}
                            >
                                <div
                                    className={`w-full flex flex-col overflow-hidden rounded-2xl border ${borderClass} ${cardBg} p-1.5 transition-all duration-200 active:scale-[0.98] shadow-md dark:shadow-none`}
                                >
                                    <div className="relative w-full aspect-[285/380] rounded-xl overflow-hidden border-[1.5px] border-border shadow-sm">
                                        <img
                                            src={game?.game_image_url}
                                            alt={game.game_name}
                                            className="w-full h-full block object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
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

export default SuggestedGamesNew;
