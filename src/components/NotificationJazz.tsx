import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Trash2,
  ChevronLeft,
  ArrowLeft,
  Calendar,
  Settings,
  Trophy,
  Gift,
  AlertTriangle,
  LoaderPinwheel,
} from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import WaitLoader from "./Loader";
import { useTheme } from "next-themes";
import {
  clearAllNotificationApi,
  deleteNotificationApi,
  notificationPageApi,
} from "@/apiServices/igplApi";

// Formatter for adding readable notification dates
const formatNotificationDate = (dateString: string, t: any) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return `${t?.today || "Today"}, ${time}`;
  } else if (isYesterday) {
    return `${t?.yesterday || "Yesterday"}, ${time}`;
  } else {
    return `${date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    })}, ${time}`;
  }
};

// --- Decorative Background Subcomponents ---
const DarkModeBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* Hexagon Pattern Grid on the Right */}
    <div className="absolute right-0 top-1/4 w-80 h-96 opacity-5 text-brand-yellow-100">
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3">
        <pattern id="hex-dark" width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
          <path d="M 10 0 L 5 2.89 L 0 0 L 0 5.77 L 5 8.66 L 10 5.77 Z M 0 8.66 L 5 11.55 L 0 14.43 L 0 20.21 L 5 23.09 L 10 20.21 L 10 14.43 L 5 11.55 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </pattern>
        <rect width="100" height="100" fill="url(#hex-dark)" />
      </svg>
    </div>

    {/* Circuit lines on the left */}
    <svg className="absolute left-0 top-10 w-64 h-96 text-brand-yellow-100/5" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="0.6">
      <path d="M 0,20 L 30,20 L 50,40 L 50,70 L 60,80 L 100,80" />
      <path d="M 0,50 L 20,50 L 35,65 L 35,100 L 45,110 L 100,110" />
      <circle cx="50" cy="40" r="1.2" fill="currentColor" />
      <circle cx="60" cy="80" r="1.2" fill="currentColor" />
      <circle cx="35" cy="65" r="1.2" fill="currentColor" />
      <circle cx="45" cy="110" r="1.2" fill="currentColor" />
    </svg>
  </div>
);

const LightModeBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* Geometric Wireframe Sphere on the Left */}
    <svg className="absolute -left-10 top-1/4 w-80 h-96 text-black-v4/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3">
      <polygon points="50,10 70,30 50,50 30,30" />
      <polygon points="50,50 70,70 50,90 30,70" />
      <polygon points="70,30 90,50 70,70 50,50" />
      <polygon points="30,30 50,50 30,70 10,50" />
      <line x1="50" y1="10" x2="50" y2="50" />
      <line x1="50" y1="50" x2="50" y2="90" />
      <line x1="30" y1="30" x2="70" y2="70" />
      <line x1="70" y1="30" x2="30" y2="70" />
    </svg>

    {/* Thin Circuit lines on the right */}
    <svg className="absolute right-0 top-12 w-64 h-96 text-black-v4/30" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="0.5">
      <path d="M 100,30 L 70,30 L 55,45 L 55,80 L 40,95 L 0,95" />
      <path d="M 100,60 L 80,60 L 65,75 L 65,110 L 50,125 L 0,125" />
      <circle cx="55" cy="45" r="0.8" fill="currentColor" />
      <circle cx="40" cy="95" r="0.8" fill="currentColor" />
      <circle cx="65" cy="75" r="0.8" fill="currentColor" />
      <circle cx="50" cy="125" r="0.8" fill="currentColor" />
    </svg>
  </div>
);

