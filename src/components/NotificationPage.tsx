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
} from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchNotification } from "@/features/notification/notificationSlice";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import WaitLoader from "./Loader";

const formatDateTime = (dateTimeString) => {
  const d = dayjs(dateTimeString);

  return {
    date: d.format("D MMM YYYY").toUpperCase(),
    time: d.format("h:mm A"),
  };
};



export default function NotificationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { list, status, hasMore, pageNo } = useAppSelector(
    (state) => state.notification,
  );

  const [filter, setFilter] = useState<"all" | "won" | "lost">("all");

  const [filters, setFilters] = useState({
    tab: "all",
    pageNo: 1,
  });
  const [selectedNotif, setSelectedNotif] = useState<number | null>(null);
  const { t } = useLanguage();

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

    // Extract amount like "5120 MB" from "You won 5120 MB Atom Data"
    const match = prizeText.match(/([\d,.]+\s*(MB|GB|KB))/i);
    if (match) {
      const amount = match[0];
      return t.youWonData?.replace("{0}", amount) || prizeText;
    }

    return prizeText;
  }, [t]);

  const formatNotification = useCallback((item: any) => {
    const start = formatDateTime(
      `${item.bid_start_date} ${item.bid_start_time}`,
    );
    const end = formatDateTime(`${item.bid_end_date} ${item.bid_end_time}`);

    // Deterministic diamond credit based on batch_id
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

    dispatch({ type: "notification/reset" }); // create this reducer

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
      <div className="p-2">

        {/* Header Section */}
        {/* <div className="rounded-xl relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 pt-6 pb-16 px-3 overflow-hidden"> */}
        <div className="rounded-xl relative gradient-home-section pt-6 pb-16 px-3 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl" />

          <div className="relative z-10 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white ">
                  {t.notifications}
                </h1>
              </div>

              {/* Unread Badge */}
              {/* <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <span className="text-xs font-bold text-white">
                  {NOTIFICATIONS.length} {t.new}
                </span>
              </div> */}
            </div>

            <p className="text-center text-white/90 text-sm font-semibold  mb-4">
              {t.bidUpdates}
            </p>

            {/* Filter Tabs */}
            {/* <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-xl gap-1">
              <button
                onClick={() => handleFilterChange("all")}
                className={`flex-1 px-3 py-2 text-[11px] font-bold rounded-xl transition-all duration-200 ${
                  filter === "all"
                    ? "bg-white text-violet-700 shadow-md"
                    : "text-white/70"
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => handleFilterChange("won")}
                className={`flex-1 px-3 py-2 text-[11px] font-bold rounded-xl transition-all duration-200 ${
                  filter === "won"
                    ? "bg-white text-emerald-600 shadow-md"
                    : "text-white/70"
                }`}
              >
                {t.won}
              </button>
              <button
                onClick={() => handleFilterChange("lost")}
                className={`flex-1 px-3 py-2 text-[11px] font-bold rounded-xl transition-all duration-200 ${
                  filter === "lost"
                    ? "bg-white text-gray-600 shadow-md"
                    : "text-white/70"
                }`}
              >
                {t.lost}
              </button>
            </div> */}

            {/* Filter Tabs */}
            <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-xl gap-1">
              {["all", "won", "lost"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab as any)}
                  className={`relative flex-1 px-3 py-2 text-[11px] font-bold rounded-xl transition-all duration-200 ${filter === tab ? "text-violet-700" : "text-white"
                    }`}
                >
                  {/* ✅ Sliding Background */}
                  {filter === tab && (
                    <motion.div
                      layoutId="notificationTab"
                      className="absolute inset-0 bg-white rounded-xl shadow-md"
                      transition={{
                        type: "spring",
                        bounce: 0.25,
                        duration: 0.5,
                      }}
                    />
                  )}

                  {/* ✅ Text */}
                  <span className="relative text-sm font-semibold ">
                    {tab === "all" ? t.all : tab === "won" ? t.won : t.lost}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="relative z-10 -mt-12 px-3 max-w-md mx-auto pb-4">
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <NotificationCard
                    notification={notif}
                    // isExpanded={selectedNotif === notif.id}
                    onToggle={() =>
                      setSelectedNotif(
                        selectedNotif === notif.id ? null : notif.id,
                      )
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty States */}
            {status === "success" && (
              <>
                {(notifications.length === 0 || filteredNotifications.length === 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-white/50 backdrop-blur-md border border-white/20 p-8 text-center shadow-xl mt-2"
                  >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white">
                        <Bell className="w-10 h-10 text-violet-400" />
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 mb-2 ">
                        {notifications.length === 0
                          ? t.noNotifications
                          : (filter === "won" ? t.noWonNotifications : t.noLostNotifications)}
                      </h3>

                      <p className="text-sm font-semibold text-gray-500 mb-4 px-4 font-medium leading-relaxed">
                        {notifications.length === 0
                          ? t.noNotificationsDesc
                          : t.noFilterNotificationsDesc}
                      </p>

                      <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 active:from-pink-600 active:to-rose-600 text-white font-bold py-2 rounded-xl text-sm  transition-colors duration-150 shadow-md active:shadow-lg"
                      >
                        <TrendingUp className="w-4.5 h-4.5" />
                        {t.startBidding}
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Loader */}
            {status === "loading" && (
              <p className="text-center text-sm text-gray-500 py-3">
                {t.loadingMore}
              </p>
            )}
          </div>
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
  } = notification;
  const { t } = useLanguage();

  return (
    <motion.button
      onClick={onToggle}
      className="w-full text-left"
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-150 ${won
          ? "bg-gradient-to-br from-emerald-50/50 to-white"
          : "border-gray-200 active:border-violet-200"
          }`}
      >
        {/* Status Strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${won
            ? "gradient-notification-won"
            : "gradient-loser-strip bg-gradient-to-r from-indigo-400 to-purple-400"
            }`}
        />

        <div className="p-3.5 ">
          {/* Header */}
          <div className="flex items-start justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${won
                  ? "gradient-notification-won"
                  : "gradient-loser-strip bg-gradient-to-br from-gray-300 to-gray-400"
                  }`}
              >
                {won ? (
                  <Trophy className="w-5 h-5 text-white" fill="currentColor" />
                ) : (
                  <MessageCircleX className="w-5 h-5 text-white" />
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-800 ">{bidName}</h3>
                <p className="text-xs text-gray-500 font-semibold ">
                  {timestamp}
                </p>
              </div>
            </div>

            {/* Win/Loss Badge */}
            {/* <div
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                won
                  ? "bg-[linear-gradient(90deg,_rgba(0,170,255,1)_0%,_rgb(75,195,255)_12%,_rgb(91,198,251)_29%,_rgba(0,170,255,1)_100%)] bg-gradient-to-br from-indigo-500 to-[#ff007cc2] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {won ? t.wonBadge : t.lostBadge}
            </div> */}
          </div>

          {/* Prize Info */}
          {won ? (
            <div className="gradient-notification-won rounded-xl p-2.5 mb-2.5">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-4 h-4 text-white" />
                <p className="text-sm font-semibold text-white/90 ">
                  {/* {t.yourPrize} */}
                  {prize}
                </p>
              </div>

              {diamondAmount !== 0 && <div className="flex items-center gap-2 mb-1">
                <Gem className="w-4 h-4 text-white inline mr-1" />
                <p className="text-white text-xs font-semibold ">
                  {diamondCredit}
                </p>
              </div>}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 active:from-violet-50 active:to-purple-50 rounded-xl border border-violet-300 transition-all active:scale-[0.98] rounded-lg p-2.5 mb-2.5">
              {/* <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded-lg flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-gray-600" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600">{t.noPrize}</p>
                  <p className="text-pink-600 text-[10px] font-semibold ">
                    <Gem className="w-4 h-4 text-pink-600 inline mr-1" />
                    {diamondCredit}
                  </p>
                </div>
              </div> */}
              <div className="flex items-center gap-2 mb-1 text-gray-600">
                <div className="w-5 h-5 bg-gray-300 rounded-lg flex items-center justify-center">
                  <X className="w-4 h-4" strokeWidth={3} />
                </div>
                <p className="text-sm font-semibold ">
                  {/* {t.yourPrize} */}
                  {t.noPrize}
                </p>
              </div>

              {diamondAmount !== 0 && <div className="ms-0.5 flex items-center gap-1.5 mb-1 text-pink-600">
                <Gem className="w-4 h-4 inline mr-1" />
                <p className="text-xs font-semibold ">
                  {diamondCredit}
                </p>
              </div>}
            </div>
          )}

          {/* Time Details */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-2 border border-violet-300">
              <div className="flex items-center gap-1 mb-0.5">
                <Calendar className="w-3 h-3 text-violet-600" />
                <span className="text-xs  font-bold text-violet-600">
                  {t.start}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-gray-800 ">{startDate}</p>
              <p className="text-[10px] text-gray-600 font-semibold ">{startTime}</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-2 border border-indigo-300">
              <div className="flex items-center gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-indigo-600" />
                <span className="text-xs  font-bold text-indigo-600">
                  {t.end}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-gray-800 ">{endDate}</p>
              <p className="text-[10px] text-gray-600 font-semibold ">{endTime}</p>
            </div>
          </div>

          {/* Expandable Stats */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2">
                    <StatBox
                      icon={<Zap className="w-3.5 h-3.5" />}
                      label="Bids"
                      value="24"
                    />
                    <StatBox
                      icon={<TrendingUp className="w-3.5 h-3.5" />}
                      label="Rank"
                      value="#12"
                    />
                    <StatBox
                      icon={<Trophy className="w-3.5 h-3.5" />}
                      label="Points"
                      value="1.2k"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand Indicator */}
          {/* <div className="flex justify-center mt-2">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </motion.div>
          </div> */}
        </div>
      </div>
    </motion.button>
  );
});

const StatBox = React.memo(({ icon, label, value }: any) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-2 text-center border border-gray-100">
      <div className="flex justify-center text-violet-600 mb-1">{icon}</div>
      <p className="text-[9px] text-gray-500 font-medium uppercase">{label}</p>
      <p className="text-xs font-bold text-gray-800">{value}</p>
    </div>
  );
});
