"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import { Zap, Gamepad2 } from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useAppDispatch } from "@/app/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { fetchGamesData } from "@/features/games/gamesSlice";
import { useNavigate } from "react-router-dom";
import CanvasGame from "./CanvasGame";
import GameCard from "./GameCard";
import WaitLoader from "./Loader";
import { useAppSelector } from "@/app/hooks";
import { getSubscriptionUIState } from "@/utils/subscriptionUtils";
import PopupBannerUnsubscribe from "./PopupBannerUnsubscribe";
import LowBalancePopup from "./LowBalancePopup";
import { useState } from "react";

const gradients = [
  "gradient-casino",
  "gradient-dark",
  "gradient-purple",
  "gradient-green-dark",
  "gradient-pink-dark",
  "gradient-blue",
];

// ── Sub-components ───────────────────────────────────────────────────────────

const GamesHeader = React.memo(({ t }: { t: any }) => (
  <div className="rounded-xl relative bg-gradient-to-r from-[#0a0f7ac4] to-pink-700 pt-3 pb-16 px-3 overflow-hidden shadow-lg">
    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
    <div className="relative z-10">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white ">
          {t?.gamesTitle || "Games"}
        </h1>
      </div>
      <div className="rounded-xl bg-black/20 backdrop-blur-sm p-2 shadow-lg">
        <div className="relative w-full h-28 bg-black/10 rounded-xl overflow-hidden border border-white/20">
          <CanvasGame />
        </div>
      </div>
    </div>
  </div>
));

const TrendingSection = React.memo(({ t, language }: { t: any; language: string }) => (
  <div className="w-[85%] mx-auto relative overflow-hidden rounded-2xl bg-white p-3 flex items-center justify-center gap-3 group transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer pointer-events-none will-change-transform" />
    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />
    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_4px_15px_rgba(219,39,119,0.3)] transform transition-transform group-hover:scale-110 group-hover:rotate-3">
      <Zap className="w-6 h-6 text-white drop-shadow-md" />
    </div>
    <div className="relative">
      <h2 className={`${language === 'my' ? 'text-[18px]' : 'text-xl'} font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent `}>
        {t?.trendingGames || "Trending Games"}
      </h2>
      <div className={`h-1 ${language === 'my' ? 'w-24' : 'w-20'} bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-0.5 group-hover:w-full transition-all duration-500`} />
    </div>
  </div>
));

const GamesList = React.memo(({ games, onPlay }: { games: any[]; onPlay: (url: string) => void }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2 ">
    {games.map((game: any, index: number) => (
      <GameCard
        key={game.game_id}
        game={game}
        index={index}
        bgClass={gradients[index % gradients.length]}
        onPlay={onPlay}
      />
    ))}
  </div>
));

// ── Main Component ───────────────────────────────────────────────────────────

export default function GamesPage() {
  const dispatch = useAppDispatch();
  const { data, status } = useSelector((state: RootState) => state.games);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data: homeData } = useAppSelector((state) => state.home);
  const [showNotSubscribed, setShowNotSubscribed] = useState(false);
  const [showLowBalance, setShowLowBalance] = useState(false);

  const userInfo = homeData?.data?.userInfo;
  const dValidTill = homeData?.data?.dValidTill;
  const subUIState = useMemo(() => getSubscriptionUIState(userInfo, dValidTill), [userInfo, dValidTill]);

  const games = useMemo(() => data?.data?.freeGames || [], [data]);

  useEffect(() => {
    if (!data) {
      dispatch(fetchGamesData());
    }
  }, [dispatch, data]);

  const handleGamePlay = useCallback((url: string) => {
    const isSuspend = userInfo?.user_subscription_status?.toLowerCase() === "suspend";
    if (!subUIState.hasAccess && !isSuspend) {
      if (subUIState.popupToShow === "lowBalance") {
        setShowLowBalance(true);
      } else if (subUIState.popupToShow === "unsubscribe") {
        setShowNotSubscribed(true);
      }
      return;
    }
    navigate(url);
  }, [navigate, subUIState, userInfo]);

  return (
    <>
      <TopBar />

      <div className="pt-2 px-2">
        <div className="max-w-md mx-auto">
          <GamesHeader t={t} />

          <div className="relative -mt-12 space-y-4 mx-1">
            <TrendingSection t={t} language={language} />

            <GamesList
              games={games}
              onPlay={handleGamePlay}
            />
          </div>
        </div>
      </div>

      <BottomNavBar />
      {status === "loading" && <WaitLoader isOverlay />}

      <PopupBannerUnsubscribe
        isShow={showNotSubscribed}
        onClose={() => setShowNotSubscribed(false)}
        onConfirm={() => setShowNotSubscribed(false)}
        confirmText={t.subscribeNow}
        data={{
          title: t.notSubscribedTitle || "Not Subscribed !",
          description: t.notSubscribedDesc || "You are not subscribe with us, Please subscribe with Daily or Weekly plan.",
          image: true,
          autoCloseTimer: 0,
        }}
      />

      <LowBalancePopup
        visible={showLowBalance}
        onClose={() => setShowLowBalance(false)}
        avatarUrl={userInfo?.user_image}
      />
    </>
  );
}
