import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, Sparkles, Star } from "lucide-react";
import { BottomNavBar } from "./BottomNavBar";
import { TopBar } from "./TopBar";
import WaitLoader from "./Loader";
import { useLanguage } from "./context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchLeaderboard,
  resetLeaderboard,
} from "@/features/leaderboard/leaderboardSlice";
import PopupNotJoinedLeaderboard from "./PopupNotJoinedLeaderboard";

/* ─── palette tokens ──────────────────────────────────────── */
const P = {
  navy: "#0b2f5f",
  navyMid: "#1a5276",
  navyLight: "#2471a3",
  blue: "#2e86c1",
  yellow: "#fecb13",
  yellowDark: "#b8900d",
  yellowPale: "#fff8d6",
  aqua: "#80c7c5",
  aquaDark: "#5ba3a0",
  aquaLight: "#b2e4e3",
  black: "#0d0d0d",
  gray1: "#1f1f1f",
  gray2: "#4d4d4d",
  gray3: "#888888",
  gray4: "#c0c0c0",
  gray5: "#e8e8e8",
  white: "#ffffff",
};

/* ─── helpers ─────────────────────────────────────────────── */
const maskPhone = (phone: string) => {
  if (!phone) return "";
  const trimmed = phone.slice(2);
  const first3 = trimmed.slice(0, 3);
  const last3 = trimmed.slice(-3);
  return `${first3}xxxx${last3}`;
};

/* ─── podium styles — palette-aligned ────────────────────── */
type PodiumType = "gold" | "silver" | "bronze";

