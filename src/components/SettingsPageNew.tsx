import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Bell, Shield, FileText,
  LogOut, Check, Phone, Settings, Sun, Moon, Calendar, Zap, Trophy
} from "lucide-react";
import { useTheme } from "next-themes";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getProfileInfo, unsubscribeUser } from "@/features/bidProfile/profileSlice";
import { updateProfileImageThunk } from "@/features/bidProfile/updateProfileSlice";
import WaitLoader from "./Loader";
import { HexagonalAvatarFrame } from "./HexagonalAvatarFrame";
import { TopBarUpdated } from "./TopbarUpdated";
import PopupLayoutChecker from "./PopupLayoutChecker";
import PopupBannerUnsubscribe from "./PopupBannerUnsubscribe";

export const phoneShowFormat = (phone: string | undefined): string => {
  if (!phone) return "";
  if (phone.length <= 6) return phone;
  const first = phone.slice(0, 3);
  const last = phone.slice(-3);
  const masked = "•".repeat(phone.length - 6);
  return `${first}${masked}${last}`;
};

// --- Decorative Background Subcomponents ---

const DarkModeBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* Hexagon Pattern Grid on the Right */}
    <div className="absolute right-0 top-1/4 w-80 h-96 opacity-5 text-yellow-main">
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3">
        <pattern id="hex-dark" width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
          <path d="M 10 0 L 5 2.89 L 0 0 L 0 5.77 L 5 8.66 L 10 5.77 Z M 0 8.66 L 5 11.55 L 0 14.43 L 0 20.21 L 5 23.09 L 10 20.21 L 10 14.43 L 5 11.55 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </pattern>
        <rect width="100" height="100" fill="url(#hex-dark)" />
      </svg>
    </div>

    {/* Circuit lines on the left */}
    <svg className="absolute left-0 top-10 w-64 h-96 text-yellow-main/5" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="0.6">
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

// --- Custom Console-Notched Card Container ---

const SettingsCard = ({
  children,
  onClick,
  isDark,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isDark: boolean;
  variant: "gold" | "grey";
}) => {
  const borderClass = isDark
    ? variant === "gold"
      ? "border-yellow-main/20 hover:border-yellow-main/40"
      : "border-white/10 hover:border-white/20"
    : variant === "gold"
      ? "border-yellow-v1/30 hover:border-yellow-v1/50"
      : "border-black-v5/20 hover:border-black-v5/40";

  const bgClass = isDark
    ? "bg-card/45 hover:bg-card/65"
    : "bg-white hover:bg-slate-50 shadow-sm";

  return (
    <button
      onClick={onClick}
      className={`w-full py-4 px-5 flex items-center justify-between rounded-2xl border ${borderClass} ${bgClass} transition-all duration-200 active:scale-[0.98] group`}
    >
      {children}
    </button>
  );
};

// --- Custom Console-Notched Mini Badge ---

const BeveledBadge = ({
  children,
  isDark,
  variant,
}: {
  children: React.ReactNode;
  isDark: boolean;
  variant: "gold" | "grey";
}) => {
  const borderClass = isDark
    ? variant === "gold"
      ? "border-yellow-main/25"
      : "border-white/10"
    : variant === "gold"
      ? "border-yellow-v1/30"
      : "border-black-v5/20";

  const bgClass = isDark
    ? "bg-card/60"
    : variant === "gold"
      ? "bg-yellow-main/10"
      : "bg-black-v5/10";

  const textClass = isDark
    ? variant === "gold"
      ? "text-yellow-main"
      : "text-white/90"
    : variant === "gold"
      ? "text-yellow-v1"
      : "text-black-v1";

  return (
    <div className={`flex items-center justify-center gap-2 py-1.5 px-4 rounded-full border ${borderClass} ${bgClass} ${textClass} font-bold text-xs shadow-sm`}>
      {children}
    </div>
  );
};

// --- Custom Badge Icons ---