export default function NotificationJazz() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data: homeData } = useAppSelector((state) => state.home);
  const userInfo = homeData?.data?.userInfo;
  const avatar = userInfo?.user_profile_img ? `${userInfo.user_profile_img}.png` : "9.png";

  const [loading, setLoading] = useState<boolean>(false);
  const [notificationPageData, setNotificationPageData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "rewards" | "profile">("all");

  const fetchNotificationApi = async () => {
    setLoading(true);
    try {
      const response = await notificationPageApi();
      if (response.status) {
        setNotificationPageData(response.data);
      } else {
        console.error("Failed to fetch Notification Page Api:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetchNotificationApi:", error);
    } finally {
      setLoading(false);
    }
  };

  const notificationDeleteApi = async (notify_id: any) => {
    setLoading(true);
    try {
      const response = await deleteNotificationApi(notify_id);
      if (response.status) {
        setNotificationPageData(response.data);
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error notificationDeleteApi:", error);
    } finally {
      setLoading(false);
      fetchNotificationApi(); // ensure we have fresh state
    }
  };

  const clearnotificationApi = async () => {
    setLoading(true);
    try {
      const response = await clearAllNotificationApi();
      if (response.status) {
        setNotificationPageData(response.data);
      } else {
        console.error("Failed to clear notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error clearnotificationApi:", error);
    } finally {
      setLoading(false);
      fetchNotificationApi();
    }
  };

  useEffect(() => {
    fetchNotificationApi();
  }, []);

  const getNotificationMeta = (title: string, description: string, isDark: boolean) => {
    const text = `${title} ${description}`.toLowerCase();

    if (
      text.includes("win") ||
      text.includes("won") ||
      text.includes("winner") ||
      text.includes("congratulations")
    ) {
      return {
        icon: <LoaderPinwheel className={`w-5 h-5 animate-spin ${isDark ? 'text-brand-yellow-100 drop-shadow-[0_0_8px_rgba(255,202,32,0.5)]' : 'text-brand-gold-100'}`} />,
        type: "REWARD",
        titleColor: isDark ? "text-brand-yellow-100" : "text-brand-gold-100 font-extrabold",
        cardBorder: isDark
          ? "border-brand-yellow-100/15 hover:border-brand-yellow-100/35 shadow-[0_4px_20px_rgba(255,202,32,0.04)]"
          : "border-brand-yellow-100/25 hover:border-brand-yellow-100/45 shadow-sm shadow-brand-yellow-100/5",
        shieldBg: isDark
          ? "bg-gradient-to-br from-brand-yellow-100/20 via-brand-yellow-100/5 to-transparent border border-brand-yellow-100/30"
          : "bg-brand-yellow-100/10 border border-brand-yellow-100/25 text-brand-gold-100",
        capsuleBg: isDark
          ? "bg-brand-yellow-100/5 border border-brand-yellow-100/15 text-brand-yellow-100"
          : "bg-brand-yellow-100/10 border border-brand-yellow-100/20 text-brand-gold-100",
        accentBar: "from-brand-yellow-100 via-brand-yellow-200 to-brand-gold-100",
        glowColor: "rgba(255, 202, 32, 0.2)",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(255,202,32,0.12)]",
      };
    }

    if (
      text.includes("gift") ||
      text.includes("reward") ||
      text.includes("bonus") ||
      text.includes("prize")
    ) {
      return {
        icon: <Gift className={`w-5 h-5 ${isDark ? 'text-brand-gold-100 drop-shadow-[0_0_8px_rgba(223,162,8,0.5)]' : 'text-brand-gold-100'}`} />,
        type: "BONUS",
        titleColor: isDark ? "text-brand-gold-200" : "text-brand-gold-100 font-extrabold",
        cardBorder: isDark
          ? "border-brand-gold-100/15 hover:border-brand-gold-100/35 shadow-[0_4px_20px_rgba(223,162,8,0.04)]"
          : "border-brand-gold-100/25 hover:border-brand-gold-100/45 shadow-sm shadow-brand-gold-100/5",
        shieldBg: isDark
          ? "bg-gradient-to-br from-brand-gold-100/20 via-brand-gold-100/5 to-transparent border border-brand-gold-100/30"
          : "bg-brand-gold-100/10 border border-brand-gold-100/25 text-brand-gold-100",
        capsuleBg: isDark
          ? "bg-brand-gold-100/5 border border-brand-gold-100/15 text-brand-gold-200"
          : "bg-brand-gold-100/10 border border-brand-gold-100/20 text-brand-gold-100",
        accentBar: "from-brand-gold-100 via-brand-yellow-200 to-brand-yellow-100",
        glowColor: "rgba(223, 162, 8, 0.2)",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(223,162,8,0.12)]",
      };
    }

    if (
      text.includes("alert") ||
      text.includes("warning") ||
      text.includes("fail") ||
      text.includes("error")
    ) {
      return {
        icon: <AlertTriangle className={`w-5 h-5 ${isDark ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-rose-600'}`} />,
        type: "ALERT",
        titleColor: isDark ? "text-rose-400" : "text-rose-600 font-extrabold",
        cardBorder: isDark
          ? "border-rose-500/15 hover:border-rose-500/35 shadow-[0_4px_20px_rgba(244,63,94,0.04)]"
          : "border-rose-500/25 hover:border-rose-500/45 shadow-sm shadow-rose-500/5",
        shieldBg: isDark
          ? "bg-gradient-to-br from-rose-500/20 via-rose-500/5 to-transparent border border-rose-500/30"
          : "bg-rose-500/10 border border-rose-500/25 text-rose-600",
        capsuleBg: isDark
          ? "bg-rose-500/5 border border-rose-500/15 text-rose-400"
          : "bg-rose-500/10 border border-rose-500/20 text-rose-700",
        accentBar: "from-rose-400 to-red-600",
        glowColor: "rgba(244, 63, 94, 0.2)",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(244,63,94,0.12)]",
      };
    }

    return {
      icon: (
        <img
          src={`/assets/users/${avatar}`}
          className="w-5 h-5 rounded-full object-cover"
          alt="Avatar"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/users/9.png";
          }}
        />
      ),
      type: "PROFILE",
      titleColor: "text-brand-yellow-100 font-extrabold",
      cardBorder: isDark
        ? "border-brand-gray-300/15 hover:border-brand-gray-300/35 shadow-[0_4px_20px_rgba(117,117,117,0.02)]"
        : "border-brand-gray-300/25 hover:border-brand-gray-300/45 shadow-sm shadow-brand-gray-300/5",
      shieldBg: isDark
        ? "bg-gradient-to-br from-brand-gray-300/20 via-brand-gray-300/5 to-transparent border border-brand-gray-300/30"
        : "bg-brand-gray-300/10 border border-brand-gray-300/25 text-brand-gray-500",
      capsuleBg: isDark
        ? "bg-brand-gray-300/5 border border-brand-gray-300/15 text-brand-gray-400"
        : "bg-brand-gray-300/10 border border-brand-gray-300/20 text-brand-gray-500",
      accentBar: "from-brand-yellow-100 via-brand-yellow-200 to-brand-gold-100",
      glowColor: "rgba(117, 117, 117, 0.15)",
      hoverShadow: "group-hover:shadow-[0_0_20px_rgba(117,117,117,0.12)]",
    };
  };

  const filteredList = useMemo(() => {
    if (!notificationPageData?.list) return [];
    if (activeTab === "all") return notificationPageData.list;
    return notificationPageData.list.filter((n: any) => {
      const meta = getNotificationMeta(n.notify_title, n.notify_description, isDark);
      if (activeTab === "rewards") return meta.type === "REWARD" || meta.type === "BONUS";
      if (activeTab === "profile") return meta.type === "PROFILE" || meta.type === "ALERT";
      return true;
    });
  }, [notificationPageData, activeTab, isDark]);

  return (
    <>
      <div className="relative bg-background text-foreground overflow-hidden transition-colors duration-300 min-h-[calc(100vh-95px)] pb-10">
        {isDark ? <DarkModeBackground /> : <LightModeBackground />}
        {/* Ambient top gradient glow */}
        <div
          className="pointer-events-none fixed inset-x-0 top-0 h-80 z-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,202,32,0.15) 0%, transparent 70%)"
              : "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(223,162,8,0.06) 0%, transparent 70%)",
          }}
        />

        {/* ── Premium Glassmorphic Header Card ── */}
        <div className="relative z-10">
          <div className={`relative overflow-hidden p-4 flex items-center justify-between gap-3 border-b transition-all duration-300 ${isDark ? "bg-gradient-to-br from-[#2B2B2B]/40 to-[#191919]/30 border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.2)]" : "bg-gradient-to-br from-white/70 to-white/40 border-slate-200/60 shadow-sm"} backdrop-blur-xl`}>
            <div className="w-full flex justify-between items-center gap-5">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all pointer-events-auto cursor-pointer shrink-0 ${isDark ? "bg-[#32323299] backdrop-blur-md border border-white/10 text-white hover:bg-black/75" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-800 dark:text-white leading-tight">
                  {t?.notifications || "Notifications"}
                </h1>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-muted-foreground mt-1 leading-none">
                  Stay updated with your rewards & updates
                </p>
              </div>
              {/* Right side: Profile avatar in rounded-xl container */}
              <div
                onClick={() => navigate("/settingsStatic")}
                className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden border cursor-pointer active:scale-95 transition-all hover:scale-105 shadow-md ${isDark ? "bg-[#32323299] backdrop-blur-md border-white/10" : "bg-white border-slate-200"}`}
              >
                <img
                  src={`/assets/users/${avatar}`}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/users/9.png";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 px-4 max-w-md mx-auto relative z-10">
          {/* Relocated Clear All Button */}
          {notificationPageData?.list?.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={clearnotificationApi}
                className="text-xs font-black uppercase tracking-widest text-[#dfa208] dark:text-[#ffca20] hover:brightness-110 active:scale-95 transition-all bg-yellow-main/10 dark:bg-yellow-main/5 px-4 py-2 border border-[#dfa208]/20 rounded-xl"
              >
                {t?.clearAll || "Clear All"}
              </button>
            </div>
          )}

          {/* Sliding Tab Selector */}
          {notificationPageData?.list?.length > 0 && (
            <div className="flex p-1 bg-brand-black-200/5 dark:bg-brand-black-200/40 backdrop-blur-md rounded-full border border-border/40 max-w-sm mx-auto mb-6 relative">
              {[
                { id: "all", label: "All" },
                { id: "rewards", label: "Rewards" },
                { id: "profile", label: "Profile" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 rounded-full z-10 ${isActive ? "text-brand-black-100" : "text-brand-gray-400 hover:text-foreground"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-brand-gradient rounded-full -z-10 shadow-md shadow-brand-yellow-100/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Notifications List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredList?.length > 0 ? (
                filteredList.map(
                  (notification: any, index: number) => {
                    const meta = getNotificationMeta(
                      notification.notify_title,
                      notification.notify_description,
                      isDark
                    );

                    const descColor = isDark ? "text-white/80" : "text-brand-gray-400 font-semibold";

                    return (
                      <motion.div
                        key={notification.notify_id || index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.25) }}
                        layout
                        className={`relative w-full rounded-r-3xl bg-white dark:bg-card/45 backdrop-blur-md border ${meta.cardBorder} p-4 flex gap-4 transition-all duration-300 hover:translate-y-[-2px] group ${meta.hoverShadow}`}
                      >
                        {/* Left vertical Accent Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${meta.accentBar} rounded-l-3xl z-10`} />

                        {/* Left: Glowing Icon Shield */}
                        <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center z-10 mt-0.5">
                          <div
                            className="absolute inset-0 rounded-2xl opacity-10 blur-sm group-hover:scale-110 transition-all duration-300"
                            style={{ background: meta.glowColor }}
                          />
                          <div className={`w-full h-full rounded-2xl ${meta.shieldBg} flex items-center justify-center relative overflow-hidden shadow-inner border border-white/5`}>
                            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">{meta.icon}</div>
                          </div>
                        </div>

                        {/* Right: Info details */}
                        <div className="flex-1 flex flex-col min-w-0 z-10 text-start">
                          {/* Title & Date */}
                          <div className="min-w-0 pr-6">
                            <div className="flex items-center gap-2 mb-1.5">
                              {/* Pulsing Status Dot */}
                              <span className="relative flex h-1.5 w-1.5 shrink-0">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r ${meta.accentBar} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 bg-gradient-to-r ${meta.accentBar}`}></span>
                              </span>

                              <h4 className={`text-sm font-black uppercase tracking-wide leading-tight ${meta.titleColor}`}>
                                {notification.notify_title}
                              </h4>
                            </div>

                            <p
                              className={`text-[11px] leading-relaxed break-words ${descColor} mb-2.5 [&_strong]:text-foreground [&_strong]:font-black [&_span]:text-brand-yellow-100`}
                              dangerouslySetInnerHTML={{
                                __html: notification.notify_description,
                              }}
                            />
                          </div>

                          {/* Footer: Date & Time capsule */}
                          <div className="flex items-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 ${meta.capsuleBg} backdrop-blur-md rounded-full text-[9px] font-bold shadow-md`}>
                              <Calendar className="w-2.5 h-2.5 flex-shrink-0" />
                              {formatNotificationDate(notification.added_on, t)}
                            </span>
                          </div>
                        </div>

                        {/* Dismiss Button */}
                        <button
                          onClick={() => notificationDeleteApi(notification.notify_id)}
                          className="absolute right-3 top-3 w-6 h-6 rounded-lg bg-muted/60 dark:bg-white/5 border border-border text-muted-foreground hover:bg-rose-500/10 dark:hover:bg-rose-500/20 hover:border-rose-300 dark:hover:border-rose-500/30 hover:text-rose-600 dark:hover:text-rose-400 active:scale-90 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 max-sm:opacity-80"
                          title="Dismiss"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </motion.div>
                    );
                  }
                )
              ) : (
                !loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative p-8 text-center rounded-3xl border border-border bg-white dark:bg-card/45 backdrop-blur-md shadow-lg max-w-md mx-auto"
                  >
                    {/* Ringing Bell Icon */}
                    <div className="w-16 h-16 bg-brand-black-200 dark:bg-black/35 backdrop-blur-md border border-border text-brand-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-5 relative">
                      <div className="absolute inset-0 bg-brand-yellow-100/20 rounded-2xl animate-ping" />
                      <Bell className="h-8 w-8 text-brand-yellow-100 fill-brand-yellow-100/10 animate-bounce" />
                    </div>

                    <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-2">
                      {t?.noNotifications || "All Caught Up"}
                    </h3>

                    <p className="text-[11px] text-brand-gray-400 mb-6 font-semibold leading-relaxed px-2">
                      {activeTab === "all"
                        ? "Tournament alerts, rewards, announcements, and match statuses will appear here."
                        : `No notifications found in ${activeTab} category.`}
                    </p>

                    {/* <button
                      onClick={() => activeTab === "all" ? navigate("/") : setActiveTab("all")}
                      className="bg-brand-gradient text-brand-black-100 text-[10px] font-black tracking-widest uppercase rounded-full px-6 py-2.5 shadow-lg shadow-brand-yellow-100/10 hover:brightness-105 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{activeTab === "all" ? (t?.backToHome || "Back To Home") : "View All"}</span>
                      <span className="font-sans text-[9px] font-black leading-none">&gt;</span>
                    </button> */}
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <BottomNavBar />

      {loading && <WaitLoader isOverlay />}
    </>
  );
}
