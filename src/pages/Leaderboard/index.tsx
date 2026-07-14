import React, { useEffect, useState } from "react";
import HeaderFourteen from "../../layouts/headers/HeaderFourteen";
import { tournamentLeaderBoard } from "../../apiServices/igplApi";
import { useLocation } from "react-router-dom";
import ScrollTop from "../common/ScrollTop";
import SpinnersArea from "../spinners/SpinnersArea";

const Leaderboard: React.FC = () => {
  const location = useLocation();
  const { game } = location.state as { game: any };

  const [leaderBoardData, setLeaderBoardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const leaderBoardApi = async () => {
    setLoading(true);
    try {
      const response = await tournamentLeaderBoard(game);
      if (response?.status) {
        setLeaderBoardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching leaderBoardApi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    leaderBoardApi();
  }, []);

  return (
    <>
      {loading && <SpinnersArea />}
      {!loading && leaderBoardData && (
        <>
          <ScrollTop />
          <HeaderFourteen />

          <div className="page-content-wrapper py-2  d-flex justify-content-center align-items-center min-vh-90">
            <div className="container" style={{ maxWidth: "500px" }}>
              {/* Your Rank & Score */}
              <div
                className="p-4 rounded-lg d-flex justify-content-around align-items-center mb-4"
                style={{
                  background: "#35b6a8",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div className="text-center flex-1">
                  <img
                    src="/assets/img/trophy.png"
                    width="64"
                    alt="Trophy"
                  />
                  <br />
                  <span
                    className="text-white fw-semibold"
                    style={{ fontSize: "18px" }}
                  >
                    Rank {leaderBoardData?.myRank}
                  </span>
                </div>
                <div className="text-center flex-1">
                  <span className="text-white fw-semibold" style={{ fontSize: "14px" }}>
                    Your best score is
                  </span>
                  <br />
                  <span
                    className="text-white fw-bold"
                    style={{ fontSize: "24px" }}
                  >
                    {leaderBoardData?.myScore || 0}
                  </span>
                </div>
              </div>

              {/* Leaderboard Table */}
              <div
                className="rounded-lg"
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <table className="table w-full" style={{ marginBottom: "0" }}>
                  <thead>
                    <tr
                      style={{
                        background: "#f8f9fa",
                        color: "#495057",
                        borderBottom: "1px solid #dee2e6",
                      }}
                    >
                      <th
                        className="p-3 text-left"
                        style={{ fontWeight: "600" }}
                      >
                        User
                      </th>
                      <th
                        className="p-3 text-center"
                        style={{ fontWeight: "600" }}
                      >
                        Score
                      </th>
                      <th
                        className="p-3 text-center"
                        style={{ fontWeight: "600" }}
                      >
                        Rank
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderBoardData?.user_rank_array?.length > 0 && leaderBoardData?.user_rank_array?.map(
                      (player: any, index: number) => {
                        const isCurrentUser =
                          player?.user_id === leaderBoardData.userInfo?.user_id;
                        return (
                          <tr
                            key={player.user_id}
                            style={{
                              borderBottom: "1px solid #dee2e6",
                              background: isCurrentUser ? "rgb(5 110 93 / 63%)" : "#fff", // navy blue for current user
                              color: isCurrentUser ? "#fff" : "#495057", // white text if current user
                            }}
                          >
                            <td
                              className="p-3 text-left fw-semibold"
                              style={{
                                fontWeight: isCurrentUser ? "600" : "400",
                                verticalAlign: "middle",
                              }}
                            >
                              <img
                                src={`/assets/users/${player.user_image}`}
                                alt="User"
                                width={40}
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "middle",
                                  marginRight: "8px",
                                  borderRadius: "50%",
                                }}
                              />
                              <span style={{ verticalAlign: "middle", color: isCurrentUser ? "white" : "grey" }}>
                                {player.user_phone}
                              </span>
                            </td>
                            <td
                              className="p-3 text-center fw-semibold"
                              style={{ verticalAlign: "middle", color: isCurrentUser ? "white" : "grey" }}
                            >
                              {player.player_score}
                            </td>
                            <td
                              className="p-3 text-center fw-semibold"
                              style={{ verticalAlign: "middle", color: isCurrentUser ? "white" : "grey" }}
                            >
                              {player.player_rank}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Leaderboard;
