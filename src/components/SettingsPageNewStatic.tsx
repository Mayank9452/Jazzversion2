import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronRight, Bell, Shield, FileText,
    LogOut, Check, Phone, Calendar, Zap, Trophy,
    ArrowLeft, MessageSquare, Pencil, Gamepad2, Coins, Clock
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
import PopupBannerUnsubscribe from "./PopupBannerUnsubscribe";
import { TopBarUpdated } from "./TopBarUpdated";
// Helper function to format phone number
const phoneShowFormat = (phone: string | undefined): string => {
    if (!phone) return "";
    if (phone.length <= 6) return phone;
    const first = phone.slice(0, 3);
    const last = phone.slice(-3);
    const masked = "•".repeat(phone.length - 6);
    return `${first}${masked}${last}`;
};
export default function SettingsPageNewStatic() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useLanguage();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { data } = useAppSelector((state) => state.profile);
    const user = data?.data?.userInfo;
    const [showModal, setShowModal] = useState(false);
    const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string>("1.png");
    const [showUnsubscribePopup, setShowUnsubscribePopup] = useState(false);

    const confirmUnsubscribe = async () => {
        try {
            await dispatch(unsubscribeUser() as any).unwrap();
            setSubStatus("Unsubscribed");
        } catch (e) {
            console.error("Unsubscribe error:", e);
            setSubStatus("Unsubscribed");
        }
    };
    const [loading, setLoading] = useState(false);
    // Cover image URL state & error handling (285x380 portrait gaming banner)
    const [coverImg, setCoverImg] = useState<string>("https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=800&q=80");

    // Account Information details (Daily or Weekly pack, Subscribed or Unsubscribed status)
    const [subPack, setSubPack] = useState<"Daily" | "Weekly">("Daily");
    const [subStatus, setSubStatus] = useState<"Subscribed" | "Unsubscribed">("Subscribed");
    const isDark = resolvedTheme === "dark";
    useEffect(() => {
        if (user?.user_profile_img) {
            setSelectedAvatar(`${user.user_profile_img}.png`);
        }
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
            // Fallback local update if network is mock
            setSelectedAvatar(imgUrlName);
            setShowModal(false);
        } finally {
            setLoading(false);
        }
    };
    const avatars = Array.from({ length: 15 }, (_, i) => `${i + 1}.png`);
    return (
        <>
            <TopBarUpdated />
            <div className="relative bg-[#F8F9FA] dark:bg-black text-foreground overflow-x-hidden min-h-screen pb-16 transition-colors duration-300">
                {/* Glow effects for glassmorphism backdrop (hidden in dark mode) */}
                <div className="absolute top-[300px] -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0 dark:hidden" />
                <div className="absolute top-[600px] -right-20 w-80 h-80 bg-yellow-main/5 rounded-full blur-[120px] pointer-events-none z-0 dark:hidden" />

                {/* Absolute Banner Background (285x380 portrait aspect ratio template) */}
                <div className="absolute top-0 left-0 w-full aspect-[285/380] min-h-[300px] max-h-[460px] bg-neutral-900 overflow-hidden z-0">
                    <img
                        src={coverImg}
                        onError={() => {
                            // Fallback to secondary internet gaming banner if primary fails
                            setCoverImg("https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&h=800&q=80");
                        }}
                        alt="Cover banner"
                        className="w-full h-full object-cover opacity-50"
                    />
                    {/* Theme-aware overlay over cover image */}
                    <div className={`absolute inset-0 z-10 ${isDark 
                        ? "bg-[#000000b8]" 
                        : "bg-gradient-to-b from-white/20 via-white/50 to-[#F8F9FA]"
                        }`} 
                    />
                </div>

                {/* Foreground Content Container */}
                <div className="relative z-10">
                    {/* Navigation and Top Bar Icons */}
                    <div className="pt-4 px-4 flex items-center justify-center">
                        <h1 className="font-extrabold text-base tracking-wider select-none text-slate-800 dark:text-white relative flex flex-col items-center">
                            {t?.myProfile || "My Profile"}
                            <span className="w-8 h-1 bg-[#fecb13] mt-1.5 rounded-full" />
                        </h1>
                    </div>

                    {/* Profile Picture Section */}
                    <div className="mt-4 flex flex-col items-center">
                        <HexagonalAvatarFrame
                            imageUrl={`/assets/users/${selectedAvatar}`}
                            onEditClick={() => setShowModal(true)}
                            isDark={isDark}
                        />
                    </div>

                    {/* User Name & Details Section */}
                    <div className="mt-4 text-center flex flex-col items-center px-4">
                        <h2 className="text-xl font-black tracking-wide text-foreground">
                            <span>{phoneShowFormat(user?.user_phone) || "959xxxx879"}</span>
                        </h2>
                    </div>
                    {/* Statistics Section */}
                    <div className="px-4 mt-6 max-w-md mx-auto grid grid-cols-2 gap-2.5">
                        {/* Total Reward Coins */}
                        <div className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 relative z-10 ${isDark
                            ? "bg-[#ffffff14] backdrop-blur-md border-[#ffffff52] shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                            : "bg-white border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                            }`}>
                            <div className={`p-2 shrink-0 ${isDark ? "rounded-xl bg-amber-500/10" : "rounded-full bg-[#FFF9E6]"}`}>
                                <img
                                    src="/assets/images/img/gold-coin.png"
                                    alt="coin"
                                    className="w-5 h-5 object-contain"
                                />
                            </div>
                            <div className="text-left flex flex-col justify-center leading-none">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Coins</p>
                                <p className="text-base font-black text-foreground mt-1">₹3256</p>
                            </div>
                        </div>

                        {/* Joined Date */}
                        <div className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 relative z-10 ${isDark
                            ? "bg-[#ffffff14] backdrop-blur-md border-[#ffffff52] shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                            : "bg-white border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                            }`}>
                            <div className={`p-2 shrink-0 ${isDark ? "rounded-xl bg-yellow-main/10 text-yellow-main" : "rounded-full bg-[#FFF9E6] text-yellow-main"}`}>
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div className="text-left flex flex-col justify-center leading-none">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Joined Date</p>
                                <p className="text-sm font-black text-foreground mt-1 whitespace-nowrap">12 Jun 2025</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Information Card */}
                    <div className="px-4 mt-6 max-w-md mx-auto">
                        <div className={`p-5 rounded-3xl border relative z-10 transition-all duration-200 ${isDark
                            ? "bg-[#ffffff14] backdrop-blur-md border-[#ffffff52] shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
                            : "bg-white border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                            }`}>
                            <h3 className="text-center text-xs font-black tracking-[1.5px] uppercase text-muted-foreground mb-4">
                                Account Information
                            </h3>

                            <div className="flex flex-col gap-4">
                                {/* Subscription Pack */}
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Subscription Pack</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Your active billing cycle</p>
                                    </div>
                                    {/* Pack Selection Buttons */}
                                    <div className={`flex p-1 rounded-full border border-slate-200/50 dark:border-white/5 flex-shrink-0 ${isDark ? "bg-black" : "bg-[#f4f4f5]"}`}>
                                        <button
                                            onClick={() => setSubPack("Daily")}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide transition-all ${subPack === "Daily"
                                                ? "bg-yellow-main text-black shadow-md"
                                                : "text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            Daily
                                        </button>
                                        <button
                                            onClick={() => setSubPack("Weekly")}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide transition-all ${subPack === "Weekly"
                                                ? "bg-yellow-main text-black shadow-md"
                                                : "text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            Weekly
                                        </button>
                                    </div>
                                </div>
                                {/* Decorative Divider */}
                                <div className="h-px bg-slate-200/60 dark:bg-neutral-800" />
                                {/* Subscription Status */}
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Subscription Status</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Current access status</p>
                                    </div>
                                    {/* Status Toggle Badge */}
                                    <button
                                        onClick={() => setSubStatus(subStatus === "Subscribed" ? "Unsubscribed" : "Subscribed")}
                                        className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider border transition-all flex-shrink-0 ${subStatus === "Subscribed"
                                            ? (isDark ? "bg-yellow-main/10 border-yellow-main/20 text-yellow-main" : "bg-white border-[#fecb13] text-[#fecb13] shadow-sm")
                                            : (isDark ? "bg-neutral-500/10 border-neutral-500/20 text-neutral-500" : "bg-white border-slate-300 text-slate-500 shadow-sm")
                                            }`}
                                    >
                                        {subStatus}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu Links */}
                    <div className="px-4 mt-6 max-w-md mx-auto flex flex-col gap-3">

                        {/* Unsubscribe */}
                        <button
                            onClick={() => setShowUnsubscribePopup(true)}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-[#ffffff14] backdrop-blur-md border-[#ffffff52] hover:bg-red-500/[0.08]"
                                : "bg-white border-slate-100 hover:bg-slate-50 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`p-2 rounded-xl transition-colors duration-200 ${isDark ? "bg-yellow-main/10 text-yellow-main" : "bg-[#FFF9E6] text-[#fecb13]"}`}>
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className={`text-sm font-bold tracking-wide transition-colors duration-200 ${isDark ? "text-yellow-main" : "text-slate-800"}`}>Unsubscribe</p>
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-yellow-main/70" : "text-muted-foreground"}`}>Leave the gaming service</p>
                                </div>
                            </div>
                            <ChevronRight className={`w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 ${isDark ? "text-yellow-main/70" : "text-slate-400"}`} />
                        </button>

                        {/* Notifications */}
                        <button
                            onClick={() => navigate("/notification")}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-[#ffffff14] backdrop-blur-md border-[#ffffff52] shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-white/[0.08] hover:border-white/10"
                                : "bg-white border-slate-100 hover:bg-slate-50 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`p-2 rounded-xl transition-colors duration-200 ${isDark ? "bg-yellow-main/5 text-yellow-main group-hover:bg-yellow-main/10" : "bg-[#FFF9E6] text-[#fecb13]"
                                    }`}>
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold tracking-wide text-foreground">Notifications</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Bids & game updates</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 dark:text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                        {/* Tournament History */}
                        <button
                            onClick={() => navigate("/tournament-history")}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-[#ffffff14] backdrop-blur-md border-[#ffffff52] shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-white/[0.08] hover:border-white/10"
                                : "bg-white border-slate-100 hover:bg-slate-50 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`p-2 rounded-xl transition-colors duration-200 ${isDark ? "bg-yellow-main/5 text-yellow-main group-hover:bg-yellow-main/10" : "bg-[#FFF9E6] text-[#fecb13]"
                                    }`}>
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold tracking-wide text-foreground">Tournament History</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Your past match records</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 dark:text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                        {/* Privacy Policy */}
                        <button
                            onClick={() => navigate("/privacy-policy")}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-[#ffffff14] backdrop-blur-md border-[#ffffff52] shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-white/[0.08] hover:border-white/10"
                                : "bg-white border-slate-100 hover:bg-slate-50 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`p-2 rounded-xl transition-colors duration-200 ${isDark ? "bg-yellow-main/5 text-yellow-main group-hover:bg-yellow-main/10" : "bg-[#FFF9E6] text-[#fecb13]"
                                    }`}>
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold tracking-wide text-foreground">Privacy Policy</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Guidelines & user rules</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 dark:text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                        {/* Terms & Conditions */}
                        <button
                            onClick={() => navigate("/terms")}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-[#ffffff14] backdrop-blur-md border-[#ffffff52] shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-white/[0.08] hover:border-white/10"
                                : "bg-white border-slate-100 hover:bg-slate-50 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`p-2 rounded-xl transition-colors duration-200 ${isDark ? "bg-yellow-main/5 text-yellow-main group-hover:bg-yellow-main/10" : "bg-[#FFF9E6] text-[#fecb13]"
                                    }`}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold tracking-wide text-foreground">Terms & Conditions</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">User agreement documentation</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>

                    </div>

                </div>
            </div>
            {/* Avatar Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 border-b-0 rounded-t-[2.5rem] p-6 z-10 animate-in slide-in-from-bottom duration-300">
                        <div className="w-12 h-1 bg-neutral-700 rounded-full mx-auto mb-5" />

                        <h3 className="text-center text-xs font-extrabold tracking-[3px] text-white uppercase mb-5">
                            Select Avatar
                        </h3>
                        <div className="grid grid-cols-5 gap-3 max-h-64 overflow-y-auto pr-1">
                            {avatars.map((item) => {
                                const isSelected = selectedAvatar === item;
                                return (
                                    <button
                                        key={item}
                                        onClick={() => handleSaveAvatar(item)}
                                        className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${isSelected
                                            ? "border-yellow-main scale-105 shadow-[0_0_12px_rgba(254,203,19,0.3)]"
                                            : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                                            }`}
                                    >
                                        <img
                                            src={`/assets/users/${item}`}
                                            alt="Avatar option"
                                            className="w-full h-full object-cover p-1"
                                        />
                                        {isSelected && (
                                            <div className="absolute top-1 right-1 bg-yellow-main rounded-full p-0.5">
                                                <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-6 w-full py-3.5 rounded-2xl bg-neutral-800 text-white text-xs font-bold tracking-[2px] hover:bg-neutral-700 transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
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
            {loading && <WaitLoader isOverlay />}
            <BottomNavBar />
        </>
    );
}
