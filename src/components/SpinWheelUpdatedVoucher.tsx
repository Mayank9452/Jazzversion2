"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dot, Info, Wifi, Gem, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
    fetchJazzSpinWinInfoThunk,
    fetchJazzSpinJSONThunk,
    processJazzSpinWinThunk
} from "../features/jazzSpinWin/jazzSpinWinSlice";

import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import Swal from "sweetalert2";

import { Lock, Unlock } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TopBarUpdated } from "./TopBarUpdated";
import ProductPopUpPageDemo from "./ProductPopUpPageDemo";
import ProductPopUpPageVoucher from "./ProductPopUpPageVoucher";
import PopupBannerStaticUpdated from "./PopupBannerStaticUpdated";
import SuccessPopUpPageUpdated from "./SuccessPopUpPageUpdated";
import LosePopUpPage from "./LosePopUpPage";

dayjs.extend(utc);
dayjs.extend(timezone);

// Lazy-initialize audio assets
let spinSoundObj: HTMLAudioElement | null = null;
let successSoundObj: HTMLAudioElement | null = null;
let loseSoundObj: HTMLAudioElement | null = null;

const getSpinSound = () => {
    if (!spinSoundObj) {
        spinSoundObj = new Audio("/assets/audio/client-spin.mp3");
    }
    return spinSoundObj;
};

const getSuccessSound = () => {
    if (!successSoundObj) {
        successSoundObj = new Audio("/assets/audio/success.mp3");
    }
    return successSoundObj;
};

const getLoseSound = () => {
    if (!loseSoundObj) {
        loseSoundObj = new Audio("/assets/audio/lose.mp3");
    }
    return loseSoundObj;
};

const formatDate = (dateString?: string) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const gifSources = [
    "/assets/images/crown.png",
    "/assets/images/bg-carnival.jpg",
    "/assets/images/bg-carnival_updated.jpg",
    "/assets/images/stand.png",
    "/assets/images/iconspin.png",
    "/assets/images/cartoon/cartoon.gif",
    "/assets/images/firework.gif",
    "/assets/images/cat-cry.gif",
    "/assets/images/image.png",
    "/assets/images/cartoon/face.gif",
    "/assets/images/cartoon/left-right.gif",
    "/assets/images/cartoon/middle.gif",
    "/assets/images/cartoon/extra-dance.gif",
];

function usePreloadGifs(sources: string[]) {
    useEffect(() => {
        const deferPreload = () => {
            const load = () => {
                sources.forEach((src) => {
                    const img = new Image();
                    img.src = src;
                });
            };
            if (typeof window.requestIdleCallback === "function") {
                window.requestIdleCallback(() => load());
            } else {
                setTimeout(load, 1000);
            }
        };

        // Defer preloading heavy gifs to run after page settlement/hydration
        const timer = setTimeout(deferPreload, 2500);
        return () => clearTimeout(timer);
    }, [sources]);
}

const parseReward = (text: string) => {
    const match = text.match(/(\d[\d,.]*)/);
    if (!match) {
        return { numberStr: text, unitStr: "", hasNumber: false };
    }
    const numberStr = match[1];
    const numberIndex = text.indexOf(numberStr);
    const afterText = text.slice(numberIndex + numberStr.length).trim();
    const nextWordMatch = afterText.match(/^([^\s]+)/);
    const unitStr = nextWordMatch ? nextWordMatch[1] : "";
    return { numberStr, unitStr, hasNumber: true };
};

