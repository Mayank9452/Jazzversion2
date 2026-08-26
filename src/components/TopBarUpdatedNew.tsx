import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { Button } from "@/components/ui/button"
import { Coins, Trophy, Bell, FileText, Sun, Moon, RotateCw, LogOut, ShieldCheck, User, Menu, X, Play, Compass, Flag, Puzzle, Grid, Flame, Gamepad2, LoaderPinwheel } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useLanguage } from "./context/LanguageContext"
import { useTheme } from "next-themes"
import { unsubscribeUser } from "@/features/bidProfile/profileSlice"
import PopupBannerUnsubscribe from "./PopupBannerUnsubscribe"

const formatCompactNumber = (number?: number) => {
    if (number === undefined || number === null) return 0;
    if (number >= 100000) {
        const kValue = Math.floor(number / 100) / 10;
        return `${kValue}k`;
    }
    return number.toLocaleString();
};

export const phoneShowFormat = (phone: string | undefined): string => {
    if (!phone) return "";
    if (phone.length <= 6) return phone;

    const first = phone.slice(0, 3);
    const last = phone.slice(-3);
    const masked = "*".repeat(phone.length - 6);

    return `${first}${masked}${last}`;
};

export function TopBarUpdatedNew() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const { data: response } = useAppSelector((state) => state.jazzHome);
    const { data: profileData } = useAppSelector((state) => state.profile);

    const userInfo = response?.userInfo || response?.data?.userInfo;
    const user_play_coins = response?.user_play_coins ?? 0;
    const user_reward_coins = response?.user_reward_coins ?? response?.data?.diamonds ?? profileData?.data?.userPoints ?? 0;
    const user_phone = userInfo?.user_phone;
    const userName = localStorage.getItem("username") || userInfo?.user_name || "";
    const avatar = userInfo?.user_profile_img ? `${userInfo.user_profile_img}.png` : (localStorage.getItem("selectedAvatarImg") || "9.png");

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showUnsubscribePopup, setShowUnsubscribePopup] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const confirmUnsubscribe = async () => {
        try {
            await dispatch(unsubscribeUser() as any).unwrap();
        } catch (e) {
            console.error("Unsubscribe error in TopBar:", e);
        }
    };

    const handleRedeem = () => {
        navigate("/profile", {
            state: {
                coins: user_reward_coins,
            },
        });
    };

    return (
        <>
            <div className="sticky top-0 z-[99] w-full">
                <div
                    className={`${isDark
                            ? "bg-white/85 dark:bg-brand-black-100/90 border-b border-slate-200/80 dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                            : "bg-brand-gradient border-b border-[#dfa208]/30 shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
                        } backdrop-blur-md h-[70px] flex items-center justify-between px-2 w-full transition-all duration-300 relative z-10`}
                >
                    {/* Left Section: Navigation Toggler & Coins Chip */}
                    <div className="flex items-center gap-2 relative z-20">
                        {/* Hamburger Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border active:scale-95 transition-all shrink-0 ${isDark
                                    ? "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white"
                                    : "border-[#dfa208]/30 bg-white/40 backdrop-blur-md hover:bg-white/60 text-black"
                                }`}
                            title="Open Navigation"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Reward Coins Chip (Left Side, Smaller Layout) */}
                        <div
                            // onClick={handleRedeem}
                            className={`flex flex-col items-center justify-center h-12 px-3.5 rounded-lg border transition-all shadow-inner cursor-pointer shrink-0 ${isDark
                                    ? "border-[#dfa208]/30 dark:border-brand-gold-100/30 bg-[#ffca20]/5 dark:bg-brand-gold-100/5 hover:bg-[#ffca20]/10 dark:hover:bg-brand-gold-100/10"
                                    : "border-[#dfa208]/50 bg-white/40 hover:bg-black/15"
                                }`}
                            title="Redeem Coins"
                        >
                            {/* Top Row: Coin Icon and Coins Text */}
                            <div className="flex items-center gap-1">
                                {isDark ? (
                                    <img src="/assets/images/img/gold-coin.png" className="w-3.5 h-3.5 object-contain animate-pulse" alt="Reward Coins" />
                                ) : (
                                    <Coins className="h-4 w-4 text-black/85" />
                                )}
                                <span className={`text-[8px] font-black uppercase tracking-wider leading-none ${isDark ? "text-[#dfa208] dark:text-brand-gold-200" : "text-black/85"}`}>Coins</span>
                            </div>
                            {/* Bottom Row: Value */}
                            <span className={`text-[11px] font-black leading-none mt-1 ${isDark ? "text-slate-800 dark:text-white" : "text-black"}`}>
                                {user_reward_coins == 0 ? 250000 : user_reward_coins}
                            </span>
                        </div>
                    </div>

                    {/* Center Section: Absolutely Centered Logo */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                        <Link to="/" className="flex items-center">
                            <img
                                src={isDark ? "/assets/images/img/gamenow.png" : "/assets/images/img/gamenow-logo.png"}
                                alt="GameNow Logo"
                                className="w-[75px] object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </Link>
                    </div>

                    {/* Right Section: Toggles & Actions */}
                    <div className="flex items-center gap-2 relative z-20">

                        {/* Notification Bell */}
                        <button
                            onClick={() => navigate("/notification")}
                            className={`relative w-9 h-9 rounded-xl flex items-center justify-center border active:scale-95 transition-all shrink-0 ${isDark
                                    ? "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white"
                                    : "border-[#dfa208]/30 bg-white/40 hover:bg-white/60 text-black"
                                }`}
                            title="Notifications"
                        >
                            <Bell className="h-4.5 w-4.5" />
                            <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border shadow-md animate-pulse ${isDark ? "bg-[#FFCA20] border-white dark:border-brand-black-100" : "bg-red-600 border-[#ffca20]"
                                }`} />
                        </button>

                        {/* Theme Toggler */}
                        <button
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border active:scale-95 transition-all shrink-0 ${isDark
                                    ? "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white"
                                    : "border-[#dfa208]/30 bg-white/40 hover:bg-white/60 text-black"
                                }`}
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {mounted && isDark ? (
                                <Sun className="h-4.5 w-4.5 text-brand-yellow-100 drop-shadow-[0_0_8px_rgba(255,202,32,0.5)]" />
                            ) : (
                                <Moon className="h-4.5 w-4.5 text-black" />
                            )}
                        </button>

                        {/* Profile Image Avatar */}
                        <button
                            onClick={() => navigate("/settingsStatic")}
                            className="w-11 h-11 flex-shrink-0 flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0"
                            title="My Account"
                        >
                            <img src={`/assets/users/${avatar}`} alt="Avatar" className="w-full h-full object-contain" />
                        </button>
                    </div>
                </div>
            </div>

            {/* SIDEBAR DRAWER (React offcanvas equivalent) */}
            <div
                className={`fixed inset-0 z-[1000] transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Backdrop overlay */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-[20px]"
                    onClick={() => setSidebarOpen(false)}
                />

                {/* Drawer content */}
                <div
                    className={`absolute top-0 left-0 bottom-0 w-[75%] max-w-[320px] bg-white/95 dark:bg-[#00000040] text-slate-800 dark:text-white h-full shadow-2xl flex flex-col border-r border-slate-200/60 dark:border-white/10 transition-transform duration-300 ease-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 text-slate-800 dark:text-white">
                        <span className="font-bold text-slate-800 dark:text-white text-base whitespace-nowrap">Gamenow Premier League</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                            className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 rounded-full h-8 w-8 p-0"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Sidenav Profile */}
                    <div className="p-4 bg-gradient-to-b from-slate-50 to-transparent dark:from-white/5 to-transparent border-b border-slate-200 dark:border-white/10 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-20 rounded-full overflow-hidden">
                                <img src={`/assets/users/${avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col text-start">
                                <h6 className="text-slate-800 dark:text-white text-sm font-black m-0 leading-tight">
                                    {userName === "null" || !userName ? "Player" : userName}
                                </h6>
                                <span className="text-slate-500 dark:text-white/60 text-xs font-semibold mt-0.5">
                                    {user_phone}
                                </span>
                            </div>
                        </div>

                        {/* Sidenav Coins Display Box */}
                        <div className="bg-slate-50 dark:bg-transparent rounded-xl p-3 border border-slate-200 dark:border-white/10 flex items-center justify-between w-full">
                            <div className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase tracking-wide">Coins</div>
                            <div className="flex items-center gap-1.5">
                                <img src="/assets/images/img/gold-coin.png" className="w-5 h-5 object-contain" alt="" />
                                <span className="text-[13px] font-extrabold text-slate-800 dark:text-white leading-none">
                                    {user_reward_coins == 0 ? 250000 : user_reward_coins}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sidenav Navigation Links */}
                    <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
                        <ul className="list-none pl-0 space-y-1.5">
                            <li>
                                <Link
                                    to="/settingsStatic"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <User className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    My Profile
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/spinandwin"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <LoaderPinwheel className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Spin & Win
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/games"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <Gamepad2 className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Play More Games
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/profile/tournamentHistory"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <Trophy className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Tournament History
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/notification"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <Bell className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Notifications
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/privacy-policy"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <ShieldCheck className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/terms"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <FileText className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Terms and Conditions
                                </Link>
                            </li>

                            <li>
                                <button
                                    onClick={() => {
                                        setSidebarOpen(false);
                                        setShowUnsubscribePopup(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[#dfa208] hover:bg-[#ffca20]/10 dark:text-yellow-main dark:hover:bg-yellow-main/10 transition-all font-semibold text-sm"
                                >
                                    <LogOut className="h-4.5 w-4.5" />
                                    Unsubscribe
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

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
        </>
    );
}
