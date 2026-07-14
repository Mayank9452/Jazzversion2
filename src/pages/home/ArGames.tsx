import React, { useEffect, useState } from 'react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SectionLabel from './SectionLabel';
import GameViewerNew from '../games/GameViewerNew';
import 'aos/dist/aos.css';
import AOS from 'aos';

// Define interfaces for type safety
interface Game {
  game_id: string;
  game_gameboost_id: string;
  game_name: string;
  game_category_id: string;
  game_category_type: string;
  game_image: string;
  game_play_link: string | null;
  game_description: string;
}

interface Category {
  category_name: string;
  games: Game[];
}

interface CategoryGames {
  [key: string]: Category;
}

interface ArGamesProps {
  userInfo: any; // Define a more specific type if needed
  ArGames: CategoryGames;
}

const ArGames: React.FC<ArGamesProps> = ({ userInfo, ArGames }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
  };

  // Get games from category "9" (AR Games)

  const arGamesCategory = ArGames && ArGames['9'];
  const games = arGamesCategory?.games || [];

  return (
    <>
      <div className="container direction-rtl tiny-slider-one-wrapper">
        <SectionLabel text="AR Games" bgColor="white" />
        <Swiper
          //   loop={true}
          centeredSlides={false}
          slidesPerView={3}
          spaceBetween={15}
          breakpoints={{
            650: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          //   autoplay={{
          //     delay: 2500,
          //     disableOnInteraction: false,
          //   }}
          modules={[Pagination, Navigation, Autoplay]}
          className="tiny-slider-one d-flex justify-content-center align-items-center"
        >
          {games?.length > 0 ? (
            games?.map((game, index) => (
              <SwiperSlide key={game.game_id} className="animated-gradient-border" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="content-wrapper d-flex flex-column align-items-center" onClick={() => handleGameClick(game)}>
                  <div className="w-100 rounded overflow-hidden" style={{ background: 'white', borderRadius: '6px' }}>
                    <div className="rounded overflow-hidden">
                      <img
                        src={game.game_name === "Flying Ship AR Game" ? `/assets/images/img/ar/3.png` :
                          game.game_name === "Car Race AR Game" ? `/assets/images/img/ar/2.png` : (game.game_name === "Temple Of Doom" ? `/assets/images/img/ar/1.png` : "")}
                        alt={game.game_name}
                        className="w-100 d-block"
                        style={{ objectFit: 'cover' }}
                      // onError={(e) => {
                      //   e.currentTarget.src = '/assets/webp/suggested-games/ar/default.webp'; // Fallback image
                      // }}
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="text-center text-muted p-3">No AR Games available</div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {selectedGame && (
        <GameViewerNew
          url={selectedGame.game_play_link || ''}
          name={selectedGame.game_name}
          orientation={selectedGame.game_category_type === 'Single Player' ? 'Portrait' : 'Landscape'} // Adjust based on actual data
          onClose={() => setSelectedGame(null)}
        />
      )}
    </>
  );
};

export default ArGames;