function SpinWheelUpdatedVoucher({ }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { spinWinInfo, spinJSON, jsonStatus, infoStatus } = useAppSelector((state) => state.jazzSpinWin);
    const spinWinData = spinJSON;
    const spinCheck = spinWinInfo;
    const avatar = useAppSelector((state) => state?.profile?.data?.data?.user?.avatar || "1.png");

    const [result, setResult] = useState<any | null>(null);
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinId, setSpinId] = useState<number | null>(null);
    const [status, setStatus] = useState("idle"); // idle / success / popup
    const successInterval = 5000;

    const [isDarkTheme, setIsDarkTheme] = useState(true);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setIsDarkTheme(isDark);

        const observer = new MutationObserver(() => {
            setIsDarkTheme(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);
    const params = useParams();
    const handle = params?.handle ?? "";

    const { language } = useAppSelector((state) => state?.config);
    const [loading, setLoading] = useState(false);
    const loseCloseOnceRef = useRef(false);
    const loseAutoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [noSpinsLeft, setNoSpinsLeft] = useState(false);
    const [noJackpotSpinsLeft, setNoJackpotSpinsLeft] = useState(false);
    const [subscriptionPopup, setSubscriptionPopup] = useState(false);
    const [isWheelReady, setIsWheelReady] = useState(true);
    const [getPlaycoin, setPlaycoin] = useState<any>("");

    const defaultSegments = ["100", "50", "200", "50", "300", "400", "450", "500", "10", "100"];
    const defaultColors = [
        "#364C62", "#F1C40F", "#E67E22", "#E74C3C",
        "#98985A", "#95A5A6", "#16A085", "#27AE60", "#2980B9"
    ];

    const rawRewards = spinWinData?.segmentValuesArray || [];
    const rewards = rawRewards.length > 0
        ? (rawRewards.length % 2 !== 0
            ? [...rawRewards, { ...rawRewards[0], id: rawRewards[0].id + "_dup" }]
            : rawRewards)
        : defaultSegments.map((val, idx) => ({ id: String(idx + 1), value: val, resultText: `YOU WON ${val} COINS` }));

    const segmentCount = rewards.length || 10;
    const angle = 360 / segmentCount;

    const segments = rewards.map((item: any) => item.value);
    const colors = spinWinData?.colorArray?.slice(0, segments.length) || defaultColors;

    const isAllowedUser = false;
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isJackpotLive, setIsJackpotLive] = useState<null | boolean>(null);

    const handleLoseClose = () => {
        if (loseCloseOnceRef.current) return;
        loseCloseOnceRef.current = true;

        if (loseAutoCloseTimerRef.current) {
            clearTimeout(loseAutoCloseTimerRef.current);
        }

        getLoseSound().pause();
        setRotation(0);

        setResult(null);
        setStatus("idle");

        fetchData();

        // reset for next spin
        setTimeout(() => {
            loseCloseOnceRef.current = false;
        }, 500);
    };

    const fetchData = async () => {
        setLoading(true);
        setIsWheelReady(false); // block SPIN during fetch
        try {
            await dispatch(fetchJazzSpinJSONThunk());
            await dispatch(fetchJazzSpinWinInfoThunk());
            setIsWheelReady(true);
        } catch (error) {
            console.error("error::", error);
        } finally {
            setLoading(false);
        }
    };

    usePreloadGifs(gifSources);

    useEffect(() => {
        fetchData();
        setPlaycoin(localStorage.getItem("playCoins"));
    }, []);

    useEffect(() => {
        if (!noSpinsLeft) return;

        const timer = setTimeout(() => {
            setNoSpinsLeft(false);
        }, 20000);

        return () => clearTimeout(timer);
    }, [noSpinsLeft]);

    const spinWheel = async () => {
        setLoading(true);
        console.log("spinWheel clicked!", { isSpinning, isWheelReady, spinCheck });
        try {
            if (isSpinning || !isWheelReady) {
                console.log("spinWheel early exit (already spinning or not ready):", { isSpinning, isWheelReady });
                return;
            }

            // 1️⃣ Check spins left from spinCheck eligibility status
            const hasSpins = spinCheck?.status; // Eligibility status from api
            console.log("hasSpins status from API:", hasSpins);

            if (!hasSpins) {
                setNoSpinsLeft(true);
                console.log("spinWheel exited: no spins left eligibility");
                return;
            }

            setIsWheelReady(false);
            // 3️⃣ Proceed with spin
            setIsSpinning(true);
            getSpinSound().play();
            setResult(null);

            // Select random index frontend-side matching SpinWheel.tsx flow
            const randomIndex = Math.floor(Math.random() * rewards.length);
            const rawSelected = rewards[randomIndex];
            const rawId = String(rawSelected.id).replace("_dup", "");
            // Format selected reward for popups
            const selectedSegment = {
                ...rawSelected,
                id: Number(rawId),
                name: rawSelected.resultText || (rawSelected.value + " Coins")
            };

            const targetAngle = 360 - randomIndex * angle;
            const final = 5 * 360 + targetAngle + (rotation % 360);
            console.log("Spin configuration details:", { randomIndex, targetAngle, final });

            // Trigger rotation on next render tick so the browser registers the transition-duration style first!
            setTimeout(() => {
                console.log("Applying final rotation angle to state:", final);
                setRotation(final);
            }, 50);

            setTimeout(() => getSpinSound().pause(), successInterval + 250);

            setTimeout(async () => {
                setIsSpinning(false);
                setResult(selectedSegment);

                // Process spin outcome on backend
                try {
                    await dispatch(processJazzSpinWinThunk(rawId));
                } catch (err) {
                    console.error("Failed to process spin result:", err);
                }

                if (selectedSegment?.id !== 0) {
                    getSpinSound().pause();
                    getSuccessSound().play();
                    setStatus("success");

                    setTimeout(() => {
                        resetResults({ time: 0, status: "idle", isResultNull: true });
                        fetchData();
                    }, successInterval);

                    setTimeout(() => setRotation(0), 1500);
                } else {
                    setTimeout(() => {
                        getLoseSound().play();
                        resetResults({ status: "lose", time: 0 });

                        loseAutoCloseTimerRef.current = setTimeout(() => {
                            setRotation(0);
                            getLoseSound().pause();
                            handleLoseClose(); // ✅ auto close
                        }, successInterval);
                    }, 1000);
                }
            }, successInterval + 750);
        } catch (error) {
            console.error("error::", error);
            setIsSpinning(false);
            getSpinSound().pause();
        } finally {
            setLoading(false);
        }
    };

    const resetResults = ({
        time = 5000,
        status = "idle",
        isResultNull = false,
    }) => {
        setTimeout(() => {
            if (isResultNull) {
                setResult(null);
            }
            setStatus(status);
        }, time);
    };

    // demo timer (replace with real backend value if available)
    const [timer, setTimer] = useState(3600); // 1 hour

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = () => {
        const d = String(timeLeft.days).padStart(2, "0");
        const h = String(timeLeft.hours).padStart(2, "0");
        const m = String(timeLeft.minutes).padStart(2, "0");
        const s = String(timeLeft.seconds).padStart(2, "0");

        return `${d}:${h}:${m}:${s}`;
    };

    const SpinButton = ({ className = "" }) => (
        <button
            className={`pushable relative ${isSpinning ? "active" : ""} ${className}`}
            onClick={spinWheel}
            disabled={isSpinning || result || loading}
        >
            <span className="rounded-sm"></span>
            <span className="rounded-sm edge bg-white"></span>

            <span
                className={`rounded-sm front border-2 
        border-[#dfa208] bg-[#ffca20] hover:bg-[#dfa208]
        text-[#191919] font-bold w-32 h-12`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                {isSpinning ? (
                    <div className="animate-pulse text-sm flex items-center gap-0 justify-center">
                        <Dot className="w-6 h-6" />
                        <Dot className="w-6 h-6" />
                        <Dot className="w-6 h-6" />
                    </div>
                ) : result ? (
                    <span className="text-lg font-black uppercase tracking-wider text-black">
                        {language === "my" ? "အခုလှည့်မယ်" : "SPIN"}
                    </span>
                ) : (
                    <span className="animate-spinPulse text-lg font-black uppercase tracking-wider text-black">
                        {language === "my" ? "လှည့်" : "Spin"}
                    </span>
                )}
            </span>
        </button>
    );

    return (
        <div className="bg-slate-50 dark:bg-[#191919] text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden pb-4">
            {/* Ambient Glow Blobs for Light Mode only */}
            <div className="absolute top-[-10%] left-[-20%] w-[70%] aspect-square rounded-full bg-yellow-main/5 blur-[120px] dark:hidden pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[70%] aspect-square rounded-full bg-blue-main/5 blur-[120px] dark:hidden pointer-events-none" />

            {/* ── Solid Dark Header matching TopBarUpdated style ── */}
            <div className="">
                <div className="relative overflow-hidden bg-[#191919] border-b border-white/[0.08] p-2 flex items-center justify-between gap-3 shadow-md">
                    {/* Col-based layout for perfect centering */}
                    <div className="w-full grid grid-cols-3 items-center">
                        {/* Col 1: Back Button */}
                        <div className="flex justify-start">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center w-8 h-8 rounded-full border border-[#ffca20] bg-white/10 hover:bg-[#ffca20] hover:text-[#191919] transition-colors text-white shadow-sm"
                                title="Back"
                            >
                                <ChevronLeft className="w-4.5 h-4.5 text-[#ffca20]" />
                            </button>
                        </div>

                        {/* Col 2: Centered Title */}
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-base sm:text-lg font-black tracking-wide uppercase text-white leading-tight">
                                Spin & Win
                            </h1>
                        </div>

                        {/* Col 3: User Avatar */}
                        <div className="flex justify-end">
                            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-yellow-main/5 dark:bg-[#2B2B2B]/80 rounded-xl shadow-[0_0_15px_rgba(254,203,19,0.15)] border border-yellow-main/20 overflow-hidden">
                                <img src={`/assets/users/${avatar}`} className="w-full h-full object-cover" alt="User Avatar" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-0 p-4 cs-pt-0 pt-4 space-y-0 sm:space-y-0 sm:min-h-[80vh] cs-mt-0">
                {/* Wheel Container */}
                <div className="flex flex-col items-center space-y-8">
                    <div className="relative mt-0">
                        <div className="relative flex flex-col gap-2">
                            <div className="relative flex flex-col gap-0">
                                {/* Spinner */}
                                <div className="px-[50px] sm:px-[65px] pb-8 pt-10 relative flex flex-col gap-8">
                                    <div className="relative mt-5 pb-[5rem]">
                                        <div className="relative">
                                            {/* Stand */}
                                            <div
                                                className={`
                          absolute h-[100%] aspect-square top-[100%] transform -translate-x-[50%] -translate-y-[40%] start-[50%]
                          before:content-[''] before:absolute before:top-[61%] before:left-[50%] before:z-[-10]
                          before:w-[150%] before:h-10 before:transform before:translate-x-[-50%] ${isDarkTheme ? "before:bg-[radial-gradient(white,white,transparent,transparent,transparent)]" : "before:bg-[radial-gradient(black,black,transparent,transparent,transparent)]"} before:rounded-full`}
                                            >
                                                <img
                                                    src="/assets/images/stand_light_theme.png"
                                                    className={`h-full w-full opacity-100 ease-out object-contain`}
                                                    alt=""
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Wheel */}
                                            <div className="h-[19rem] sm:h-80 aspect-square rounded-full shadow-[0_0_25px_35px_rgba(0,0,0,0.15)] dark:shadow-[0_0_25px_35px_rgba(0,0,0,.9)] custom-box">
                                                <div
                                                    className={cn(
                                                        "absolute h-[6.25rem] sm:h-[8rem] z-[60] top-[0%] start-[50%] translate-x-[-45%] sm:translate-x-[-41%] translate-y-[-65%] sm:translate-y-[-58%] flex items-center justify-center",
                                                    )}
                                                    style={{ opacity: "1" }}
                                                >
                                                    <img
                                                        src="/assets/images/iconspin.png"
                                                        className="h-full w-full object-contain drop-shadow-[0px_8px_4px_rgba(0,0,0,1)]"
                                                        alt=""
                                                        loading="lazy"
                                                    />
                                                </div>

                                                {/* stars and lights */}
                                                <div
                                                    className="h-[calc(100%+50px)] aspect-square overflow-hidden absolute top-[50%] start-[50%] z-[55] rounded-full"
                                                    style={{
                                                        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                                                        transition: isSpinning ? `transform ${successInterval}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : "none",
                                                        transformOrigin: "center center",
                                                    }}
                                                >
                                                    {Array(23)
                                                        .fill(0)
                                                        .map((segment: any, index: number) => {
                                                            const arrayLength = 360 / 23;
                                                            const angle = 360 / 9;
                                                            const rotation =
                                                                arrayLength * index - arrayLength / 2;
                                                            const defValue =
                                                                window.innerWidth < 645 ? -5 : -6.4;
                                                            const bt = defValue + (9 - 5) * 8.9;
                                                            const pt = -3 + (9 - 5) * -1.2;

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`segment absolute w-1/2 h-1/2 top-0 left-[50%] origin-bottom-right text-xs font-semibold text-black text-center flex items-end justify-center pb-2 ${isSpinning ? "opacity-100" : "opacity-100"} ${result ? (result?.id === segment?.id ? "opacity-100" : "opacity-100") : ""} overflow-hidden text-white`}
                                                                    style={{
                                                                        transform: `rotate(${rotation}deg) skewY(-${90 - angle}deg)`,
                                                                    }}
                                                                >
                                                                    <div
                                                                        className={`absolute inset-0 flex gap-2 items-center justify-center bottom-0 h-full`}
                                                                        style={{
                                                                            transform: `skewY(${90 - angle}deg) rotate(${angle / 2}deg) translate(${pt}%, ${bt}%)`,
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className={`
                                        relative h-[15px] aspect-square rounded-full 
                                        bg-gradient-to-br from-[#FFFFFF] via-[#fff9d1]  to-[#927f02]
                                        shadow-[0px_5.5px_1px_-2.5px_rgba(0,0,0,1)] mb-1

                                        before:content-[''] before:absolute before:top-0 before:left-0
                                        before:w-full before:h-full before:rounded-full
                                        before:shadow-[-2px_-3px_8px_0px_rgba(255,255,255,1)]

                                        after:content-[''] after:absolute after:top-0 after:left-0
                                        after:w-full after:h-full after:rounded-full
                                        after:shadow-[0px_0px_4px_4px_rgba(255,255,255,.25)]
                                        `}
                                                                            style={{
                                                                                transform: `rotate(-${index * arrayLength + 35}deg) `,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>

                                                {/* Wheel content */}
                                                <div
                                                    className="relative h-full w-full overflow-hidden rounded-full outline outline-[#ffca20] outline-[20px] border-[6px] border-black"
                                                    style={{ borderStyle: "inset" }}
                                                >
                                                    <div className="absolute z-[51] h-full w-full rounded-full border-[5px] border-white shadow-[inset_0_0_10px_4px_rgba(23,24,53,.81)]" />

                                                    {/* Cards */}
                                                    <div
                                                        className="w-full h-full bg-black"
                                                        style={{
                                                            transform: `rotate(${rotation}deg)`,
                                                            transition: isSpinning ? `transform ${successInterval}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : "none",
                                                            transformOrigin: "center center",
                                                        }}
                                                    >
                                                        {(!spinWinData || jsonStatus === "loading") &&
                                                            Array(9)
                                                                .fill(0)
                                                                .map((segment: any, index: number) => {
                                                                    const angle = 360 / 9;
                                                                    const rotation = angle * index - angle / 2;
                                                                    const pt = 8 * 9 - 30;
                                                                    const ps = (9 * 15) / 10;

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={`segment absolute w-1/2 h-1/2 top-0 left-[50%] origin-bottom-right text-xs font-semibold text-center flex items-end justify-center pb-2 overflow-hidden bg-gradient-to-t from-muted/40 to-muted animate-pulse`}
                                                                            style={{
                                                                                transform: `rotate(${rotation}deg) skewY(-${90 - angle}deg)`,
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className={`absolute inset-0 flex flex-col gap-2 items-start justify-center bottom-0 h-full pe-3`}
                                                                                style={{
                                                                                    transform: `skewY(${90 - angle}deg) rotate(${360 - (90 - angle / 2)}deg) translate(-${pt}%, -${ps}%)`,
                                                                                }}
                                                                            >
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                        {rewards.length > 0 &&
                                                            rewards.map(
                                                                (segment: any, index: number) => {
                                                                    const rotation = angle * index - angle / 2;
                                                                    const pt = 8 * segmentCount - 30;
                                                                    const ps = (segmentCount * 15) / 10;
                                                                    const text = segment?.value;

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className={`segment absolute w-1/2 h-1/2 top-0 left-[50%] origin-bottom-right text-xs font-semibold text-center flex items-end justify-center pb-2 ${isSpinning ? "opacity-40" : ""} ${result ? (result?.id === segment?.id ? "opacity-100" : "opacity-40") : ""} overflow-hidden`}
                                                                            style={{
                                                                                transform: `rotate(${rotation}deg) skewY(-${90 - angle}deg)`,
                                                                                background: index % 2 === 0 ? "#FFFFFF" : "#191919",
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className={`absolute inset-0 flex flex-col gap-2 items-start justify-center bottom-0 h-full pe-3`}
                                                                                style={{
                                                                                    transform: `skewY(${90 - angle}deg) rotate(${360 - (90 - angle / 2)}deg) translate(-${pt}%, -${ps}%)`,
                                                                                }}
                                                                            >
                                                                                <div className="h-[1.4rem] sm:h-6 w-full absolute flex items-center justify-center top-[45.5%] sm:top-[47%] -start-5">
                                                                                    {segment?.id === 0 ? (
                                                                                        <span
                                                                                            className={`${segment.text || "text-white"} text-[13px] sm:text-[15px] text-center font-pop font-extrabold px-2 pt-0.5 leading-tight break-words`}
                                                                                            style={{
                                                                                                color: index % 2 === 0 ? "#191919" : "#FFFFFF",
                                                                                                textShadow: index % 2 === 0 ? "none" : "0px 0px 3px black",
                                                                                                transform: "rotate(90deg)",
                                                                                                position: "absolute",
                                                                                                maxWidth: "80px",
                                                                                                whiteSpace: "normal",
                                                                                            }}
                                                                                        >
                                                                                            {text}
                                                                                        </span>
                                                                                    ) : (() => {
                                                                                        const { numberStr, unitStr, hasNumber } = parseReward(text);
                                                                                        const isDataPack = text.toUpperCase().includes("MB") || text.toUpperCase().includes("GB");
                                                                                        const isDiamondSegment = text.toUpperCase().includes("DIAMOND") || text.toUpperCase().includes("DIMANOND") || (unitStr && (unitStr.toUpperCase().includes("DIAMOND") || unitStr.toUpperCase().includes("DIMANOND")));

                                                                                        if (!hasNumber) {
                                                                                            return (
                                                                                                <div
                                                                                                    className={`${segment.text} flex flex-col items-center justify-start gap-1 text-center font-pop font-extrabold px-2`}
                                                                                                    style={{
                                                                                                        color: index % 2 === 0 ? "#191919" : "#FFFFFF",
                                                                                                        textShadow: index % 2 === 0 ? "none" : "0px 0px 3px black",
                                                                                                        position: "absolute",
                                                                                                        left: "50%",
                                                                                                        top: "50%",
                                                                                                        transform: "translate(-50%, -50%) rotate(90deg)",
                                                                                                        width: "max-content",
                                                                                                        maxWidth: "90px",
                                                                                                        whiteSpace: "normal",
                                                                                                        height: "70px",
                                                                                                    }}
                                                                                                >
                                                                                                    <span className="text-[13px] sm:text-[15px] font-extrabold leading-tight break-words">
                                                                                                        {text}
                                                                                                    </span>
                                                                                                    {isDataPack ? (
                                                                                                        <Wifi className="w-9 h-9 sm:w-7 sm:h-7 text-white/95 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
                                                                                                    ) : (
                                                                                                        <img
                                                                                                            src="/assets/images/img/gold-coin.png"
                                                                                                            alt={text}
                                                                                                            className="w-7 h-7 sm:w-6 sm:h-6 object-contain mt-1"
                                                                                                            loading="lazy"
                                                                                                        />
                                                                                                    )}
                                                                                                </div>
                                                                                            );
                                                                                        }
                                                                                        return (
                                                                                            <div
                                                                                                className={`${segment.text} -ms-2 flex flex-col items-center justify-start gap-1 text-center font-pop font-extrabold px-2`}
                                                                                                style={{
                                                                                                    color: index % 2 === 0 ? "#191919" : "#FFFFFF",
                                                                                                    textShadow: index % 2 === 0 ? "none" : "0px 0px 3px black",
                                                                                                    position: "absolute",
                                                                                                    left: "50%",
                                                                                                    top: "50%",
                                                                                                    transform: "translate(-50%, -50%) rotate(90deg)",
                                                                                                    width: "max-content",
                                                                                                    maxWidth: "90px",
                                                                                                    whiteSpace: "normal",
                                                                                                    height: "70px",
                                                                                                }}
                                                                                            >
                                                                                                <div className="flex items-baseline justify-center gap-1 leading-none">
                                                                                                    <span className="text-[16px] sm:text-lg font-black tracking-tight">
                                                                                                        {numberStr}
                                                                                                    </span>
                                                                                                    {unitStr && (
                                                                                                        unitStr.toUpperCase().includes("DIMANOND") || unitStr.toUpperCase().includes("DIAMOND") ? (
                                                                                                            <img
                                                                                                                src="/assets/images/diamond5.png"
                                                                                                                className="w-5 h-5 sm:w-4.5 sm:h-4.5 object-contain self-center ml-0.5"
                                                                                                                alt="Diamond"
                                                                                                                loading="lazy"
                                                                                                            />
                                                                                                        ) : (
                                                                                                            <span className="text-[16px] sm:text-xs font-bold opacity-90 uppercase ml-0.5">
                                                                                                                {unitStr}
                                                                                                            </span>
                                                                                                        )
                                                                                                    )}
                                                                                                </div>
                                                                                                {isDataPack ? (
                                                                                                    <Wifi className="w-9 h-9 sm:w-7 sm:h-7 text-white/95 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
                                                                                                ) : (
                                                                                                    <img
                                                                                                        src="/assets/images/img/gold-coin.png"
                                                                                                        alt={text}
                                                                                                        className="w-7 h-7 sm:w-6 sm:h-6 object-contain mt-1"
                                                                                                        loading="lazy"
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                    </div>

                                                    {isWheelReady && !isSpinning && !result ? (
                                                        <div className="absolute z-[60] top-[50%] start-[50%] -translate-x-1/2 -translate-y-1/2 scale-[0.7]">
                                                            <SpinButton />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div
                                                                className={`absolute h-10 sm:h-12 aspect-square rounded-full text-xl font-bold z-50 top-[50%] start-[50%] translate-x-[-50%] translate-y-[-50%] custom-btn-outline flex items-center text-center justify-center border-[5px] border-[#dfa208] shadow-[0_0_8px_3px_rgba(0,0,0,1)]
                              
                              before:content-[''] before:absolute before:top-1.5 before:right-1.5
                              before:w-2.5 before:h-[7px] before:sm:w-4 before:sm:h-2 before:rounded-full
                              before:bg-[radial-gradient(_#FFFFFF,_#FFFFFF,_#FFFFFF00,_#FFFFFF00)] before:transform before:rotate-[20deg]
                             `}
                                                                style={{ background: "radial-gradient(circle, #ffca20 0%, #dfa208 70%, #191919 100%)", opacity: "1" }}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {result &&
                                                ["success", "banner", "popup"].includes(status) && (
                                                    <img
                                                        src={"/assets/images/firework.gif"}
                                                        className="w-full h-full absolute top-0 start-0 rounded-full z-[58]"
                                                        alt=""
                                                        loading="lazy"
                                                    />
                                                )}
                                            {result &&
                                                ["success", "banner", "popup"].includes(status) && (
                                                    <div className="absolute w-full h-full animate-zoom-in rounded-full text-xl font-bold z-[55] top-0 start-0 shadow overflow-hidden grid">
                                                        <div
                                                            className={`relative h-100 w-100 flex flex-col items-center text-center justify-center gap-5 ${"bg-black"}`}
                                                        >
                                                            <img
                                                                src={"/assets/images/you-won.png"}
                                                                className="w-full h-full absolute top-0 start-0 rounded-full z-[54] custom-win-banner"
                                                                alt=""
                                                                loading="lazy"
                                                            />
                                                            <img
                                                                src={"/assets/images/cartoon.gif"}
                                                                className="w-[50%] h-[50%] rounded-full object-cover drop-shadow-md"
                                                                alt=""
                                                                loading="lazy"
                                                            />
                                                            <span className="font-bold text-white text-md sm:text-3xl max-w-[70%]">
                                                                {result?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                {/* {spinner?.otherSpinners?.length > 0 && (
          <div className="flex flex-col justify-center items-center gap-2 w-full mx-auto pb-20">
            {spinner?.otherSpinners?.map((spin: any, index: number) => {
              const success =
                (100 * (spinner?.weeklyPlayedThisSpinner)) / spin?.minSpins;
              return (
                <div
                  key={index}
                  className="w-full bg-gradient-to-r from-[#0130594f] via-[#0d56974f] to-[#0130594f] backdrop-blur-sm rounded-[1.5rem] p-4 border border-blue-900 shadow-[0_0_8px_1.5px_rgba(0,0,0,.31)] flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center gap-2">
                      <h5 className="max-w-[10rem] truncate font-bold text-white">
                        Mega {language == "my" && spin?.burmeseName !== ""
                          ? spin?.burmeseName
                          : spin?.name}
                      </h5>
                      {spin?.pendingSpinPlays > 0 && (
                        <i className="text-sm text-green-400 animate-scale-pulse">
                          ({" "}
                          {language == "my"
                            ? `လှည့်ရန် ${spin?.pendingSpinPlays} ကြိမ် ကျန်ပါသည်`
                            : spin?.pendingSpinPlays + " spins left"}
                          )
                        </i>
                      )}
                    </div>
                    {isAllowedUser && (
                      <Button
                        className="h-8 px-8 bg-gradient-to-br from-yellow-700 via-yellow-200 to-yellow-700 text-yellow-950 font-bold tracking-wide shadow-[0_0_8px_1.5px_rgba(0,24,43,1)]"
                        // disabled={spin?.pendingSpins !== 0 && spin?.pendingSpinPlays === 0}
                        onClick={() => {
                          spin?.pendingSpinPlays > 0 ||
                          spinner?.weeklyPlayedThisSpinner > spin?.minSpins
                            ? navigate(`/prospinner/${spin?.handle}`)
                            : setNoJackpotSpinsLeft(true);
                          setNoSpinsLeft(false);
                        }}
                      >
                        {language == "my" ? "ကစားမယ်" : "Play"}
                      </Button>
                    )}
                    {!isAllowedUser && (
                      <Button
                        className="h-8 px-8 bg-gradient-to-br from-yellow-700 via-yellow-200 to-yellow-700 text-yellow-950 font-bold tracking-wide shadow-[0_0_8px_1.5px_rgba(0,24,43,1)]"
                        // disabled={spin?.pendingSpins !== 0 && spin?.pendingSpinPlays === 0}
                        onClick={() => {
                          navigate(`/prospinner/${spin?.handle}`);
                        }}
                      >
                        {language == "my" ? "ကစားမယ်" : "Play"}
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-between items-center gap-1">
                    <div
                      key={index}
                      className="w-full bg-gradient-to-r from-[#0130594f] via-[#0d56974f] to-[#0130594f] backdrop-blur-sm rounded-full h-4 overflow-hidden border border-blue-900 shadow-[inset_0_0_4px_1.5px_rgba(0,0,0,1)] "
                    >
                      <div
                        className={`flex items-center rounded-full justify-between transition-all duration-1000 bg-white text-xs h-full shadow-[inset_0_0_2px_2px_rgba(0,0,0,1)]`}
                        style={{ width: `${success}%` }}
                      />
                    </div>
                    <span className="text-xs w-12 text-white">
                      {spinner?.weeklyPlayedThisSpinner === spin?.minSpins
                        ? spinner?.weeklyPlayedThisSpinner
                        : spinner?.weeklyPlayedThisSpinner %
                          spin?.minSpins}{" "}
                      / {spin?.minSpins ?? 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )} */}



                <AnimatePresence>
                    {result && result?.id == 0 && ["lose"].includes(status) && (
                        //   <LosePopUpPage />
                        <LosePopUpPage onClose={handleLoseClose} />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {result && result?.id !== 0 && ["popup"].includes(status) && (
                        <SuccessPopUpPageUpdated result={result} />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {result && result?.id !== 0 && ["banner"].includes(status) && (
                        ((result?.name ?? "").toLowerCase().includes("mb") || (result?.name ?? "").toLowerCase().includes("gb")) ? (
                            <ProductPopUpPageDemo
                                result={result}
                                resetResults={resetResults}
                                spinId={spinId}
                            />
                        ) : (
                            <ProductPopUpPageVoucher
                                result={result}
                                resetResults={resetResults}
                                spinId={spinId}
                            />
                        )
                    )}
                </AnimatePresence>



                {/* {spinner?.otherSpinners?.length > 0 &&
          spinner.otherSpinners.map((spin: any, index: number) => {
            const pendingPlays = spin?.pendingSpinPlays ?? 0;

            if (pendingPlays <= 0 || isJackpotLive === null) return null;

            return isJackpotLive ? (
              <PopupBannerStatic
                key={spin?.id || index}
                data={{
                  title:
                    language == "my"
                      ? "ဂျက်ပေါ့ဆုကြီးက စောင့်ကြိုနေတယ်နော်"
                      : "Mega Jackpot Awaits",
                  description:
                    language == "my"
                      ? "အခုပဲ ကံကြမ္မာစက်ဝန်းလှည့်ပြီး ဆုကြီးများစွာ ရယူလိုက်ပါ"
                      : "Spin now and grab your chance to win big rewards.",
                  image: "/assets/images/banner.webp",
                  imageAspect: "7/8",
                  autoCloseTimer: 5,
                  handle: spin?.handle,
                }}
                isShow={pendingPlays}
              />
            ) : (
              <PopupBannerStaticUpdated
                key={spin?.id || index}
                data={{
                  title:
                    language == "my"
                      ? "ဂျက်ပေါ့ဆုကြီးက စောင့်ကြိုနေတယ်နော်"
                      : "Jackpot Unlocks on Wednesday",
                  description:
                    language == "my"
                      ? "အခုပဲ ကံကြမ္မာစက်ဝန်းလှည့်ပြီး ဆုကြီးများစွာ ရယူလိုက်ပါ"
                      : "Get Ready and grab your chance to win big rewards on Wednesday",
                  image: "/assets/images/banner.webp",
                  imageAspect: "7/8",
                  autoCloseTimer: 5,
                  handle: spin?.handle,
                }}
                isShow={pendingPlays}
              />
            );
          })} */}


                {spinCheck?.status === false && spinCheck?.message && (
                    <div className="max-w-xs sm:max-w-sm w-[90%] mx-auto p-4 rounded-2xl bg-red-500/10 dark:bg-[#ffffff1f] border border-black/20 dark:border-white/[0.08] shadow-[0_0_8px_1.5px_rgba(0,0,0,.31)] text-black dark:text-white text-center sm:text-sm font-semibold animate-fade-in mt-12 mb-6 text-sm">
                        {spinCheck.message}
                    </div>
                )}
            </div>
            <BottomNavBar />
        </div>
    );
}

export default SpinWheelUpdatedVoucher;