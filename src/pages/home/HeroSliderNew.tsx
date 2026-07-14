import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionLabel from "./SectionLabel";
import { useState } from "react";
import GameViewerNew from "../games/GameViewerNew";
import { playGameApi } from "../../apiServices/igplApi";


interface FreeGames {
    fg_id: string;
    fg_game_order: string;
	fg_game_id: string;
	fg_started_on: string;
	fg_ended_on: string;
	fg_is_active: string;
	added_on: string;
    updated_on: string;
	free_games_image_url: string;
	fg_game_name: string;
}


interface HeroSliderProps {
	freeGames: FreeGames[];
}

const lightPlayButtonColors = [
	"#00d5ff", // cyan
	"#66f0e0", // light mint
	"#66ccff", // soft blue
	"#80f0ff", // aqua sky
	"#99e6e6", // light teal
	"#a0ffe0", // sky green
	"#b3ecff", // pale blue
];


const HeroSlider: React.FC<HeroSliderProps> = ({ freeGames }) => {
	const [selectedGame, setSelectedGame] = useState<FreeGames | null>(null);
	const [playURL, setPlayURL] = useState<any>("");
	const [gamePlayData, setGamePlayData] = useState<any | null>(null);

	const handleGameClick = (game: FreeGames) => {
		setSelectedGame(game);
		playGameApiCall(game);
	};

	const playGameApiCall = async (game: any) => {
		try {
		  const response = await playGameApi(game.fg_game_id);
		  if (response.status) {
			setGamePlayData(response?.data);
			setPlayURL(`https://games.igpl.pro/xml-api/play-game?partnercode=test-001&playerid=${response?.data?.playerProfileId}&gameid=${response?.data?.gameId}`)
		  }
		  else {
			console.log("failed to playGameApiCall");
			setPlayURL("");
		  }
		} catch (error) {
		  console.log("Error playGameApiCall API", error);
		  setPlayURL("");
		}
	  }


	return (
		<>


			<div className="container direction-rtl tiny-slider-one-wrapper">

			
				<SectionLabel text="Popular Games" bgColor="white" />

				<Swiper
					loop={true}
					centeredSlides={true}
					slidesPerView={1.3}
					spaceBetween={10}
					autoplay={{
						delay: 2500, // time between slides (in ms)
						disableOnInteraction: false, // continue autoplay after user interaction
					}}
					pagination={{
						el: ".tns-nav",
						clickable: true,
					}}
					modules={[Pagination, Navigation, Autoplay]}
					className="tiny-slider-one"
				>
					{
						freeGames?.map((game, index) => {
							const color = lightPlayButtonColors[index % lightPlayButtonColors.length];
							return (
								<SwiperSlide
									key={game.fg_game_id}
									className="animated-gradient-border"
									onClick={() => handleGameClick(game)}
									style={{ cursor: "pointer" }}
								>
									<div className="bg-white rounded overflow-hidden">
										{/* Image */}
										<div className="rounded overflow-hidden">
											<img
												src={game?.free_games_image_url}
												alt=""
												className="w-100 d-block"
												style={{ objectFit: "cover" }}
											/>
										</div>

										{/* Button */}
										<div className="position-relative" style={{ marginTop: "-8px" }}>
											<button
												className="btn btn-outline fs-10 w-100"
												style={{
													background: color,
													color: "white",
													borderRadius: "0 0 6px 6px",
													padding: "6px 12px",
													border: "none",
												}}
											>
												Play Now
											</button>
										</div>
									</div>
								</SwiperSlide>
							);
						})
					}

					{
						freeGames?.map((game, index) => {
							const color = lightPlayButtonColors[index % lightPlayButtonColors.length];
							return (
								<SwiperSlide
									key={game.fg_game_id}
									className="animated-gradient-border"
									onClick={() => handleGameClick(game)}
									style={{ cursor: "pointer" }}
								>
									<div className="bg-white rounded overflow-hidden">
										{/* Image */}
										<div className="rounded overflow-hidden">
											<img
												src={game?.free_games_image_url}
												alt=""
												className="w-100 d-block"
												style={{ objectFit: "cover" }}
											/>
										</div>

										{/* Button */}
										<div className="position-relative" style={{ marginTop: "-8px" }}>
											<button
												className="btn btn-outline fs-10 w-100"
												style={{
													background: color,
													color: "white",
													borderRadius: "0 0 6px 6px",
													padding: "6px 12px",
													border: "none",
												}}
											>
												Play Now
											</button>
										</div>
									</div>
								</SwiperSlide>
							);
						})
					}


				</Swiper>
			</div>

			{selectedGame && (
                <GameViewerNew
                    fromGame={true}
                    url={playURL}
                    name={selectedGame?.fg_game_name}
                    orientation={gamePlayData?.game_screen === "1" ? "Portrait" : "Landscape"}
                    onClose={() => setSelectedGame(null)}
                />
            )}
		</>
	);
};

export default HeroSlider;