const MenuIconBadge = ({
  iconStyle,
  icon: Icon,
  isDark,
}: {
  iconStyle: string;
  icon: any;
  isDark: boolean;
}) => {
  if (iconStyle === "grey" || iconStyle === "unsubscribe") {
    return (
      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-black-v3/5 border border-white/10 rounded-full shadow-[0_0_8px_rgba(70,70,70,0.1)]" />
            <Icon className="w-5 h-5 text-black-v5 relative z-10" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 border-2 border-black-v5/25 bg-black-v5/10 rounded-full shadow-inner" />
            <Icon className="w-5 h-5 text-black-v2 relative z-10" />
          </>
        )}
      </div>
    );
  }

  // Brand Gold/Yellow layout
  return (
    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-yellow-main/5 border border-yellow-main rounded-xl shadow-[0_0_8px_rgba(254,203,19,0.15)]" />
          <div className="absolute inset-1 border border-dashed border-yellow-main/10 rounded-lg" />
          <Icon className="w-5 h-5 text-yellow-main relative z-10" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 border-2 border-yellow-main/30 bg-yellow-main/10 rounded-xl shadow-inner" />
          <Icon className="w-5 h-5 text-yellow-v1 relative z-10" />
        </>
      )}
    </div>
  );
};

// --- Main SettingsPageNew Component ---

