import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Camera,
  Phone,
  FileText,
  LogOut,
  ChevronRight,
  Gavel,
  Trophy,
  Gem,
  Pencil,
  Crown,
  Sparkle,
} from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getProfileInfo, unsubscribeUser } from "@/features/bidProfile/profileSlice";
import { logout } from "@/features/auth/authSlice";
import dayjs from "dayjs";
import PopupBannerUnsubscribe from "./PopupBannerUnsubscribe";
import PopupAvatarSelector from "./PopupAvatarSelector";
import { hasSubscriptionAccess } from "@/utils/subscriptionUtils";
import { useNavigate } from "react-router-dom";
import { updateProfileImageThunk } from "@/features/bidProfile/updateProfileSlice";
import WaitLoader from "./Loader";
import { useTheme } from "next-themes";
import { HexagonalAvatarFrame } from "./HexagonalAvatarFrame";

const formatDateTime = (dateTimeString) => {
  const d = dayjs(dateTimeString);

  return {
    date: d.format("D MMM YYYY").toUpperCase(),
    time: d.format("h:mm A"),
  };
};

const maskMSISDN = (phone: string) => {
  if (!phone || phone.length < 12) return phone;

  // Remove first 2 digits (country code like 95)
  const trimmed = phone.slice(2);

  // Ensure it's 10 digits after trimming
  if (trimmed.length !== 10) return phone;

  const start = trimmed.slice(0, 3);
  const end = trimmed.slice(-3);

  return `${start}xxxx${end}`;
};