const podiumStyles: Record<PodiumType, {
  ring: React.CSSProperties;
  podiumBg: React.CSSProperties;
  podiumH: number;
  glow: string;
  badgeBg: string;
  badgeText: string;
  scoreColor: string;
}> = {
  gold: {
    // #1 → yellow brand colour
    ring: { background: `linear-gradient(135deg, ${P.yellowDark}, ${P.yellow}, ${P.yellowDark})` },
    podiumBg: { background: `linear-gradient(180deg, ${P.yellowDark} 0%, ${P.yellow} 50%, ${P.yellowDark} 100%)` },
    podiumH: 110,
    glow: "shadow-[0_0_20px_rgba(254,203,19,0.6)]",
    badgeBg: `linear-gradient(135deg, ${P.yellowDark}, ${P.yellow})`,
    badgeText: P.navy,
    scoreColor: P.yellowDark,
  },
  silver: {
    // #2 → aqua brand colour
    ring: { background: `linear-gradient(135deg, ${P.aquaDark}, ${P.aquaLight}, ${P.aquaDark})` },
    podiumBg: { background: `linear-gradient(180deg, ${P.aquaDark} 0%, ${P.aqua} 50%, ${P.aquaDark} 100%)` },
    podiumH: 80,
    glow: "shadow-[0_0_16px_rgba(128,199,197,0.55)]",
    badgeBg: `linear-gradient(135deg, ${P.aquaDark}, ${P.aqua})`,
    badgeText: P.white,
    scoreColor: P.aquaDark,
  },
  bronze: {
    // #3 → mid-blue brand colour
    ring: { background: `linear-gradient(135deg, ${P.navy}, ${P.navyLight}, ${P.navy})` },
    podiumBg: { background: `linear-gradient(180deg, ${P.navy} 0%, ${P.navyMid} 50%, ${P.navy} 100%)` },
    podiumH: 60,
    glow: "shadow-[0_0_14px_rgba(11,47,95,0.5)]",
    badgeBg: `linear-gradient(135deg, ${P.navyMid}, ${P.blue})`,
    badgeText: P.white,
    scoreColor: P.navyLight,
  },
};

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════ */
export default function JazzLeaderboard() {
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const [showNotJoinedPopup, setShowNotJoinedPopup] = useState(false);
  const [filters, setFilters] = useState({ tab: "weekly", pageNo: 1 });

  const { list, status, hasMore, user } = useAppSelector(
    (state) => state.leaderboard,
  );

  /* fetch on filter change */
  useEffect(() => {
    dispatch(fetchLeaderboard(filters));
  }, [filters]);

  /* infinite scroll */
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const threshold = window.innerWidth < 650 ? 200 : 50;
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        if (status !== "loading" && hasMore) {
          setFilters((prev) => ({ ...prev, pageNo: prev.pageNo + 1 }));
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [status, hasMore]);

  const handleTabChange = (tab: "weekly" | "monthly") => () => {
    setActiveTab(tab);
    dispatch(resetLeaderboard());
    setFilters({ tab, pageNo: 1 });
  };

  const formatUsers = useCallback((users: any[] = []) => {
    return users.map((u: any) => {
      const avatarIndex = (Number(u.user_id) % 15) + 1;
      return {
        id: u.user_id,
        name: maskPhone(u.user_phone),
        score: Number(u.points || 0),
        bids: u.bidsCount || 0,
        avatar: `${avatarIndex}.png`,
      };
    });
  }, []);

  const users = useMemo(() => formatUsers(list), [list, formatUsers]);
  const topThree = useMemo(() => users.slice(0, 3), [users]);
  const theRest = useMemo(() => users.slice(3), [users]);

  return (
    <>
      <TopBar />

      <div className="pb-24" style={{ background: P.gray5 }}>

        {/* ── Hero Banner ──────────────────────────────────── */}
        <div
          className="relative text-white overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${P.navy} 0%, ${P.navyMid} 60%, ${P.navyLight} 100%)` }}
        >
          {/* decorative blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* yellow glow top-right */}
            <div
              className="absolute -top-14 -right-14 w-52 h-52 rounded-full opacity-25 animate-pulse"
              style={{ background: `radial-gradient(circle, ${P.yellow} 0%, transparent 70%)` }}
            />
            {/* aqua glow bottom-left */}
            <div
              className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-20 animate-pulse"
              style={{ background: `radial-gradient(circle, ${P.aqua} 0%, transparent 70%)`, animationDelay: "1s" }}
            />
            {/* subtle grid lines */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.6) 28px, rgba(255,255,255,0.6) 29px),
                                   repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.6) 28px, rgba(255,255,255,0.6) 29px)`,
              }}
            />
          </div>

          <div className="relative z-10 px-4 pt-6 pb-28 max-w-md mx-auto">
            {/* title row */}
            <div className="flex items-center justify-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "rgba(254,203,19,0.18)", border: "1px solid rgba(254,203,19,0.35)" }}
              >
                <Trophy className="w-5 h-5" style={{ color: P.yellow }} fill={P.yellow} />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
                {t.leaderboard ?? "Leaderboard"}
              </h1>
            </div>

            <p className="text-center text-sm font-medium mb-5" style={{ color: "rgba(255,255,255,0.75)" }}>
              {t.leaderboardDesc ?? "Top players & their rankings"}
            </p>

            {/* tab switcher */}
            <div
              className="flex p-1 rounded-2xl max-w-xs mx-auto shadow-xl"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              {(["weekly", "monthly"] as const).map((tab) => (
                <button
                  key={tab}
                  id={`jazz-leaderboard-tab-${tab}`}
                  onClick={handleTabChange(tab)}
                  className="relative flex-1 px-3 py-2 text-xs font-bold capitalize rounded-xl transition-all duration-300"
                  style={{ color: activeTab === tab ? P.navy : "rgba(255,255,255,0.75)" }}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="jazzTab"
                      className="absolute inset-0 rounded-xl shadow-md"
                      style={{ background: P.yellow }}
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 text-sm font-bold">
                    {tab === "weekly" ? (t.weekly ?? "Weekly") : (t.monthly ?? "Monthly")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Podium card (overlaps hero) ──────────────────── */}
        <div className="relative z-10 -mt-24 px-3 mb-4 max-w-md mx-auto">
          <div
            className="rounded-3xl shadow-2xl overflow-hidden"
            style={{
              background: P.white,
              border: `1px solid ${P.gray5}`,
              boxShadow: `0 20px 60px rgba(11,47,95,0.18)`,
            }}
          >
            {/* decorative top strip */}
            <div
              className="h-1.5 w-full"
              style={{ background: `linear-gradient(90deg, ${P.navy}, ${P.aqua}, ${P.yellow})` }}
            />

            {/* sparkles row */}
            <div className="flex justify-center gap-1.5 pt-3 pb-1">
              {[P.yellow, P.aqua, P.yellow, P.aqua, P.yellow].map((c, i) => (
                <Star key={i} className="w-3 h-3 opacity-50" style={{ color: c }} fill={c} />
              ))}
            </div>

            {/* podium */}
            <div className="flex items-end justify-center px-2 pb-0">
              {topThree[1] && <PodiumCard user={topThree[1]} rank={2} />}
              {topThree[0] && <PodiumCard user={topThree[0]} rank={1} isFirst />}
              {topThree[2] && <PodiumCard user={topThree[2]} rank={3} />}

              {users.length === 0 && status === "success" && (
                <p className="py-10 text-sm font-medium text-center w-full" style={{ color: P.gray3 }}>
                  No leaderboard data yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Rankings list ────────────────────────────────── */}
        <div className="px-3 max-w-md mx-auto">
          <div
            className="rounded-3xl p-3 overflow-hidden"
            style={{
              background: P.white,
              border: `1px solid ${P.gray5}`,
              boxShadow: `0 8px 32px rgba(11,47,95,0.10)`,
            }}
          >
            {/* section header */}
            {theRest.length > 0 && (
              <div className="flex items-center gap-2 px-1 mb-3">
                <Medal className="w-4 h-4" style={{ color: P.aquaDark }} />
                <span className="text-sm font-bold" style={{ color: P.navy }}>
                  {t.topPlayers ?? "Top Players"}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <AnimatePresence>
                {theRest.map((u, index) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: Math.min(index * 0.03, 0.25) }}
                    className="will-change-[transform,opacity]"
                  >
                    <RankRow user={u} rank={index + 4} t={t} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* loading more */}
              {status === "loading" && filters.pageNo > 1 && (
                <p className="text-center text-sm py-4 font-medium" style={{ color: P.gray3 }}>
                  {t.loadingMore ?? "Loading more…"}
                </p>
              )}

              {/* empty state */}
              {users.length === 0 && status === "success" && (
                <div className="py-10 flex flex-col items-center gap-3">
                  <Trophy className="w-12 h-12" style={{ color: P.gray4 }} />
                  <p className="text-sm font-semibold" style={{ color: P.gray3 }}>
                    No rankings yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky user rank card ──────────────────────────── */}
      <AnimatePresence>
        {user && user.rank !== 0 && (
          <motion.div
            key="user-rank-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.4 }}
            className="fixed bottom-20 left-0 right-0 px-3 z-20 pointer-events-none"
          >
            <div
              className="max-w-md mx-auto text-white rounded-2xl px-4 py-3 shadow-2xl pointer-events-auto will-change-transform"
              style={{
                background: `linear-gradient(135deg, ${P.navy} 0%, ${P.navyMid} 60%, ${P.navyLight} 100%)`,
                border: `1px solid rgba(254,203,19,0.25)`,
                boxShadow: `0 8px 32px rgba(11,47,95,0.45)`,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                {/* left: rank badge + label */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                    style={{ background: `rgba(254,203,19,0.20)`, border: `1px solid rgba(254,203,19,0.35)` }}
                  >
                    <span className="text-base font-extrabold" style={{ color: P.yellow }}>
                      {user.rank}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.75)" }}>
                      {t.yourRank ?? "Your Rank"}
                    </p>
                    <p className="text-[11px] font-medium leading-tight text-white">
                      {t.keepClimbing ?? "Keep climbing! 🚀"}
                    </p>
                  </div>
                </div>

                {/* right: score with aqua tint */}
                <div className="flex items-center gap-1.5">
                  <img
                    src="/assets/images/diamond5.png"
                    alt="diamond"
                    className="h-6 object-cover"
                    loading="lazy"
                  />
                  <span className="text-lg font-extrabold tracking-tight" style={{ color: P.yellow }}>
                    {Number(user.points || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Not-joined floating trigger ────────────────────── */}
      <AnimatePresence>
        {user && user.rank === 0 && (
          <motion.button
            key="not-joined-fab"
            id="jazz-leaderboard-join-fab"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => setShowNotJoinedPopup(true)}
            className="fixed bottom-24 right-4 z-20 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse will-change-transform cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${P.navy}, ${P.navyMid})`,
              border: `2px solid ${P.yellow}`,
              touchAction: "manipulation",
            }}
          >
            <Trophy className="w-7 h-7" style={{ color: P.yellow }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Popup ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showNotJoinedPopup && (
          <PopupNotJoinedLeaderboard
            onClose={() => setShowNotJoinedPopup(false)}
            t={t}
            activeTab={activeTab}
          />
        )}
      </AnimatePresence>

      <BottomNavBar />

      {status === "loading" && filters.pageNo === 1 && <WaitLoader isOverlay />}
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   PODIUM CARD
═════════════════════════════════════════════════════════════ */
const PodiumCard = React.memo(({ user, rank, isFirst = false }: {
  user: any; rank: number; isFirst?: boolean;
}) => {
  const { t } = useLanguage();
  const type: PodiumType = rank === 1 ? "gold" : rank === 2 ? "silver" : "bronze";
  const s = podiumStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.07, type: "spring", bounce: 0.3, duration: 0.55 }}
      className="flex flex-col items-center flex-1 will-change-[transform,opacity]"
    >
      {/* crown for #1 — yellow */}
      {type === "gold" ? (
        <Crown
          className="w-7 h-7 mb-1 animate-bounce"
          style={{ color: P.yellow }}
          fill={P.yellow}
        />
      ) : (
        <div className="h-8 mb-1" />
      )}

      {/* avatar ring */}
      <div className={`relative mb-2 ${isFirst ? "scale-110" : ""}`}>
        <div
          style={{ ...s.ring, width: isFirst ? 64 : 56, height: isFirst ? 64 : 56 }}
          className={`rounded-2xl p-[2.5px] ${s.glow}`}
        >
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src={`/assets/users/${user.avatar}`}
              alt={user.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* rank badge */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold border-2 border-white shadow-md"
          style={{ background: s.badgeBg, color: s.badgeText }}
        >
          {rank}
        </div>
      </div>

      {/* name & score */}
      <div className="text-center px-1 flex flex-col items-center gap-1 mb-1">
        <p className="text-[11px] font-bold truncate max-w-[72px]" style={{ color: P.navy }}>
          {user.name}
        </p>

        {/* score — yellow accent text */}
        <div className="flex items-center gap-0.5">
          <img
            src="/assets/images/diamond5.png"
            alt="diamond"
            className="h-4 object-cover"
            loading="lazy"
          />
          <span
            className="text-xs font-bold"
            style={{ color: s.scoreColor }}
          >
            {user.score.toLocaleString()}
          </span>
        </div>

        <span className="text-[10px] font-bold" style={{ color: P.gray3 }}>
          {user.bids.toLocaleString()} {t.bids ?? "bids"}
        </span>
      </div>

      {/* podium block */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.25 + rank * 0.06, duration: 0.5, ease: "easeOut" }}
        style={{
          ...s.podiumBg,
          height: s.podiumH,
          transformOrigin: "bottom",
          width: "100%",
        }}
        className="rounded-t-2xl border border-white/20 shadow-inner will-change-transform relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </motion.div>
    </motion.div>
  );
});

