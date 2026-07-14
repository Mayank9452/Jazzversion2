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
import { getProfileInfo } from "@/features/bidProfile/profileSlice";
import { updateProfileImageThunk } from "@/features/bidProfile/updateProfileSlice";
import WaitLoader from "./Loader";
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
            <TopBar />
            <div className="relative bg-background text-foreground overflow-x-hidden transition-colors duration-300">
                {/* Glow effects for glassmorphism backdrop */}
                <div className="absolute top-[300px] -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
                <div className="absolute top-[600px] -right-20 w-80 h-80 bg-yellow-main/5 rounded-full blur-[120px] pointer-events-none z-0" />

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
                    {/* Dark gradient transitioning to background color at the bottom */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-background/20 to-background z-10" />
                </div>

                {/* Foreground Content Container */}
                <div className="relative z-10">
                    {/* Navigation and Top Bar Icons */}
                    <div className="pt-4 px-4 flex items-center justify-center">
                        {/* <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center text-white bg-black/40 hover:bg-black/60 w-9 h-9 rounded-full backdrop-blur-md transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button> */}
                        <h1 className="text-white font-bold text-base tracking-wider select-none">
                            {t?.myProfile || "My Profile"}
                        </h1>
                        {/* <div className="flex items-center gap-2">
                            <button className="flex items-center justify-center text-white bg-black/40 hover:bg-black/60 w-9 h-9 rounded-full backdrop-blur-md transition-all active:scale-95">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center justify-center text-white bg-black/40 hover:bg-black/60 w-9 h-9 rounded-full backdrop-blur-md transition-all active:scale-95"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                        </div> */}
                    </div>

                    {/* Profile Picture Section */}
                    <div className="mt-8 flex flex-col items-center">
                        <div
                            onClick={() => setShowModal(true)}
                            className="relative w-24 h-24 rounded-full border-4 border-[#ffbc00] shadow-2xl overflow-visible group cursor-pointer bg-brand-gradient"
                        >
                            <img
                                src={`/assets/users/${selectedAvatar}`}
                                alt="Profile avatar"
                                className="w-full h-full object-cover rounded-full p-0.5"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                <Pencil className="w-4 h-4 text-white" />
                            </div>
                            {/* Active Green Badge */}
                            <div className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-green-500 rounded-full border-2 border-background shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        </div>
                    </div>

                    {/* User Name & Details Section */}
                    <div className="mt-4 text-center flex flex-col items-center px-4">
                        <h2 className="text-xl font-black tracking-wide text-foreground">
                            <span>{phoneShowFormat(user?.user_phone) || "959xxxx879"}</span>
                        </h2>
                        {/* <p className="text-xs font-semibold text-muted-foreground mt-1 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{phoneShowFormat(user?.user_phone) || "959•••••••"}</span>
                        </p> */}
                    </div>
                    {/* 3-and-2 Statistics Section */}
                    <div className="px-4 mt-6 max-w-md mx-auto flex flex-col gap-3">

                        {/* Row 1: 3 stats */}
                        <div className="grid grid-cols-3 gap-2.5">
                            {/* Tournament Played */}
                            <div className={`p-3 rounded-2xl border flex flex-col items-start justify-between transition-all duration-200 relative z-10 ${isDark
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                                : "bg-white/40 backdrop-blur-md border-black/5 shadow-sm"
                                }`}>
                                <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-500">
                                    <Gamepad2 className="w-4 h-4" />
                                </div>
                                <div className="mt-2 text-left">
                                    <p className="text-lg font-black tracking-tight text-foreground">250</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5 leading-tight">
                                        Played
                                    </p>
                                </div>
                            </div>
                            {/* Tournament Won */}
                            <div className={`p-3 rounded-2xl border flex flex-col items-start justify-between transition-all duration-200 relative z-10 ${isDark
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                                : "bg-white/40 backdrop-blur-md border-black/5 shadow-sm"
                                }`}>
                                <div className="p-1.5 rounded-xl bg-yellow-main/10 text-yellow-main">
                                    <Trophy className="w-4 h-4" />
                                </div>
                                <div className="mt-2 text-left">
                                    <p className="text-lg font-black tracking-tight text-foreground">145</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5 leading-tight">
                                        Won
                                    </p>
                                </div>
                            </div>
                            {/* Total Reward Coins */}
                            <div className={`p-3 rounded-2xl border flex flex-col items-start justify-between transition-all duration-200 relative z-10 ${isDark
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                                : "bg-white/40 backdrop-blur-md border-black/5 shadow-sm"
                                }`}>
                                <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
                                    <Coins className="w-4 h-4" />
                                </div>
                                <div className="mt-2 text-left">
                                    <p className="text-lg font-black tracking-tight text-foreground">₹3256</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5 leading-tight">
                                        Coins
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Row 2: 2 stats */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {/* Joined Date */}
                            <div className={`p-3.5 rounded-2xl border flex flex-col items-start justify-between transition-all duration-200 relative z-10 ${isDark
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                                : "bg-white/40 backdrop-blur-md border-black/5 shadow-sm"
                                }`}>
                                <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="mt-2 text-left">
                                    <p className="text-sm font-black text-foreground">12 Jun 2025</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5 leading-tight">
                                        Joined Date
                                    </p>
                                </div>
                            </div>
                            {/* Last Visit */}
                            <div className={`p-3.5 rounded-2xl border flex flex-col items-start justify-between transition-all duration-200 relative z-10 ${isDark
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
                                : "bg-white/40 backdrop-blur-md border-black/5 shadow-sm"
                                }`}>
                                <div className="p-1.5 rounded-xl bg-sky-500/10 text-sky-500">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div className="mt-2 text-left">
                                    <p className="text-sm font-black text-foreground">Today</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5 leading-tight">
                                        Last Visit
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Navigation Menu Links */}
                    <div className="px-4 mt-6 max-w-md mx-auto flex flex-col gap-3">

                        {/* Notifications */}
                        <button
                            onClick={() => navigate("/notification")}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-white/[0.08] hover:border-white/10"
                                : "bg-white/40 backdrop-blur-md border-black/5 hover:bg-white/60 shadow-sm"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`p-2 rounded-xl transition-colors duration-200 ${isDark ? "bg-yellow-main/5 text-yellow-main group-hover:bg-yellow-main/10" : "bg-yellow-main/10 text-yellow-v1"
                                    }`}>
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold tracking-wide text-foreground">Notifications</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Bids & game updates</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                        {/* Tournament History */}
                        <button
                            onClick={() => navigate("/tournament-history")}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-white/[0.08] hover:border-white/10"
                                : "bg-white/40 backdrop-blur-md border-black/5 hover:bg-white/60 shadow-sm"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`p-2 rounded-xl transition-colors duration-200 ${isDark ? "bg-yellow-main/5 text-yellow-main group-hover:bg-yellow-main/10" : "bg-yellow-main/10 text-yellow-v1"
                                    }`}>
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold tracking-wide text-foreground">Tournament History</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Your past match records</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                        {/* Privacy Policy */}
                        <button
                            onClick={() => navigate("/privacy-policy")}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-white/[0.08] hover:border-white/10"
                                : "bg-white/40 backdrop-blur-md border-black/5 hover:bg-white/60 shadow-sm"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`p-2 rounded-xl transition-colors duration-200 ${isDark ? "bg-yellow-main/5 text-yellow-main group-hover:bg-yellow-main/10" : "bg-yellow-main/10 text-yellow-v1"
                                    }`}>
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold tracking-wide text-foreground">Privacy Policy</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Guidelines & user rules</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                        {/* Terms & Conditions */}
                        <button
                            onClick={() => navigate("/terms")}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-white/[0.08] hover:border-white/10"
                                : "bg-white/40 backdrop-blur-md border-black/5 hover:bg-white/60 shadow-sm"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`p-2 rounded-xl transition-colors duration-200 ${isDark ? "bg-yellow-main/5 text-yellow-main group-hover:bg-yellow-main/10" : "bg-yellow-main/10 text-yellow-v1"
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
                        {/* Unsubscribe */}
                        <button
                            onClick={() => setShowUnsubscribeModal(true)}
                            className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 active:scale-[0.98] group relative z-10 ${isDark
                                ? "bg-red-500/[0.03] backdrop-blur-md border-red-500/10 hover:bg-red-500/[0.08]"
                                : "bg-red-50/40 backdrop-blur-md border-red-100 hover:bg-red-50 shadow-sm"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold tracking-wide text-red-500">Unsubscribe</p>
                                    <p className="text-xs text-red-500/70 mt-0.5">Leave the gaming service</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-red-500/70 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                    </div>
                    {/* Account Information Card */}
                    <div className="px-4 mt-6 max-w-md mx-auto">
                        <div className={`p-5 rounded-3xl border relative z-10 transition-all duration-200 ${isDark
                            ? "bg-white/[0.03] backdrop-blur-md border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
                            : "bg-white/40 backdrop-blur-md border-black/5 shadow-sm"
                            }`}>
                            <h3 className="text-xs font-black tracking-[1.5px] uppercase text-muted-foreground mb-4">
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
                                    <div className="flex bg-neutral-100 dark:bg-black p-1 rounded-full border border-slate-200/50 dark:border-white/5 flex-shrink-0">
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
                                            ? "bg-green-500/10 border-green-500/20 text-green-500"
                                            : "bg-neutral-500/10 border-neutral-500/20 text-neutral-500"
                                            }`}
                                    >
                                        {subStatus}
                                    </button>
                                </div>
                            </div>
                        </div>
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
            {/* Unsubscribe Modal */}
            {showUnsubscribeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowUnsubscribeModal(false)} />
                    <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 z-10 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                            <LogOut className="w-8 h-8 animate-pulse" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Unsubscribe Service</h3>
                        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                            Are you sure you want to unsubscribe from the gaming service? You will lose access to active tournaments and bid events.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowUnsubscribeModal(false)}
                                className="flex-1 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs tracking-wider transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setSubStatus("Unsubscribed");
                                    setShowUnsubscribeModal(false);
                                }}
                                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-750 text-white font-bold text-xs tracking-wider transition-all active:scale-95"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loading && <WaitLoader isOverlay />}
            <BottomNavBar />
        </>
    );
}