export default function SettingsPageNew() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const { data } = useAppSelector((state) => state.profile);
  const user = data?.data?.userInfo;

  const [showModal, setShowModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("1.png");
  const [loading, setLoading] = useState(false);
  const [showLayoutPopup, setShowLayoutPopup] = useState(false);
  const [showUnsubscribePopup, setShowUnsubscribePopup] = useState(false);

  const confirmUnsubscribe = async () => {
    try {
      await dispatch(unsubscribeUser() as any).unwrap();
    } catch (e) {
      console.error("Unsubscribe error:", e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLayoutPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const isDark = resolvedTheme === "dark";

  // useEffect(() => {
  //   if (!data) dispatch(getProfileInfo());
  // }, [dispatch, data]);

  useEffect(() => {
    if (user?.user_profile_img) setSelectedAvatar(`${user.user_profile_img}.png`);
  }, [user]);

  const handleSaveAvatar = async (imgUrlName: string) => {
    setLoading(true);
    try {
      const imgName = imgUrlName.split(".")[0];
      await dispatch(updateProfileImageThunk({ profileImg: imgName })).unwrap();
      setSelectedAvatar(imgUrlName);
      setShowModal(false);
      dispatch(getProfileInfo());
    } catch (e) {
      console.error("Failed to update profile image:", e);
    } finally {
      setLoading(false);
    }
  };

  const avatars = Array.from({ length: 15 }, (_, i) => `${i + 1}.png`);

  const menuItems = [
    {
      to: "/notification",
      icon: Bell,
      label: t?.notifications || "Notifications",
      sub: "Bids & updates",
      badge: "Manage",
      variant: "gold" as const,
      iconStyle: "notifications",
    },
    {
      to: "/tournament-history",
      icon: Trophy,
      label: "Tournament History",
      sub: "Your past match records",
      badge: "View",
      variant: "gold" as const,
      iconStyle: "tournament-history",
    },
    {
      to: "/privacy-policy",
      icon: Shield,
      label: t?.privacyPolicy || "Privacy Policy",
      sub: "Guidelines & rules",
      badge: "Read",
      variant: "gold" as const,
      iconStyle: "privacy",
    },
    {
      to: "/terms",
      icon: FileText,
      label: t?.termsAndConditions || "Terms & Conditions",
      sub: "User agreement",
      badge: "Read",
      variant: "gold" as const,
      iconStyle: "terms",
    },
    {
      to: "/profile",
      icon: LogOut,
      label: "Unsubscribe",
      sub: "Leave the service",
      badge: "Leave",
      variant: "grey" as const,
      iconStyle: "unsubscribe",
    },
  ];

  return (
    <>
      <TopBar />
      <div className="relative bg-background text-foreground overflow-hidden transition-colors duration-300 min-h-[calc(100vh-165px)] pb-10">
        {isDark ? <DarkModeBackground /> : <LightModeBackground />}

        <div className="relative z-10">
          {/* Profile Card Section */}
          <div className="flex flex-col items-center pt-2 pb-5 px-4">
            <div className="mb-4">
              <HexagonalAvatarFrame
                imageUrl={`/assets/users/${selectedAvatar}`}
                onEditClick={() => setShowModal(true)}
                isDark={isDark}
              />
            </div>

            {/* Phone pill badge */}
            <div className="mb-3 flex justify-center">
              <BeveledBadge isDark={isDark} variant="grey">
                {/* <Phone className="w-3.5 h-3.5 text-black-v3 dark:text-white/60 flex-shrink-0" /> */}
                <span className="text-sm font-bold tracking-[1.5px] select-none">
                  976xxxx876
                </span>
              </BeveledBadge>
            </div>

            {/* Split Joined & Subscription details */}
            <div className="flex items-center gap-3 w-full max-w-sm px-5 mt-2 justify-center">
              {/* Joined Date Badge */}
              <div className="flex-1">
                <BeveledBadge isDark={isDark} variant="grey">
                  <Calendar className="w-3.5 h-3.5 text-black-v3 dark:text-white/60 flex-shrink-0" />
                  <span className="text-[11px] font-bold tracking-[0.5px] select-none text-center whitespace-nowrap">
                    Joined 12 Jun 2025
                  </span>
                </BeveledBadge>
              </div>

              {/* Subscription Badge */}
              <div className="flex-1">
                <BeveledBadge isDark={isDark} variant="gold">
                  <Zap className="w-3.5 h-3.5 text-yellow-v1 dark:text-yellow-main flex-shrink-0" />
                  <span className="text-[11px] font-bold tracking-[0.5px] select-none text-center whitespace-nowrap">
                    Pack: 700 Pk
                  </span>
                </BeveledBadge>
              </div>
            </div>
          </div>

          {/* Thin elegant separator */}
          <div className="h-px mx-5 bg-gradient-to-r from-transparent via-black-v5 dark:via-yellow-main/20 to-transparent mb-6" />

          {/* Interactive Menu List */}
          <div className="px-5 flex flex-col gap-4 max-w-md mx-auto">
            {menuItems.map(({ to, icon: Icon, label, sub, badge, variant, iconStyle }) => (
              <SettingsCard
                key={to}
                onClick={() => {
                  if (label === "Unsubscribe") {
                    setShowUnsubscribePopup(true);
                  } else {
                    navigate(to);
                  }
                }}
                isDark={isDark}
                variant={variant}
              >
                <div className="flex items-center gap-4">
                  <MenuIconBadge iconStyle={iconStyle} icon={Icon} isDark={isDark} />

                  <div className="text-left">
                    <p className={`text-sm font-bold tracking-[1.5px] transition-colors duration-200 ${isDark
                      ? variant === "gold" ? "text-yellow-main" : "text-white/90"
                      : "text-black-v1"
                      }`}>
                      {label}
                    </p>
                    <p className={`text-xs font-semibold tracking-[0.5px] mt-0.5 ${isDark ? "text-white/80" : "text-black-v3"}`}>
                      {sub}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-3 py-1.5 rounded-full tracking-[1.5px] border transition-all duration-200 ${isDark
                    ? variant === "gold"
                      ? "border-yellow-main text-yellow-main bg-yellow-main/5 group-hover:bg-yellow-main/10"
                      : "border-white/20 text-white/90 bg-white/5 group-hover:bg-white/10"
                    : variant === "gold"
                      ? "border-yellow-v1 text-yellow-v1 bg-yellow-main/5"
                      : "border-black-v5 text-black-v2 bg-black-v5/10"
                    }`}>
                    {badge}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 ${isDark
                    ? variant === "gold" ? "text-yellow-main" : "text-white/60"
                    : "text-black-v4"
                    }`} />
                </div>
              </SettingsCard>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-sm bg-card border border-border border-b-0 rounded-t-[2rem] p-5 z-10">
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-5" />
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

            <p className="text-center text-[11px] font-bold tracking-[3px] text-foreground mb-4">
              Select Avatar
            </p>

            <div className="grid grid-cols-5 gap-2.5 max-h-56 overflow-y-auto pb-1">
              {avatars.map((item) => {
                const isSelected = selectedAvatar === item;
                return (
                  <div
                    key={item}
                    onClick={() => handleSaveAvatar(item)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${isSelected
                      ? "border-yellow-main scale-105"
                      : "border-border bg-slate-50 dark:bg-slate-900/50 hover:border-yellow-main/40"
                      }`}
                  >
                    <img
                      src={`/assets/users/${item}`}
                      alt="Avatar option"
                      className="w-full h-full object-cover p-1"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-yellow-main rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5 text-blue-main stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-3 rounded-xl bg-muted text-foreground text-[11px] font-bold tracking-[2px] active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <WaitLoader isOverlay />}
      <PopupLayoutChecker
        isShow={showLayoutPopup}
        onClose={() => setShowLayoutPopup(false)}
        targetRoute="/settingsStatic"
      />
      <PopupBannerUnsubscribe
        isShow={showUnsubscribePopup}
        onClose={() => setShowUnsubscribePopup(false)}
        onConfirm={confirmUnsubscribe}
        confirmText="Confirm Unsubscribe"
        data={{
          title: "Unsubscribe",
          description: "Do you really want to unsubscribe? You will lose access to all your play coins and leaderboard benefits.",
        }}
      />
      <BottomNavBar />
    </>
  );
}