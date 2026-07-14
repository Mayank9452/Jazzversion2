import VideoSection from "@/components/VideoSection";
import ActivitySlider from "@/components/ActivitySlider";
import { ACTIVITY_FEED } from "@/utils/mockData";
import { TopBar } from "@/components/TopBar";
import { Flame, PlayCircle, Activity, Trophy } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import LeaderboardNew from "@/components/LeaderboardNew";
import WinnerList from "@/components/WinnerList";
import TrendingGamesSlider from "@/components/TrendingGamesSlider";
import { useLanguage } from "@/components/context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import BidCardDemoNew from "@/components/BidCardDemoNew";
import BiddingHammer from "@/components/BiddingHammer";
import LowBalancePopup from "@/components/LowBalancePopup";
import { useState, useEffect } from "react";
export default function HomePage() {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { data: response } = useAppSelector((state) => state.home);


  const userPlayCoins = response?.data?.userInfo?.user_play_coins;
  const avatarUrl = response?.data?.userInfo?.user_avatar;


  return (
    <>
      <TopBar />
      <div className="mobile-container py-1  space-y-2">

        <section>
          <WinnerList lastWeeklyWinners={response?.data?.lastWeeklyWinners} />
        </section>

        {/* LIVE AUCTIONS */}
        <section
          className="
  rounded-3xl
  p-2 pt-0
  "
          style={{ opacity: 1, transform: "none" }}
        >
          {/* <h2 className="text-xl text-center font-bold text-gradient-casino mb-4">
            🔥 Live Auctions
          </h2> */}

          <div className="rounded-xl relative gradient-home-section pt-4 pb-16 px-3 overflow-hidden mb-4 ">
            {/* <h2 className="flex items-center justify-center gap-2 text-xl font-bold text-white">
              <Flame className="h-5 w-5 text-white" />
              
              Live Bidding
            </h2> */}
            <h2 className="flex items-center justify-center gap-4 text-xl font-bold text-white mb-2">
              <div className="flex-shrink-0 -mt-2">
                <BiddingHammer className="w-12 h-12" />
              </div>
              <span className="text-xl font-bold ">{t.liveBidding || "Live Bidding"}</span>
            </h2>
            <p className="text-center text-white/90 text-sm font-semibold ">
              {t.liveBidDescription || "Play now and win ATOM Rewards"}
            </p>
          </div>

          {/* Glass Container */}
          <div className="-mt-[4.5rem]">
            <div className="border border-white/20 rounded-2xl">
              <BidCardDemoNew />
            </div>
          </div>
        </section>

        {/* HERO VIDEO */}
        <section
          className="
  rounded-3xl
  p-2 pt-0
"
          style={{ opacity: 1, transform: "none" }}
        >
          {/* <h2 className="text-xl text-center font-bold text-gradient-casino mb-4">
            <PlayCircle className="h-5 w-5 text-primary" />
            ⚡ How to Play
          </h2> */}
          <div className="rounded-xl relative gradient-home-section pt-4 pb-16 px-3 overflow-hidden mb-4 ">
            <h2 className="flex items-center justify-center gap-2 text-xl font-bold text-white ">
              <PlayCircle className="h-5 w-5 text-white" />
              {t.howToPlay}
            </h2>
            <p className="mt-1 text-center text-white/90 text-sm font-semibold ">
              {t.howToPlayDescription || "Get started with our easy-to-follow guide!"}
            </p>
          </div>

          <VideoSection />
        </section>

        {/* ACTIVITY */}
        <section
          className="
  rounded-3xl
  p-2 pb-0 pt-0
  "
          style={{ opacity: 1, transform: "none" }}
        >
          {/* <h2 className="text-lg font-bold text-gradient-gold mb-3">
          ⚡ Live Activity
        </h2> */}

          {/* <h2 className="text-xl text-center font-bold text-gradient-casino mb-4">
            ⚡ Live Activity
          </h2> */}
          <div className="rounded-xl relative gradient-home-section pt-4 pb-16 px-3 overflow-hidden mb-4 ">
            <h2 className="flex items-center justify-center gap-2 text-xl font-bold text-white ">
              <Activity className="h-5 w-5 text-white" />
              {t.liveActivity}
            </h2>
            <p className="mt-1 text-center text-white/90 text-sm font-semibold ">
              {t.liveActivityDescription || "See what other players are up to in real-time!"}
            </p>
          </div>

          <ActivitySlider
            activities={ACTIVITY_FEED}
            latestJoined={response?.data?.latest_joined_users}
            winners={response?.data?.liveActivityWinners}
          />
        </section>

        {/* LEADERBOARD */}
        <section
          className="
  rounded-3xl
  p-2 py-0
  "
          style={{ opacity: 1, transform: "none" }}
        >
          {/* <h2 className="text-xl text-center font-bold text-gradient-casino mb-4">
            ⚡ Leaderboard
          </h2> */}
          <div className="rounded-xl relative gradient-home-section pt-4 pb-16 px-3 overflow-hidden mb-4 ">
            <h2 className="flex items-center justify-center gap-2 text-xl font-bold text-white ">
              <Trophy className="h-5 w-5 text-white" />
              {t.leaderboard}
            </h2>
            <p className="mt-1 text-center text-white/90 text-sm font-semibold ">
              {t.top5Rankings || "Top 5 Players and their rankings"}
            </p>
          </div>

          <LeaderboardNew
            weeklyUsers={response?.data?.weeklyLeaderBoardUsers}
            monthlyUsers={response?.data?.monthlyLeaderBoardUsers}
          />
        </section>

        <section>
          <TrendingGamesSlider />
        </section>
      </div>

      <BottomNavBar />


    </>
  );
}
