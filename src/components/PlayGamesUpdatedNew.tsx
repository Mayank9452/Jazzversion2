
"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchPlayGamesData } from "@/features/playGames/playGamesSlice";
import { logout } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { BottomNavBar } from "./BottomNavBar";

const PlayGamesUpdatedNew = () => {
  const navigate = useNavigate();
  const { game_id } = useParams();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(true);

  const rawGames = useAppSelector((state) => state?.playGames);
  const [loading, setLoading] = useState(true);

  // ✅ correct path
  const gameLink = rawGames?.data?.data?.gameLink;

  // ================= FETCH GAME =================
  useEffect(() => {
    if (!game_id) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const res: any = await dispatch(fetchPlayGamesData(game_id) as any);

        if (res?.payload?.code === 401) {
          dispatch(logout());
          return;
        }
      } catch (err) {
        console.error("Game fetch error:", err);
      } finally {
        setLoading(false); // ✅ always runs
      }
    };

    fetchData();
  }, [game_id, dispatch, navigate]);

  // ================= FALLBACK =================
  const openInNewTab = () => {
    if (gameLink) {
      window.open(gameLink, "_blank");
    }
  };

  // ================= UI =================
  return (
    <>
      <div className="w-full h-[100dvh] bg-black flex items-center justify-center">
        {loading ? (
          <></>
        ) : gameLink ? (
          <iframe
            src={gameLink}
            className="w-full h-full border-0"
            allowFullScreen
          />
        ) : (
          <div className="text-center text-white space-y-4">
            <p>Game cannot be loaded</p>
            <Button onClick={openInNewTab}>Open Game</Button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <BottomNavBar isToggle={true} isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </>
  );
};

export default PlayGamesUpdatedNew;