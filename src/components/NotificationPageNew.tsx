import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Trophy,
  Calendar,
  Clock,
  Gift,
  TrendingUp,
  Zap,
  Gem,
  MessageCircleX,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchNotification, resetNotification } from "@/features/notification/notificationSlice";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import WaitLoader from "./Loader";

const formatDateTime = (dateTimeString: string) => {
  const d = dayjs(dateTimeString);
  return {
    date: d.format("D MMM YYYY").toUpperCase(),
    time: d.format("h:mm A"),
  };
};

export default function NotificationPageNew() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { list, status, hasMore, pageNo } = useAppSelector(
    (state) => state.notification
  );

  const [filter, setFilter] = useState<"all" | "won" | "lost">("all");
  const [selectedNotif, setSelectedNotif] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    tab: "all",
    pageNo: 1,
  });

  useEffect(() => {
    dispatch(fetchNotification(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (status !== "loading" && hasMore) {
          setFilters((prev) => ({
            ...prev,
            pageNo: prev.pageNo + 1,
          }));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [status, hasMore]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    const mins = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (mins < 60) {
      return t.minAgo?.replace("{0}", mins.toString()) || `${mins} min ago`;
    }
    if (hours < 24) {
      const key = hours === 1 ? "hrAgo" : "hrsAgo";
      return t[key]?.replace("{0}", hours.toString()) || `${hours} ${hours === 1 ? "hr" : "hrs"} ago`;
    }
    const key = days === 1 ? "dayAgo" : "daysAgo";
    return (
      t[key]?.replace("{0}", days.toString()) ||
      `${days} ${days === 1 ? "day" : "days"} ago`
    );
  };

  const formatBidName = useCallback((bidName: string) => {
    if (!bidName) return "";
    const parts = bidName.split("+");
    const type = parts[1]?.toLowerCase();
    const cycle = parts[2] || "";

    if (type === "daily") return t.bidNameDaily?.replace("{0}", cycle) || `Bid Daily ${cycle}`;
    if (type === "weekly") return t.bidNameWeekly?.replace("{0}", cycle) || `Bid Weekly ${cycle}`;

    return bidName.replace(/\+/g, " ");
  }, [t]);

  const formatPrize = useCallback((prizeText: string) => {
    if (!prizeText || prizeText === "No prize won") return null;

    const match = prizeText.match(/([\d,.]+\s*(MB|GB|KB))/i);
    if (match) {
      const amount = match[0];
      return t.youWonData?.replace("{0}", amount) || prizeText;
    }

    return prizeText;
  }, [t]);

  const formatNotification = useCallback((item: any) => {
    const start = formatDateTime(
      `${item.bid_start_date} ${item.bid_start_time}`
    );
    const end = formatDateTime(`${item.bid_end_date} ${item.bid_end_time}`);
    const diamondAmount = item.diamond_earned || 0;

    return {
      id: item.batch_id,
      bidName: formatBidName(item.bid_name),
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
      won: item.reward_prize_text !== "No prize won",
      diamondAmount: diamondAmount,
      diamondCredit: t.diamondEarned?.replace("{0}", diamondAmount.toString()) || `Diamond earned ${diamondAmount}`,
      prize: formatPrize(item.reward_prize_text),
      timestamp: formatTimeAgo(item.batch_datetime),
      rank: Number(item.cycle_reward_rank),
      isRead: item.cycle_reward_seen === "1",
    };
  }, [formatBidName, formatPrize, t]);

  const notifications = useMemo(() => list.map(formatNotification), [list, formatNotification]);

  const handleFilterChange = (type: "all" | "won" | "lost") => {
    setFilter(type);
    dispatch(resetNotification());
    setFilters({
      tab: type === "all" ? "" : type,
      pageNo: 1,
    });
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (filter === "won") return notif.won;
      if (filter === "lost") return !notif.won;
      return true;
    });
  }, [notifications, filter]);

  return (
    <>
      <TopBar />
      <div className="pt-2 px-3 pb-16 max-w-md mx-auto min-h-screen bg-background text-foreground relative">
        
        {/* Header Ribbon */}
        <div className="relative flex items-center justify-center rounded-xl bg-blue-main h-12 mb-5 shadow-sm border border-blue-main/20">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-main animate-bounce" />
            <span className="font-black tracking-wider uppercase text-xs text-white">
              {t?.notifications || "Notifications"}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white dark:bg-card p-1 rounded-2xl border border-blue-v2/15 shadow-md mb-5 gap-1">
          {(["all", "won", "lost"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange(tab)}
              className={`relative flex-1 py-2 rounded-xl transition-all duration-300 font-black text-[10px] tracking-wider uppercase ${
                filter === tab
                  ? "bg-blue-main text-yellow-main dark:bg-yellow-main dark:text-blue-main shadow-sm"
                  : "text-muted-foreground hover:bg-blue-main/5"
              }`}
            >
              {tab === "all" ? t.all : tab === "won" ? t.won : t.lost}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                layout
              >
                <NotificationCard
                  notification={notif}
                  isExpanded={selectedNotif === notif.id}
                  onToggle={() => setSelectedNotif(selectedNotif === notif.id ? null : notif.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {status === "success" && filteredNotifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-gradient-to-br from-blue-v3/5 via-white to-blue-v2/10 border border-blue-v2/15 p-8 text-center shadow-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-white/10 dark:shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-main/10 dark:bg-yellow-main/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-blue-main dark:text-yellow-main" />
              </div>
              <h3 className="text-sm font-black text-blue-main dark:text-white uppercase tracking-wider mb-2">
                {t.noNotifications || "No Notifications"}
              </h3>
              <p className="text-xs text-muted-foreground mb-5 px-2">
                {t.noNotificationsDesc || "When you receive bid notifications and results, they will show up here."}
              </p>
              <button
                onClick={() => navigate("/")}
                className="font-black px-6 py-2.5 rounded-full text-[10px] tracking-wider uppercase bg-blue-main text-white hover:bg-blue-v1 dark:bg-yellow-main dark:text-blue-main dark:hover:bg-yellow-v1 transition-all shadow-md active:scale-95"
              >
                {t.startBidding || "Start Bidding"}
              </button>
            </motion.div>
          )}

          {/* Loaders */}
          {status === "loading" && (
            <div className="flex justify-center items-center py-4">
              <span className="text-xs font-black tracking-widest uppercase text-muted-foreground animate-pulse">
                {t.loadingMore || "Loading..."}
              </span>
            </div>
          )}
        </div>
      </div>
      <BottomNavBar />
      {status === "loading" && pageNo === 1 && <WaitLoader isOverlay />}
    </>
  );
}

const NotificationCard = React.memo(({ notification, isExpanded, onToggle }: any) => {
  const {
    bidName,
    startDate,
    startTime,
    endDate,
    endTime,
    won,
    prize,
    diamondAmount,
    diamondCredit,
    timestamp,
    rank,
  } = notification;
  const { t } = useLanguage();

  return (
    <div
      onClick={onToggle}
      className={`relative rounded-2xl border bg-white dark:bg-card p-4 shadow-sm cursor-pointer transition-all duration-200 ${
        won
          ? "border-aqua-main hover:border-aqua-main/80 bg-gradient-to-br from-aqua-main/5 to-transparent"
          : "border-blue-v2/15 hover:border-blue-v2/30"
      }`}
    >
      {/* Top Banner Ribbon accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${
          won ? "bg-aqua-main" : "bg-blue-main"
        }`}
      />

      <div className="flex items-start justify-between gap-3 mt-1">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              won
                ? "bg-aqua-main/25 text-aqua-v1"
                : "bg-blue-main/10 text-blue-main dark:bg-white/5 dark:text-white"
            }`}
          >
            {won ? (
              <Trophy className="w-5 h-5" />
            ) : (
              <MessageCircleX className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-blue-main dark:text-white uppercase tracking-wider">
              {bidName}
            </h4>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
              {timestamp}
            </span>
          </div>
        </div>

        <span
          className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
            won
              ? "bg-aqua-main/20 text-aqua-v1"
              : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/80"
          }`}
        >
          {won ? t.wonBadge || "Won" : t.lostBadge || "Lost"}
        </span>
      </div>

      {/* Prize / Diamond Details */}
      {won ? (
        <div className="mt-3 p-3 bg-aqua-main/10 rounded-xl border border-aqua-main/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Gift className="w-4 h-4 text-aqua-v1" />
            <span className="font-extrabold text-xs text-blue-main dark:text-white">
              {prize}
            </span>
          </div>
          {diamondAmount > 0 && (
            <div className="flex items-center gap-2">
              <Gem className="w-3.5 h-3.5 text-yellow-main fill-yellow-main" />
              <span className="text-[10px] font-bold text-blue-main dark:text-yellow-main">
                {diamondCredit}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2 mb-1.5">
            <X className="w-4 h-4 text-red-500" />
            <span className="font-bold text-xs text-muted-foreground">
              {t.noPrize || "No Prize Won"}
            </span>
          </div>
          {diamondAmount > 0 && (
            <div className="flex items-center gap-2">
              <Gem className="w-3.5 h-3.5 text-yellow-main fill-yellow-main" />
              <span className="text-[10px] font-bold text-blue-main dark:text-yellow-main">
                {diamondCredit}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Time Details Grid */}
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3 h-3 text-blue-main dark:text-yellow-main" />
            <span className="text-[9px] font-black text-blue-main dark:text-white uppercase tracking-wider">
              {t.start || "Start"}
            </span>
          </div>
          <p className="text-[9px] font-extrabold text-blue-main dark:text-white mb-0">
            {startDate}
          </p>
          <p className="text-[8px] font-bold text-muted-foreground mb-0">
            {startTime}
          </p>
        </div>

        <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-blue-main dark:text-yellow-main" />
            <span className="text-[9px] font-black text-blue-main dark:text-white uppercase tracking-wider">
              {t.end || "End"}
            </span>
          </div>
          <p className="text-[9px] font-extrabold text-blue-main dark:text-white mb-0">
            {endDate}
          </p>
          <p className="text-[8px] font-bold text-muted-foreground mb-0">
            {endTime}
          </p>
        </div>
      </div>

      {/* Expandable Stats details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 grid grid-cols-3 gap-2">
              <StatBox icon={<Zap className="w-3.5 h-3.5 text-blue-main dark:text-yellow-main" />} label="Bids" value="24" />
              <StatBox icon={<TrendingUp className="w-3.5 h-3.5 text-blue-main dark:text-yellow-main" />} label="Rank" value={rank ? `#${rank}` : "-"} />
              <StatBox icon={<Trophy className="w-3.5 h-3.5 text-blue-main dark:text-yellow-main" />} label="Points" value={diamondAmount ? `${diamondAmount}` : "0"} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-2.5">
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
        </motion.div>
      </div>
    </div>
  );
});

const StatBox = React.memo(({ icon, label, value }: any) => {
  return (
    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-2 text-center border border-slate-100 dark:border-white/5">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-[8px] text-muted-foreground font-black uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs font-black text-blue-main dark:text-white mb-0">{value}</p>
    </div>
  );
});
