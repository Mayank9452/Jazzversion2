import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { Button } from "@/components/ui/button"
import { Coins, Trophy, Bell, FileText, Sun, Moon, RotateCw, LogOut, ShieldCheck, User, Menu, X, Play, Compass, Flag, Puzzle, Grid, Flame, Gamepad2 } from "lucide-react"
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

export function TopBarUpdated() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { theme, setTheme } = useTheme();

    const { data: response } = useAppSelector((state) => state.home);
    const { data: profileData } = useAppSelector((state) => state.profile);

    const userInfo = profileData?.data?.userInfo || response?.data?.userInfo;
    const user_play_coins = userInfo?.user_play_coins ?? 0;
    const user_reward_coins = userInfo?.user_reward_coins ?? response?.data?.diamonds ?? profileData?.data?.userPoints ?? 0;
    const user_phone = userInfo?.user_phone;
    const userName = localStorage.getItem("username") || userInfo?.user_name || "";
    const avatar = userInfo?.user_profile_img ? `${userInfo.user_profile_img}.png` : "9.png";

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
                    className="bg-brand-black-100 border-b border-white/[0.08] h-[70px] flex items-center justify-between px-4 w-full transition-colors duration-300 relative z-10"
                >
                    {/* Hamburger Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/[0.03] hover:bg-white/5 active:scale-95 transition-all text-white shrink-0"
                        title="Open Navigation"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src="/assets/images/img/gamenow.png"
                            alt="GameNow Logo"
                            className="w-[80px] object-contain transition-transform duration-300 hover:scale-105"
                        />
                    </Link>

                    {/* Reward Coins Chip */}
                    <div
                        onClick={handleRedeem}
                        className="flex items-center gap-2 h-12 px-3 rounded-xl border border-brand-gold-100/30 bg-brand-gold-100/5 hover:bg-brand-gold-100/10 transition-all shadow-inner cursor-pointer shrink-0"
                        title="Redeem Coins"
                    >
                        <img src="/assets/images/img/gold-coin.png" className="w-6 h-6 object-contain animate-pulse" alt="Reward Coins" />
                        <div className="flex flex-col text-start justify-center">
                            <span className="text-white text-xs font-black leading-none">250000</span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold-200 leading-none mt-0.5">Coins</span>
                        </div>
                    </div>

                    {/* Theme Toggler */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/[0.03] hover:bg-white/5 active:scale-95 transition-all text-white shrink-0"
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {mounted && theme === "dark" ? (
                            <Sun className="h-4.5 w-4.5 text-brand-yellow-100 drop-shadow-[0_0_8px_rgba(255,202,32,0.5)]" />
                        ) : (
                            <Moon className="h-4.5 w-4.5 text-white" />
                        )}
                    </button>

                    {/* Notification Bell */}
                    <button
                        onClick={() => navigate("/notification")}
                        className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/[0.03] hover:bg-white/5 active:scale-95 transition-all text-white shrink-0"
                        title="Notifications"
                    >
                        <Bell className="h-4.5 w-4.5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-yellow-100 rounded-full border border-brand-black-100 shadow-md animate-pulse" />
                    </button>
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
                    className={`absolute top-0 left-0 bottom-0 w-[75%] max-w-[320px] bg-brand-black-100 dark:bg-[#00000040] h-full shadow-2xl flex flex-col border-r border-white/20 transition-transform duration-300 ease-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                        <span className="font-bold text-white text-base tracking-wide whitespace-nowrap">Gaming Premier League</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Sidenav Profile */}
                    <div className="p-4 bg-gradient-to-b from-white/5 to-transparent border-b border-white/10 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                                <img src={`/assets/users/${avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col text-start">
                                <h6 className="text-white text-sm font-black m-0 leading-tight">
                                    {userName === "null" || !userName ? "Player" : userName}
                                </h6>
                                <span className="text-white/60 text-xs font-semibold mt-0.5">
                                    {user_phone}
                                </span>
                            </div>
                        </div>

                        {/* Sidenav Coins Display Box */}
                        <div className="bg-brand-black-200 dark:bg-transparent rounded-xl p-3 border border-white/20 flex items-center justify-between w-full">
                            <div className="text-[11px] font-bold text-white/60 uppercase tracking-wide">Coins</div>
                            <div className="flex items-center gap-1.5">
                                <img src="/assets/images/img/gold-coin.png" className="w-5 h-5 object-contain" alt="" />
                                <span className="text-[13px] font-extrabold text-white leading-none">
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
                                    to="/settings"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <User className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    My Account
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <RotateCw className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Spin & Win
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/profile/tournamentHistory"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <Trophy className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Tournament History
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/notification"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <Bell className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Notifications
                                </Link>
                            </li>



                            <li>
                                <Link
                                    to="/privacy-policy"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm"
                                >
                                    <ShieldCheck className="h-4.5 w-4.5 text-brand-gold-100 dark:text-brand-yellow-100" />
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/terms"
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5 transition-all font-semibold text-sm"
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
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-yellow-main hover:text-rose-300 hover:bg-rose-500/10 transition-all font-semibold text-sm"
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