/* ════════════════════════════════════════════════════════════
   RANK ROW
═════════════════════════════════════════════════════════════ */
const RankRow = React.memo(({ user, rank, t }: { user: any; rank: number; t: any }) => {
  return (
    <div
      id={`jazz-rank-row-${rank}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all active:scale-[0.98]"
      style={{
        background: `linear-gradient(135deg, rgba(11,47,95,0.04) 0%, rgba(128,199,197,0.10) 100%)`,
        border: `1px solid rgba(11,47,95,0.08)`,
      }}
    >
      {/* rank number */}
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ background: P.gray5, border: `1px solid ${P.gray4}` }}
      >
        <span className="text-xs font-extrabold" style={{ color: P.gray2 }}>{rank}</span>
      </div>

      {/* avatar — aqua ring */}
      <div
        className="w-10 h-10 rounded-xl p-[2px] flex-shrink-0 shadow-sm"
        style={{ background: `linear-gradient(135deg, ${P.aquaDark}, ${P.aqua})` }}
      >
        <div className="w-full h-full bg-white rounded-xl overflow-hidden">
          <img
            src={`/assets/users/${user.avatar}`}
            alt={user.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold truncate leading-tight" style={{ color: P.navy }}>
          {user.name}
        </h3>
        <p className="text-xs font-semibold leading-tight" style={{ color: P.aquaDark }}>
          {user.bids} {t.bids ?? "bids"} ⚡
        </p>
      </div>

      {/* score — yellow accent */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <img
          src="/assets/images/diamond5.png"
          alt="diamond"
          className="h-5 object-cover"
          loading="lazy"
        />
        <span className="text-sm font-extrabold" style={{ color: P.navyMid }}>
          {user.score.toLocaleString()}
        </span>
      </div>
    </div>
  );
});