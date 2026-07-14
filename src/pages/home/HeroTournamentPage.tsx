import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchLiveTournament,
  playLiveTournament,
} from "../../apiServices/igplApi";
import GameViewerNew from "../games/GameViewerNew";
import SpinnersArea from "../spinners/SpinnersArea";

interface HeroGames {
  game_id: string;
  game_name: string;
  game_orientation: string;
  game_url: string;
  game_image_url: string;
}

const HeroTournamentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tournament_id } = location.state as { tournament_id: any };
  const [loading, setLoading] = useState<boolean>(false);
  const [liveTournamentData, setLiveTournamentData] = useState<any | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [playURL, setPlayURL] = useState<any>("");
  const [gamePlayData, setGamePlayData] = useState<any | null>(null);

  // State for countdown
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [leaderboardMessage, setLeaderboardMessage] = useState<any>("");

  // Countdown logic
  useEffect(() => {
    const endTime = new Date(
      liveTournamentData?.tournamentInfo?.tournament_end
    ).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [liveTournamentData?.tournamentInfo?.tournament_end]);

  useEffect(() => {
    getLiveTournamentData();
  }, []);

  const getLiveTournamentData = async () => {
    setLoading(true);
    try {
      const response = await fetchLiveTournament(tournament_id);
      if (response?.status) {
        setLiveTournamentData(response.data);
      }
      // else {
      //   console.error("Failed to fetch tournament data.");
      // }
    } catch (error) {
      console.error("Error fetching tournament:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickBack = () => {
    navigate(-1);
  };

  // Process game_help to replace '+' with spaces
  const formatGameHelp = (helpText: string | undefined) => {
    if (!helpText) return "Loading instructions...";

    return decodeURIComponent(helpText) // decode %22, %0D%0A, etc.
      .replace(/[^a-zA-Z ]/g, " ") // keep only alphabets + spaces
      .replace(/\s+/g, " ") // collapse multiple spaces
      .trim(); // trim start/end spaces
  };

  const handlePlayLiveTournament = async () => {
    setSelectedGame(liveTournamentData);
    fetchJazzPlayLiveTournament();
  };

  const fetchJazzPlayLiveTournament = async () => {
    try {
      const response = await playLiveTournament(
        liveTournamentData?.tournamentInfo?.tournament_id
      );
      if (response.status) {
        setGamePlayData(response?.data);
        setPlayURL(
          `https://games.igpl.pro/xml-api/play-game?partnercode=test-001&playerid=${response?.data?.player_profile_id}&gameid=${liveTournamentData?.tournamentInfo?.game_gameboost_id}`
        );
      }
      // else {
      //   console.log("failed to fetchJazzPlayLiveTournament");
      //   setPlayURL("");
      // }
    } catch (error) {
      console.log("Error fetching Manage Profile API", error);
      setPlayURL("");
    }
  };

  const navigateToLeaderBoard = () => {
    if (liveTournamentData?.joined) {
      setLeaderboardMessage("");
      navigate("/LeaderBoard", {
        state: {
          game: tournament_id,
        },
      });
    } else {
      setLeaderboardMessage("First Join the tournament");
    }
  };

  return (
    <>
      {loading && <SpinnersArea />}
      {!loading && (
        <>
          <div className="container direction-rtl tiny-slider-one-wrapper hero-tournament= rounded overflow-hidden p-0">
            {/* Banner Image */}
            <div className="position-relative">
              <img
                src={liveTournamentData?.tournamentInfo?.game_image_url}
                alt="Tournament Banner"
                className="img-fluid w-100"
                onClick={handlePlayLiveTournament}
              />
              <div
                className="position-absolute w-100 top-0 end-0 text-white fw-semibold p-2 fs-6"
                style={{
                  background:
                    "linear-gradient(rgb(0 0 0 / 44%) 70%, rgb(7 7 7 / 51%) 100%)",
                }}
              >
                <div className="d-flex justify-content-between">
                  <div className="back-button rounded-circle">
                    <button
                      onClick={handleClickBack}
                      className="btn rounded px-2 py-0"
                    >
                      <i
                        className="bi bi-arrow-left text-white"
                        style={{ fontSize: "16px" }}
                      ></i>
                    </button>
                  </div>
                  <div onClick={handleShowModal}>How to Play ?</div>
                </div>
              </div>
            </div>

            {/* Modal */}
            <div
              className={`modal fade ${showModal ? "show" : ""}`}
              style={{ display: showModal ? "block" : "none" }}
              tabIndex={-1}
              role="dialog"
              aria-labelledby="howToPlayModal"
              aria-hidden={!showModal}
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="howToPlayModal">
                      How to Play
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseModal}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body dark-mode-heading-color">
                    {(liveTournamentData?.tournamentInfo?.game_help !== "" &&
                      formatGameHelp(
                        liveTournamentData?.tournamentInfo?.game_help
                      )) ||
                      (liveTournamentData?.tournamentInfo?.game_description !==
                        "" &&
                        formatGameHelp(
                          liveTournamentData?.tournamentInfo?.game_description
                        ))}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn text-danger"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {showModal && (
              <div
                className="modal-backdrop fade show"
                onClick={handleCloseModal}
              ></div>
            )}

            {/* Timer Section */}
            <div className="text-center py-3 dark-mode-color">
              <p className="mb-2 fw-bold" style={{ fontSize: "1.2rem" }}>
                Tournament ends in
              </p>
              <div className="row justify-content-evenly fw-semibold text-teal fs-6 dark-mode-color">
                <div className="col-2 dark-mode-heading-color mx-1 p-1 rounded">
                  <div>{timeLeft.days}</div>
                  <small>Days</small>
                </div>
                <div className="col-2 dark-mode-heading-color mx-1 p-1 rounded">
                  <div>{timeLeft.hours}</div>
                  <small>Hours</small>
                </div>
                <div className="col-2 dark-mode-heading-color mx-1 p-1 rounded">
                  <div>{timeLeft.minutes}</div>
                  <small>Minutes</small>
                </div>
                <div className="col-2 dark-mode-heading-color mx-1 p-1 rounded">
                  <div>{timeLeft.seconds}</div>
                  <small>Seconds</small>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="text-center pb-3">
              <button
                className="btn btn-lg rounded-pill px-4 text-white"
                style={{ background: "rgb(46, 194, 176)" }}
                onClick={handlePlayLiveTournament}
              >
                Play & Win Rewards
              </button>
            </div>

            {/* {Join Fee} */}
            <div className="d-flex ps-4 align-items-center justify-content-start py-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: 40, height: 40 }}
              >
                <img
                  src="/assets/images/img/gold-coins.png"
                  width="64"
                  alt="Gold Coin"
                />
              </div>
              <div className="m-0 fs-6 fw-semibold dark-mode-color">
                <p className="mb-0">Entry Fee </p>
                <p className="fw-bold mb-0">
                  {liveTournamentData?.tournamentInfo?.fee_fee !== "0" ? (
                    <>
                      <span className="text-success">
                        {liveTournamentData?.tournamentInfo?.fee_fee}
                      </span>{" "}
                      Play Coins
                    </>
                  ) : (
                    <>
                      <span>Join for Free</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Reward Section */}
            <div className="d-flex ps-4 align-items-center justify-content-start py-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: 40, height: 40 }}
              >
                <img
                  src="/assets/images/img/gold-coin.png"
                  width="64"
                  alt="Gold Coin"
                />
              </div>
              <div className="m-0 fs-6 fw-semibold dark-mode-color">
                <p className="mb-0">Win up to </p>
                <p className="fw-bold mb-0">
                  <span className="fw-bold ">
                    {liveTournamentData?.tournamentInfo?.fee_prize_1}
                  </span>{" "}
                  {(liveTournamentData?.tournamentInfo?.fee_reward_type ===
                    "1" &&
                    "Reward Coins") ||
                    (liveTournamentData?.tournamentInfo?.fee_reward_type ===
                      "2" &&
                      "Top Up") ||
                    (liveTournamentData?.tournamentInfo?.fee_reward_type ===
                      "3" &&
                      "GB")}
                </p>
              </div>
            </div>

            {/* Rank Section */}
            <div className="d-flex ps-4 align-items-center justify-content-start py-2 text-center py-2 dark-mode-color">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: 40, height: 40 }}
              >
                <img src="/assets/images/img/trophy.png" width="64" alt="Trophy"></img>
              </div>
              {liveTournamentData?.joined ? (
                <>
                  <div className="m-0 fs-6 fw-semibold">
                    <p className="mb-0">
                      Your current rank{" "}
                      <span className="fw-bold text-grey">
                        #{liveTournamentData?.myRank || 0}
                      </span>
                    </p>
                    <p
                      className="fw-bold m-0"
                      onClick={navigateToLeaderBoard}
                    >
                      View Leaderboard &gt;
                    </p>
                    {leaderboardMessage !== "" && (
                      <p className="fw-semibold m-0 text-danger">
                        {leaderboardMessage}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="m-0 fs-6 fw-semibold">
                    <p className="mb-0">
                      You haven't played this tournament.
                    </p>
                    <p className="mb-0 text-start">
                      Play to unlock leaderboard!
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Rewards Table */}

            {/* {liveTournamentData?.rewardRanksList.length > 0 && 
                            
                            } */}
            <div className="col-12 p-1 reward-ranking rounded overflow-hidden">
              <table className="table m-0">
                {liveTournamentData?.rewardRanksList?.length > 0 && (
                  <div className="col-12 p-1 reward-ranking rounded overflow-hidden">
                    <table className="table m-0">
                      <thead>
                        <tr>
                          <th
                            colSpan={2}
                            className="text-white p-3 fs-6 fw-bold"
                            style={{ backgroundColor: "#2ec2b0" }}
                          >
                            Rewards
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveTournamentData.rewardRanksList.map(
                          (item: any, index: any) => (
                            <tr key={index} style={{ background: "rgba(0, 0, 0, 0.41)" }}>
                              <td
                                className="text-white p-3 fw-bold"
                                style={{ border: "none" }}
                              >
                                Rank {item?.rank}
                              </td>
                              <td
                                className="text-white p-3 text-end fw-bold"
                                style={{ border: "none" }}
                              >
                                <span className="me-2">{item?.prize}</span>
                                <img
                                  src="/assets/images/img/gold-coin.png"
                                  width="16"
                                  alt="Gold Coin"
                                />
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </table>
            </div>
          </div>
          {selectedGame && (
            <GameViewerNew
              fromGame={false}
              url={playURL}
              name={selectedGame?.tournamentInfo?.game_name}
              orientation={
                selectedGame?.tournamentInfo?.game_screen === "1"
                  ? "Portrait"
                  : "Landscape"
              }
              onClose={() => {
                getLiveTournamentData();
                setSelectedGame(null);
              }}
              game={gamePlayData}
            />
          )}
        </>
      )}
    </>
  );
};

export default HeroTournamentPage;