export default function ProfilePage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isEditingImage, setIsEditingImage] = useState(false);
  const { t, language, changeLanguage } = useLanguage();
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.profile);
  const user = data?.data?.userInfo || [];
  const [selectedAvatar, setSelectedAvatar] = useState<string>("1.png");
  const [showUnsubscribePopup, setShowUnsubscribePopup] = useState(false);
  const navigate = useNavigate();
  const dValidTill = data?.data?.dValidTill;
  const hasAccess = useMemo(() => hasSubscriptionAccess(user, dValidTill), [user, dValidTill]);

  useEffect(() => {
    if (!data) {
      dispatch(getProfileInfo() as any);
    }
  }, [dispatch, data]);





  const handleSaveAvatar = async () => {
    try {
      const imgName = selectedAvatar.split(".")[0];
      await dispatch(updateProfileImageThunk({ profileImg: imgName })).unwrap();
      setIsEditingImage(false);
      // Refresh profile info to reflect the new avatar
      dispatch(getProfileInfo() as any);
    } catch (error) {
      console.error("Failed to update profile image:", error);
    }
  };

  const handleTermsClick = () => {
    console.log("Navigate to Terms of Use");
    navigate("/terms")
    // navigate("/terms");
  };

  const handleUnsubscribe = () => {
    console.log("Unsubscribe clicked");
    // Show confirmation dialog
    setShowUnsubscribePopup(true);
  };

  const confirmUnsubscribe = async () => {
    try {
      const res = await dispatch(unsubscribeUser() as any).unwrap();

      if (res?.status === "success" || res?.status === true) {
        dispatch(logout());
        // Redirect to billing URL
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Unsubscription failed:", error);
    } finally {
      setShowUnsubscribePopup(false);
    }
  };

  return (
    <>
      <TopBar />
      <div className=" p-2">
        {/* <div className="h-[100vh] fixed w-full top-0 left-0 z-[-1] overflow-hidden">
          <img
            src="/assets/images/biddingPage.png"
            className="w-full h-full object-cover"
            alt="Background"
          />
        </div> */}
        {/* Header Section */}
        <div className="relative gradient-home-section active:from-purple-700 active:to-rose-700 pt-6 pb-32 px-3 overflow-hidden rounded-2xl">
          {/* Animated Background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-2xl" />

          <div className="relative z-10 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white ">
                {t.myProfile}
              </h1>
            </div>

            <p className="text-center text-white/90 text-sm font-semibold ">
              {t.manageAccount}
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative z-10 -mt-[7rem] px-3 max-w-md mx-auto">
          <div className="bg-white  rounded-2xl shadow-xl border border-gray-100/40 overflow-hidden">
            {/* Profile Image Section */}
            <div className="relative pt-2">
              <div className="flex flex-col items-center mx-2 bg-white rounded-xl">
                {/* Avatar with Hexagonal Frame */}
                <HexagonalAvatarFrame
                  imageUrl={`/assets/users/${selectedAvatar}`}
                  onEditClick={() => setIsEditingImage(true)}
                  isDark={isDark}
                />

                {/* Phone Number */}
                <div className="mt-4 flex p-1 items-center gap-2  bg-gradient-to-r from-[#d40862bf] to-[#4c4496d4] rounded-2xl shadow-xl shadow-violet-200/50 ">
                  {/* <Phone className="w-3.5 h-3.5 text-white animate-pulse" /> */}
                  <span className="text-sm rounded-xl font-bold text-white tracking-[1.5px] border-2 border-dashed border-white px-4 py-1.5">
                    {maskMSISDN(user?.user_phone) || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-2 p-3 px-2">
              <StatCard
                label={t.bids}
                value={data?.data?.userBidsCount || "0"}
                icon={<Gavel className="w-5 h-5 text-blue-600" />}
                color="blue"
              />
              <StatCard
                label={t.wins}
                value={data?.data?.userBidsWinCount || "0"}
                icon={<Trophy className="w-5 h-5 text-orange-500" />}
                color="gold"
              />
              <StatCard
                label={t.diamond || "Diamond"}
                value={data?.data?.userPoints || "0"}
                icon={<img src="/assets/images/diamond5.png" alt="Points" className="w-5 h-5 object-contain" />}
                color="rose"
              />
            </div>

            {/* Action Buttons */}
            <div className="p-2 pt-0 space-y-2">
              {/* Tournament History */}
              <button
                onClick={() => navigate("/tournament-history")}
                className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 active:from-amber-100 active:to-orange-200 rounded-xl border border-amber-400 transition-all duration-150 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-gray-800 ">
                      {t.tournamentHistory || "Tournament History"}
                    </h3>
                    <p className="text-sm text-gray-500 font-semibold ">
                      {t.viewPastTournaments || "View your past tournament rankings & prizes"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* Terms of Use */}
              <button
                onClick={handleTermsClick}
                className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-violet-50 to-indigo-50 active:from-violet-100 active:to-indigo-200 rounded-xl border border-violet-400 transition-all duration-150 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-gray-800 ">
                      {t.terms}
                    </h3>
                    <p className="text-sm text-gray-500 font-semibold ">
                      {t.readPolicies}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>




              {/* Language Selector */}
              <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-400">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    🌐
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 ">
                      {t.language}
                    </h3>
                    <p className="text-sm text-gray-500 font-semibold ">
                      {language === "en" ? t.english : t.burmese}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`px-2 py-1 rounded text-sm font-semibold  ${language === "en"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    En
                  </button>

                  <button
                    onClick={() => changeLanguage("my")}
                    className={`px-2 py-1 rounded text-sm font-semibold  ${language === "my"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    Mm
                  </button>
                </div>
              </div>
              {/* Subscribe Now (Only if no access and not suspended) */}
              {!hasAccess && user?.user_subscription_status?.toLowerCase() !== "suspend" && (
                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full relative overflow-hidden group p-3 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 rounded-[2rem] shadow-2xl transition-all duration-300 active:scale-[0.98] border border-white/10"
                >
                  {/* Decorative Sparkles */}
                  <div className="absolute top-2 left-12 animate-pulse">
                    <Sparkle className="w-3 h-3 text-yellow-400" />
                  </div>
                  <div className="absolute bottom-4 right-10 animate-bounce delay-700">
                    <Sparkle className="w3 h-3 text-yellow-500 " />
                  </div>
                  <div className="absolute top-4 right-20 animate-pulse delay-300">
                    <Sparkle className="w-3 h-3 text-yellow-400 " />
                  </div>

                  <div className="relative flex items-center justify-between gap-4 z-10">
                    {/* Diamond Icon Container */}
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 blur-md opacity-20 animate-pulse" />
                        <Gem className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="relative inline-block">
                          {/* Background Glow (Hardware Accelerated Opacity) */}
                          <motion.h3
                            animate={{
                              opacity: [0, 0.8, 0],
                              scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 text-base font-bold text-yellow-300 blur-sm will-change-transform"
                            aria-hidden="true"
                          >
                            {t.subscribeNow}
                          </motion.h3>

                          {/* Foreground Text (Hardware Accelerated Scale) */}
                          <motion.h3
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 text-base font-bold text-yellow-300 will-change-transform"
                          >
                            {t.subscribeNow}
                          </motion.h3>
                        </div>

                      </div>
                      <p className="text-xs text-indigo-100 ">
                        {t.getFullAccess}
                      </p>
                    </div>

                    {/* Action Arrow */}
                    <div className="w-8 h-8 rounded-full gradient-button-gold flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                      <ChevronRight className="w-6 h-6 text-yellow-900 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
              )}


              {/* Unsubscribe (Only if has access) */}
              {hasAccess && (
                <button
                  onClick={handleUnsubscribe}
                  className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-rose-50 to-red-50 active:from-rose-100 active:to-red-100 rounded-xl border border-rose-500 shadow-sm transition-all duration-150 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-bold text-gray-800">
                        {t.unsubscribe}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500">
                        {t.leaveService}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-rose-600" />
                </button>
              )}


            </div>

            {/* Account Info */}
            {/* <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Shield className="w-3.5 h-3.5" />
                                <span className="font-bold">Account ID: #USER12345</span>
                            </div>
                        </div> */}
          </div>

          {/* Additional Info Card */}
          <div className="mt-4 gradient-home-section active:from-purple-700 active:to-rose-700 rounded-2xl shadow-md border border-gray-100 p-4">
            <div className="text-sm font-bold mb-3 text-center">
              <h3 className="text-base font-bold text-white mb-3 ">
                {t.accountInfo}
              </h3>
            </div>
            <div className="space-y-2.5">
              {/* <InfoRow label={t.memberSince} value="Dec 2024" />
              <InfoRow label={t.status} value="Active" badge />
              <InfoRow label={t.subscription} value={t.plan} /> */}

              <InfoRow
                label={t.memberSince}
                value={formatDateTime(user?.user_added_on)?.date || "N/A"}
              />

              <InfoRow
                label={t.status}
                value={
                  hasAccess
                    ? t.active
                    : user?.user_subscription_status === "unsub"
                      ? t.notSubscribed
                      : t.inactive
                }
                badge
                badgeClassName={
                  hasAccess
                    ? "bg-emerald-100 text-emerald-700"
                    : user?.user_subscription_status === "unsub"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                }
              />
              {hasAccess && data?.data?.subscriptionPlan && (
                <InfoRow label={t.subscription} value={data?.data?.subscriptionPlan === "weekly" ? t.weeklyPack : t.dailyPack} />
              )}
            </div>
          </div>
        </div>

        {/* Avatar Selector Component */}
        <PopupAvatarSelector
          isShow={isEditingImage}
          onClose={() => setIsEditingImage(false)}
          selectedAvatar={selectedAvatar}
          onSelect={setSelectedAvatar}
          onSave={handleSaveAvatar}
        />
      </div>

      <AnimatePresence>
        {showUnsubscribePopup && (
          <PopupBannerUnsubscribe
            isShow={showUnsubscribePopup}
            onClose={() => setShowUnsubscribePopup(false)}
            onConfirm={confirmUnsubscribe}
            confirmText={t.confirm}
            data={{
              title: t.areYouSure,
              description: t.confirmUnsubscribeMessage,
              image: true,
              autoCloseTimer: 0,
            }}
          />
        )}
      </AnimatePresence>
      <BottomNavBar />
      {status === "loading" && <WaitLoader isOverlay />}
    </>
  );
}

const StatCard = React.memo(({ label, value, icon, color }: any) => {
  const themes: any = {
    blue: "from-blue-500 to-blue-600 shadow-blue-200/50",
    gold: "from-orange-400 to-orange-500 shadow-orange-200/50",
    rose: "from-rose-500 to-pink-600 shadow-rose-200/50",
  };

  const theme = themes[color] || themes.blue;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${theme} rounded-2xl p-2 flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95`}
    >
      <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex-shrink-0 flex items-center justify-center z-10">
        {icon}
      </div>
      <div className="flex flex-col z-10 min-w-0 flex-1">
        <span className="text-sm font-black text-white leading-tight truncate">
          {value}
        </span>
        <span className="text-[10px] font-semibold text-white leading-relaxed mt-0.5">
          {label}
        </span>
      </div>
      {/* Subtle Background Glow */}
      <div
        className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full blur-xl opacity-30 bg-white/20`}
      />
    </div>
  );
});

const InfoRow = React.memo(({ label, value, badge = false, badgeClassName = "" }: any) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ">
      <span className="text-sm font-semibold text-white">{label}</span>
      {badge ? (
        <span className={`p-2 rounded-lg text-sm font-semibold ${badgeClassName || "bg-emerald-100 text-emerald-700"}`}>
          {value}
        </span>
      ) : (
        <span className="text-xs font-bold text-white">{value}</span>
      )}
    </div>
  );
});
