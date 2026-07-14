import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import {
  Sparkles,
  Zap,
  Clock,
  Trophy,
  TrendingUp,
  ChevronLeft,
  Gamepad2,
  Gamepad,
} from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
import { OTHER_API_URL } from "@/config/config";

export default function DetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const renderTextWithDiamond = (text: string, isLight: boolean = false) => {
    if (!text) return null;
    const parts = text.split("{diamond}");
    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <img
                src="/assets/images/diamond5.png"
                alt="Diamond"
                className={`w-4 h-4 inline-block mb-1 ${isLight ? 'brightness-200 contrast-200' : ''}`}
              />
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen">
      <TopBar />

      <div className="min-h-screen mx-2">
        {/* Top Bar Placeholder */}
        <div className="relative gradient-home-section backdrop-blur-2xl border-b border-gray-200 p-4 sticky top-0 shadow-sm mt-2 rounded-xl pb-14">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 top-3 p-1 bg-white/95 hover:bg-white rounded-xl backdrop-blur-md transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-indigo-600" />
          </button>
          <h1 className="text-xl font-bold text-white flex items-center justify-center gap-2 ">
            <Gamepad2 className="w-6 h-6 text-white" />
            {t.howToPlay}
          </h1>
        </div>

        <div className="max-w-md mx-auto pt-2 pb-2 space-y-4 -mt-12">

          {/* Video Card - Premium Style */}
          <div className="relative aspect-video rounded-2xl bg-dark-gray shadow-xl shadow-purple-500/20 overflow-hidden border border-white/20 mx-2">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

            <span className="absolute top-4 left-4 z-20 flex items-center gap-2 text-xs font-semibold bg-red-500 text-white px-3 py-1.5 rounded-full shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {t.live}
            </span>

            <div className="aspect-video flex items-center justify-center">
              <video
                src={`${OTHER_API_URL}assets/frontend/img/introduction.mp4`}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Hero Welcome Card */}
          <div className="relative overflow-hidden rounded-xl gradient-hero-vibrant p-5 shadow-2xl mx-2">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <h2 className="text-xl font-bold text-white">{t.welcomeToBidBlast}</h2>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed">
                {t.bidblastDescription} 🎁
              </p>
            </div>
          </div>

          {/* Bid Types - Ultra Modern Cards */}
          <div className="space-y-4 mx-2">
            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-200">
                <Gamepad className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-800">{t.chooseGameMode}</h3>
              </div>
            </div>

            {/* Daily Bid */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-[2px] active:scale-[0.97] transition-all cursor-pointer">
              <div className="relative bg-white rounded-[22px] p-4 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />

                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-60" />
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                          <Clock className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {t.dailyBid}
                        </h4>
                        <p className="text-xs text-gray-500 font-semibold">{t.fastPacedAction}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-md opacity-50" />
                      <span className="relative text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-full shadow-lg ">
                        🔥 {t.popular}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-100">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-400/10 rounded-full blur-xl" />
                      <p className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent relative">4</p>
                      <p className="text-xs text-gray-600 font-semibold mt-1 ">{t.totalCycles}</p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-2 border border-purple-100">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/10 rounded-full blur-xl" />
                      <p className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent relative ">6h</p>
                      <p className="text-xs text-gray-600 font-semibold mt-1 ">{t.perCycle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Bid */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-[2px] active:scale-[0.97] transition-all cursor-pointer">
              <div className="relative bg-white rounded-[22px] p-5 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-rose-400/20 rounded-full blur-2xl" />

                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-lg opacity-60" />
                        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-xl">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ">
                          {t.weeklyBid}
                        </h4>
                        <p className="text-xs text-gray-500 font-semibold ">{t.strategicGameplay}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50" />
                      <span className="relative text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full shadow-lg ">
                        ⭐ {t.trending}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 border border-purple-100">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/10 rounded-full blur-xl" />
                      <p className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent relative">7</p>
                      <p className="text-xs text-gray-600 font-semibold mt-1">{t.totalCycles}</p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-4 border border-pink-100">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-pink-400/10 rounded-full blur-xl" />
                      <p className="text-3xl font-bold bg-gradient-to-br from-pink-600 to-rose-600 bg-clip-text text-transparent relative">24h</p>
                      <p className="text-xs text-gray-600 font-semibold mt-1">{t.perCycle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Info Cards */}
          <div className="space-y-4 mt-6 mx-2">
            {/* What are Cycles */}
            <div className="rounded-2xl bg-white p-5 shadow-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xl">🔄</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {t.whatAreCycles}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t.cyclesDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-5 shadow-lg border border-green-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">✨</span>
                {t.whyYouLoveIt}
              </h3>

              <div className="space-y-3">
                {useMemo(() => [
                  { text: t.multipleChances, icon: "🎯" },
                  { text: t.joinAnyCycle, icon: "⏰" },
                  { text: t.playYourPace, icon: "🎮" },
                  { text: t.independentCycles, icon: "🔓" },
                ], [t]).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard & Diamond Info */}
            <div className="space-y-4">
              {/* Main Leaderboard Card */}
              <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                      <Trophy className="w-6 h-6 text-yellow-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {t.leaderboardInfoTitle}
                    </h3>
                  </div>
                  <p className="text-sm text-indigo-50 text-sm text-gray-600 leading-relaxed">
                    {renderTextWithDiamond(t.leaderboardInfoDesc, true)}
                  </p>
                </div>
              </div>

              {/* Participation Bonus Card */}
              <div className="rounded-2xl bg-white p-5 shadow-lg border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-full -mr-8 -mt-8" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-800 mb-1">{t.participationDiamonds}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {renderTextWithDiamond(t.participationDiamondsDesc)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-1 gap-4">
                {/* Daily Rewards */}
                <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-5 border border-pink-100 shadow-lg">
                  <h4 className="text-sm font-bold text-rose-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t.dailyWinnerPrizes}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { rank: 1, diam: 100 },
                      { rank: 2, diam: 50 },
                      { rank: 3, diam: 30 },
                      { rank: 4, diam: 20 }
                    ].map((item) => (
                      <div key={item.rank} className="bg-white/80 rounded-xl p-3 flex justify-between items-center border border-pink-200">
                        <span className="text-xs font-bold text-gray-700">{t.rankText.replace("{0}", item.rank)}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-rose-600">{item.diam}</span>
                          <img src="/assets/images/diamond5.png" alt="Diamond" className="w-4 h-4  object-contain" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Rewards */}
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 border border-amber-100 shadow-lg">
                  <h4 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t.weeklyWinnerPrizes}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { rank: 1, diam: 100 },
                      { rank: 2, diam: 70 },
                      { rank: 3, diam: 50 },
                      { rank: 4, diam: 40 },
                      { rank: 5, diam: 30 },
                      { rank: 6, diam: 20 },
                      { rank: 7, diam: 10 }
                    ].map((item) => (
                      <div key={item.rank} className="bg-white/80 rounded-xl p-3 flex justify-between items-center border border-amber-200">
                        <span className="text-xs font-bold text-gray-700">{t.rankText.replace("{0}", item.rank)}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-amber-600">{item.diam}</span>
                          <img src="/assets/images/diamond5.png" alt="Diamond" className="w-4 h-4 object-contain" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Final Footer Note */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 text-center">
                <p className="text-xs font-bold text-gray-500 italic">
                  🔥 {t.morePlayMoreChance}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
      <BottomNavBar />
    </div>

  );
}
