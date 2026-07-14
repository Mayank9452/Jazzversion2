import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Sparkles,
    Trophy,
    Shuffle,
    Trash2,
    Check,
    X,
    Clock,
    Info,
    Eye,
    ChevronLeft,
    TrendingUp,
    ChevronDown,
    History,
    Hammer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import PopupBannerForBidPage from "./PopupBannerForBidPage";
import WaitLoader from "./Loader";
import SuccessBidPopup from "./SuccessBidPopup";
import PopupBannerForDuplicateSet from "./PopupBannerForDuplicateSet";
import { useLanguage } from "./context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { checkUniqueNumbers } from "@/features/uniqueNumber/uniqueNumberSlice";
import { placeBid } from "@/features/placebid/placeBidSlice";
import { fetchBidInfo } from "@/features/bid/bidSlice";
import { fetchHomeData } from "@/features/home/homeSlice";

// ── Static Styles (Optimized for Mobile) ──────────────────────────────────────
const TICKET_MASK_STYLE = {
    WebkitMaskImage: 'radial-gradient(circle 15px at left, transparent 98%, black 100%), radial-gradient(circle 15px at right, transparent 98%, black 100%)',
    WebkitMaskComposite: 'source-in',
    maskImage: 'radial-gradient(circle 15px at left, transparent 98%, black 100%), radial-gradient(circle 15px at right, transparent 98%, black 100%)',
    maskComposite: 'intersect'
};

const SET_MASK_STYLE = {
    WebkitMaskImage: 'radial-gradient(circle 1px at left, transparent 98%, black 100%), radial-gradient(circle 13px at right, transparent 98%, black 100%)',
    WebkitMaskComposite: 'source-in',
    maskImage: 'radial-gradient(circle 13px at left, transparent 98%, black 100%), radial-gradient(circle 13px at right, transparent 98%, black 100%)',
    maskComposite: 'intersect'
};

const SET_ITEM_MASK_STYLE = {
    WebkitMaskImage: 'radial-gradient(circle 13px at left, transparent 98%, black 100%), radial-gradient(circle 13px at right, transparent 98%, black 100%)',
    WebkitMaskComposite: 'source-in',
    maskImage: 'radial-gradient(circle 13px at left, transparent 98%, black 100%), radial-gradient(circle 13px at right, transparent 98%, black 100%)',
    maskComposite: 'intersect'
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const getMMTTime = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 6.5 * 60 * 60 * 1000);
};

const getTimeLeft = (endTime: string) => {
    const now = getMMTTime().getTime();
    if (!endTime) return "00 : 00 : 00 : 00";
    const diff = new Date(endTime).getTime() - now;
    if (diff <= 0) return "00 : 00 : 00 : 00";
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(d).padStart(2, "0")} : ${String(h).padStart(2, "0")} : ${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
};

const DAILY_THEMES = [
    {
        gradient: "gradient-violet-indigo",
        border: "border-violet-200",
        shadow: "shadow-violet-100",
        tint: "bg-violet-50",
        accentText: "text-violet-700",
        btnFrom: "from-violet-600",
        btnTo: "to-indigo-600",
    },
    {
        gradient: "gradient-fuchsia-pink",
        border: "border-fuchsia-200",
        shadow: "shadow-fuchsia-100",
        tint: "bg-fuchsia-50",
        accentText: "text-fuchsia-700",
        btnFrom: "from-fuchsia-600",
        btnTo: "to-pink-600",
    },
    {
        gradient: "gradient-cyan-blue",
        border: "border-cyan-200",
        shadow: "shadow-cyan-100",
        tint: "bg-cyan-50",
        accentText: "text-cyan-700",
        btnFrom: "from-cyan-500",
        btnTo: "to-blue-600",
    },
    {
        gradient: "gradient-emerald-teal",
        border: "border-emerald-200",
        shadow: "shadow-emerald-100",
        tint: "bg-emerald-50",
        accentText: "text-emerald-700",
        btnFrom: "from-emerald-500",
        btnTo: "to-teal-600",
    },
];

const WEEKLY_THEMES = [
    {
        gradient: "gradient-orange-red",
        border: "border-orange-200",
        shadow: "shadow-orange-100",
        tint: "bg-orange-50",
        accentText: "text-orange-700",
        btnFrom: "from-orange-500",
        btnTo: "to-red-600",
    },
    {
        gradient: "gradient-rose-purple",
        border: "border-rose-300",
        shadow: "shadow-rose-200",
        tint: "bg-rose-50",
        accentText: "text-rose-700",
        btnFrom: "from-rose-500",
        btnTo: "to-purple-600",
    }
];

export default function BiddingPageLatest() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [selectedTickets, setSelectedTickets] = useState<{
        [key: number]: string;
    }>({});
    const [currentTicket, setCurrentTicket] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
    const [duplicateSets, setDuplicateSets] = useState<any>(null);
    const [isShowingFilledSets, setIsShowingFilledSets] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<number>(1);
    const [hasDismissedResultPopup, setHasDismissedResultPopup] = useState(false);
    const [duplicateTicketNumbers, setDuplicateTicketNumbers] = useState<string[]>([]);
    const { t } = useLanguage();
    const cycleTabsRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isShowingFilledSets && cycleTabsRef.current) {
            const activeTab = cycleTabsRef.current.querySelector('[data-active="true"]');
            if (activeTab) {
                activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        }
    }, [isShowingFilledSets, selectedCycle]);

    const { data: bidResponse, status: bidStatus } = useAppSelector((state) => state.bid);
    const { status: uniqueStatus } = useAppSelector((state) => state.uniqueNumbers);
    const { status: placeStatus } = useAppSelector((state) => state.placeBid);

    const isLoading =
        bidStatus === "loading" ||
        uniqueStatus === "loading" ||
        placeStatus === "loading";

    // actual API payload
    const bidData = bidResponse?.data;
    const bidInfo = bidData?.bidInfo;

    // values you need
    const bidName = useMemo(() => {
        const name = bidInfo?.bid_name || bidData?.bidName;
        return name?.replace(/\+/g, " ");
    }, [bidInfo?.bid_name, bidData?.bidName]);
    const bidCycle = bidData?.cycleCount || bidData?.bidInfo?.bid_cycles;
    const batchCount = bidData?.batchCount;
    const completeSets = bidData?.completeSets;

    const allCompleteSets = useMemo(() => {
        if (!completeSets) return [];
        return Array.isArray(completeSets)
            ? completeSets
            : Object.values(completeSets).flat();
    }, [completeSets]);

    const existingNumbers = useMemo(() => {
        if (!completeSets) return new Set<string>();
        const nums = new Set<string>();
        Object.values(completeSets).forEach((cycleSets: any) => {
            if (Array.isArray(cycleSets)) {
                cycleSets.forEach((setData: any) => {
                    for (let i = 1; i <= 6; i++) {
                        const val = setData[`batch_set_${i}`];
                        if (val !== undefined && val !== null) {
                            nums.add(val.toString());
                        }
                    }
                });
            }
        });
        return nums;
    }, [completeSets]);

    useEffect(() => {
        const encodedBidId = sessionStorage.getItem("bidId");
        if (encodedBidId) {
            dispatch(fetchBidInfo(encodedBidId));
        }
    }, [dispatch]);

    useEffect(() => {
        if (bidCycle) {
            setSelectedCycle(Number(bidCycle));
        }
    }, [bidCycle]);

    const tickets = useMemo(() => Array(6).fill(null), []);

    const handleNumberClick = useCallback((num: string) => {
        if (currentTicket === null) return;
        setInputValue(prev => {
            const newValue = prev + num;
            return newValue.length <= 4 ? newValue : prev;
        });
    }, [currentTicket]);

    const handleTicketSelect = useCallback((index: number) => {
        setCurrentTicket(index);
        setInputValue(selectedTickets[index] || "");
    }, [selectedTickets]);

    const handleConfirm = useCallback(() => {
        if (currentTicket !== null && inputValue.length > 0) {
            setSelectedTickets(prev => ({ ...prev, [currentTicket]: inputValue }));
            setInputValue("");
            setCurrentTicket(null);
        }
    }, [currentTicket, inputValue]);

    const handleDelete = useCallback(() => {
        setInputValue(prev => prev.slice(0, -1));
    }, []);

    const handleCancelInput = useCallback(() => {
        setInputValue("");
        setCurrentTicket(null);
    }, []);

    const handleAutoPick = useCallback(() => {
        const newTickets: { [key: number]: string } = {};
        const tempSelected = new Set<string>();

        Array(6).fill(null).forEach((_, index) => {
            let randomNum = "";
            let isDuplicate = true;
            let attempts = 0;

            // Loop until a unique number is found or max attempts reached
            while (isDuplicate && attempts < 100) {
                const digits = Math.floor(Math.random() * 4) + 1;
                const maxNum = Math.pow(10, digits) - 1;
                const minNum = Math.pow(10, digits - 1);
                randomNum = Math.floor(minNum + Math.random() * (maxNum - minNum + 1)).toString();

                // Check against historical numbers AND current batch
                isDuplicate = existingNumbers.has(randomNum) || tempSelected.has(randomNum);
                attempts++;
            }

            newTickets[index] = randomNum;
            tempSelected.add(randomNum);
        });

        setSelectedTickets(newTickets);
        setDuplicateTicketNumbers([]);
        setCurrentTicket(null);
        setInputValue("");
    }, [existingNumbers]);

    const handleClearAll = useCallback(() => {
        setSelectedTickets({});
        setDuplicateTicketNumbers([]);
        setCurrentTicket(null);
        setInputValue("");
    }, []);

    const handleSubmit = useCallback(async (e?: any) => {
        e?.preventDefault();

        if (Object.keys(selectedTickets).length !== 6) return;

        const numbersArray = Object.values(selectedTickets).map(Number);

        const checkPayload = {
            bid: btoa(bidInfo?.bid_id.toString() || ""),
            data: JSON.stringify(numbersArray),
        };

        try {
            setDuplicateTicketNumbers([]);
            const checkRes = await dispatch(
                checkUniqueNumbers(checkPayload),
            ).unwrap();

            if (checkRes?.status === "success") {
                const placeBidPayload: any = {
                    bid: checkPayload.bid,
                    bCount: btoa(bidData.batchCount.toString()),
                    cCount: btoa(bidData.cycleCount),
                };

                Object.values(selectedTickets).forEach((value, index) => {
                    placeBidPayload[`set_${index + 1}`] = value;
                });

                await dispatch(placeBid(placeBidPayload)).unwrap();
                setShowSuccessPopup(true);
            } else if (checkRes?.status == "error" && checkRes?.reason == "duplicate_found") {
                setDuplicateSets(checkRes.sets);
                setShowDuplicatePopup(true);
            }
        } catch (err: any) {
            // console.error("Error:", err.message);
        }
    }, [selectedTickets, bidInfo?.bid_id, bidData?.batchCount, bidData?.cycleCount, dispatch]);

    const handlePlayMoreBids = useCallback(() => {
        if (bidData?.joinedStatus === false) {
            const userId = bidData?.userId;
            if (userId) {
                try {
                    const decodedId = atob(userId);
                    const parsedId = parseInt(decodedId, 10);
                    if (!isNaN(parsedId)) {
                        dispatch(fetchHomeData(parsedId));
                    }
                } catch (e) {
                    // console.error("Error decoding userId:", e);
                }
            }
        }

        const encodedBidId = sessionStorage.getItem("bidId");
        if (encodedBidId) {
            dispatch(fetchBidInfo(encodedBidId));
        }
        setSelectedTickets({});
        setDuplicateTicketNumbers([]);
        setShowSuccessPopup(false);
    }, [dispatch, bidData?.joinedStatus, bidData?.userId]);

    return (
        <>
            <TopBar />
            <div className="bg-white overflow-x-hidden relative">
                <div className="relative z-10 p-2 transform-gpu translate-z-0 pb-0">
                    <HeaderSection
                        navigate={navigate}
                        bidName={bidName}
                        t={t}
                    />

                    <TimerSection endTime={bidInfo?.bid_end_timestamp} />

                    <div className="max-w-md mx-auto space-y-3 pt-1">
                        {(allCompleteSets.length > 0 || bidData?.redirect === "RESULT") && (
                            <div className="relative rounded-xl overflow-hidden shadow-xl bg-white transform-gpu translate-z-0">
                                {/* Premium Gradient Header - Matching NotificationPage Style */}
                                <div
                                    style={{ transition: 'padding-bottom 0.3s ease-in-out' }}
                                    className={`gradient-home-section pt-4 px-5 relative ${isShowingFilledSets ? 'pb-12' : 'pb-4'}`}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl" />

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                                                <History className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-white tracking-tight">
                                                    {t.previousBidsInfo}
                                                </h2>
                                                <p className="text-[10px] font-semibold text-white/70 tracking-widest">
                                                    {t.bidHistory}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (isShowingFilledSets) {
                                                    setSelectedCycle(Number(bidCycle));
                                                }
                                                setIsShowingFilledSets(!isShowingFilledSets);
                                            }}
                                            className={`w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20 ${isShowingFilledSets ? 'rotate-180 bg-white text-pink-500' : ''}`}
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Glassy Cycle Tabs - Only shown when toggled */}
                                    <AnimatePresence>
                                        {isShowingFilledSets && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                                className={`relative z-10 flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-xl gap-1 mt-6 ${Number(bidCycle || 0) > 4 ? 'overflow-x-auto scrollbar-hide snap-x' : ''}`}
                                                ref={cycleTabsRef}
                                                style={Number(bidCycle || 0) > 4 ? { msOverflowStyle: 'none', scrollbarWidth: 'none' } : {}}
                                            >
                                                {Array.from({ length: Number(bidCycle || 0) }, (_, i) => i + 1).map((cycleNum) => {
                                                    const isActive = selectedCycle === cycleNum;
                                                    const isScrollable = Number(bidCycle || 0) > 4;
                                                    return (
                                                        <button
                                                            key={cycleNum}
                                                            onClick={() => setSelectedCycle(cycleNum)}
                                                            className={`relative ${isScrollable ? 'flex-none min-w-[85px] snap-center' : 'flex-1'} px-3 py-2 text-[11px] font-bold rounded-xl transition-all duration-300 ${isActive ? "text-pink-600" : "text-white/80 hover:text-white"}`}
                                                            data-active={isActive}
                                                        >
                                                            {isActive && (
                                                                <motion.div
                                                                    layoutId="historyTab"
                                                                    className="absolute inset-0 bg-white rounded-xl shadow-md"
                                                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                                                 />
                                                            )}
                                                            <span className="relative z-10">{t.cycle} {cycleNum}</span>
                                                        </button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Content Area - Historical Sets or Empty State */}
                                <AnimatePresence>
                                    {isShowingFilledSets && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="relative z-10 mx-1.5 -mt-6 pb-2 bg-white rounded-xl bg-white/50 backdrop-blur-md border border-white/20 text-center overflow-hidden"
                                        >
                                            <div className="">
                                                <HistoricalSetsSection
                                                    completeSets={completeSets}
                                                    selectedCycle={selectedCycle}
                                                    bidCycle={bidCycle}
                                                    bidName={bidName}
                                                    t={t}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {Number(selectedCycle) === Number(bidCycle) && bidData?.redirect !== "RESULT" && (
                            <>
                                <TicketGridSection
                                    t={t}
                                    currentTicket={currentTicket}
                                    selectedTickets={selectedTickets}
                                    handleTicketSelect={handleTicketSelect}
                                    bidCycle={bidCycle}
                                    batchCount={batchCount}
                                    duplicateTicketNumbers={duplicateTicketNumbers}
                                />

                                <KeypadSection
                                    t={t}
                                    currentTicket={currentTicket}
                                    inputValue={inputValue}
                                    handleCancelInput={handleCancelInput}
                                    handleDelete={handleDelete}
                                    handleConfirm={handleConfirm}
                                    handleNumberClick={handleNumberClick}
                                    handleAutoPick={handleAutoPick}
                                    handleClearAll={handleClearAll}
                                    handleSubmit={handleSubmit}
                                    selectedTicketsCount={Object.keys(selectedTickets).length}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <BottomNavBar />

            <PopupBannerForBidPage
                isShow={!isLoading && bidData?.redirect === "RESULT" && !hasDismissedResultPopup}
                data={{
                    title: t.resultAwaiting,
                    description: (bidData?.textChange || bidData?.redirect_to === "BID_END")
                        ? t.resultAwaitingCycleGeneral
                        : t.resultAwaitingCycleEnd,
                }}
                confirmText={t.checkBidHistory}
                onConfirm={() => {
                    setHasDismissedResultPopup(true);
                    setIsShowingFilledSets(true);
                }}
            />

            <SuccessBidPopup
                isShow={showSuccessPopup}
                batchCount={batchCount}
                onConfirm={handlePlayMoreBids}
            />

            <PopupBannerForDuplicateSet
                isShow={showDuplicatePopup}
                duplicateSets={duplicateSets}
                onConfirm={() => {
                    setShowDuplicatePopup(false);
                    const dupNums: string[] = [];
                    if (duplicateSets) {
                        Object.values(duplicateSets).forEach((cycleData: any) => {
                            Object.values(cycleData).forEach((details: any) => {
                                if (Array.isArray(details)) {
                                    details.forEach((item: any) => {
                                        if (item?.number) {
                                            dupNums.push(item.number.toString());
                                        }
                                    });
                                }
                            });
                        });
                    }
                    setDuplicateTicketNumbers(dupNums);
                }}
            />

            {isLoading && <WaitLoader isOverlay />}
        </>
    );
}

const TimerSection = React.memo(({ endTime }: { endTime: string | undefined }) => {
    const { t } = useLanguage();
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime || ""));

    useEffect(() => {
        if (!endTime) return;
        const id = setInterval(() => {
            setTimeLeft(getTimeLeft(endTime));
        }, 1000);
        return () => clearInterval(id);
    }, [endTime]);

    return (
        <div className="relative z-20 -mt-8 mb-2 mx-auto w-[85%] max-w-[280px] transform-gpu translate-z-0">
            {/* Subtle Outer Glow */}
            <div className="absolute -inset-0.5  rounded-2xl blur-[2px] opacity-20" />

            <div className="relative rounded-2xl p-2 shadow-xl border border-white/50 bg-white/50 backdrop-blur-md border border-white/20 text-center shadow-xl">

                <div className="flex items-center justify-center gap-2">
                    {timeLeft.split(" : ").map((unit, i) => (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center gap-1">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                                        <div className="absolute inset-[1px] border border-white/20 rounded-[7px]" />
                                        <span className="text-base font-black text-white tabular-nums drop-shadow-sm">
                                            {unit}
                                        </span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/10 to-transparent rounded-b-lg pointer-events-none" />
                                </div>
                                <span className="text-[9px] font-bold text-slate-600 ">
                                    {[t.daysShort, t.hoursShort, t.minutesShort, t.secondsShort][i]}
                                </span>
                            </div>
                            {i < 3 && (
                                <div className="text-lg font-extrabold text-rose-500/60 -mt-3 animate-pulse">:</div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
});

// ── Sub-components ───────────────────────────────────────────────────────────

const HeaderSection = React.memo(({ navigate, bidName, t }: any) => (
    <div className="relative gradient-home-section py-4 px-3 pb-7 overflow-hidden rounded-xl mb-4 shadow-xl shadow-pink-200/20 flex flex-col justify-center items-center gap-2 transform-gpu translate-z-0">
        <button
            onClick={() => navigate(-1)}
            className="absolute left-3 top-3 p-1 bg-white/95 hover:bg-white rounded-xl backdrop-blur-sm transition-all active:scale-95 shadow-sm border border-white/10"
        >
            <ChevronLeft className="w-5 h-5 text-indigo-600" />
        </button>

        <div className="absolute right-3 top-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{t.live}</span>
        </div>
        <div className="relative z-10 max-w-md mx-auto text-center flex flex-col items-center gap-1">
            <h1 className="text-xl font-bold text-white drop-shadow-md">
                {bidName ? (
                    bidName.toLowerCase().includes("daily")
                        ? `${t.bidDaily} ${bidName.split(" ").pop()}`
                        : `${t.bidWeekly} ${bidName.split(" ").pop()}`
                ) : (
                    t.placeYourBid || "Place Your Bid"
                )}
            </h1>
        </div>
    </div>
));

const PreviousBidsSection = React.memo(({ t, isShowingFilledSets, setIsShowingFilledSets }: any) => {
    return (
        <button
            onClick={() => setIsShowingFilledSets(!isShowingFilledSets)}
            className="w-full py-3 px-4 flex items-center justify-between transition-all active:scale-[0.98] group"
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <History className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-700 tracking-tight">
                    {t.previousBidsInfo}
                </span>
            </div>
            <div className={`transition-all duration-300 w-8 h-8 rounded-full flex items-center justify-center ${isShowingFilledSets ? 'bg-indigo-600 text-white rotate-180 shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                <ChevronDown className="w-4 h-4" />
            </div>
        </button>
    );
});

const HistoricalSetsSection = React.memo(({ completeSets, selectedCycle, bidCycle, bidName, t }: any) => {
    // Show empty state if no sets or no completeSets object
    const currentCycleSets = completeSets?.[selectedCycle.toString()] || [];

    return (
        <div className="space-y-4 transform-gpu translate-z-0">
            <div className="flex overflow-x-auto gap-2 px-1 scrollbar-hide snap-x pt-8" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', marginTop: '0' }}>
                {currentCycleSets.length > 0 ? (
                    currentCycleSets.map((setData: any, setIndex: number) => {
                        const setNumbers = [
                            setData.batch_set_1, setData.batch_set_2, setData.batch_set_3,
                            setData.batch_set_4, setData.batch_set_5, setData.batch_set_6
                        ];
                        const isWeekly = bidName?.toLowerCase().includes("weekly");
                        const themes = isWeekly ? WEEKLY_THEMES : DAILY_THEMES;
                        const theme = themes[setIndex % themes.length];

                        return (
                            <div key={setIndex} className={`${completeSets[selectedCycle.toString()].length === 1 ? "w-full" : "min-w-[85%]"} flex-shrink-0 snap-center relative rounded-2xl transform-gpu translate-z-0`}>
                                <div className="rounded-xl relative">
                                    <div className={`absolute -top-[2px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center gap-2.5 w-[55%] rounded-xl ${theme.gradient} p-2 shadow-lg`}>
                                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                                        <div className="relative z-10 w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-lg transform -rotate-2">
                                            <Hammer className={`w-3.5 h-3.5 ${theme.accentText}`} />
                                        </div>
                                        <h3 className="relative z-10 text-[12px] font-black text-white tracking-[1.5px] uppercase whitespace-nowrap">
                                            {t.setNumbersTitle?.replace("{0}", setData.batch_bid_batch)}
                                        </h3>
                                    </div>

                                    <div className=" rounded-[14px] p-1 pt-9 relative overflow-hidden">
                                        <div className="grid grid-cols-2 gap-2">
                                            {setNumbers.map((val, idx) => (
                                                <div key={idx} className="relative rounded-2xl overflow-hidden shadow-md transform-gpu translate-z-0">
                                                    <div
                                                        className={`relative ${theme.gradient} p-2 h-14 flex flex-col items-center justify-center`}
                                                        style={SET_ITEM_MASK_STYLE}
                                                    >
                                                        <div className="absolute inset-1.5 border-2 border-dashed border-white/80 rounded-lg pointer-events-none" />
                                                        <p className="text-sm font-bold text-white drop-shadow-md">{val}</p>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-xl text-center w-full mb-2"
                    >


                        <div className="relative z-10">
                            {/* Large soft violet icon container as seen in image */}
                            <div className="w-16 h-16 bg-violet-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4">
                                <History className="w-12 h-12 text-violet-400" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-tight">
                                {t.noSetsCompleted}
                            </h3>

                            <p className="text-sm font-semibold text-gray-500 px-4 leading-relaxed max-w-[300px] mx-auto">
                                {Number(selectedCycle) === Number(bidCycle)
                                    ? t.noSetsCompletedCurrentCycle
                                    : t.noSetsCompletedOtherCycle
                                }
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
});

const TicketGridSection = React.memo(({ t, currentTicket, selectedTickets, handleTicketSelect, bidCycle, batchCount, duplicateTicketNumbers = [] }: any) => (
    <div className="relative transform-gpu translate-z-0 grid-anchor">
        <div className="absolute -inset-1 rounded-xl blur-2xl opacity-10 bg-indigo-500" />
        <div className="relative rounded-xl p-[4px] gradient-home-section shadow-xl">
            <div className="border-2 border-dashed border-white/80 rounded-xl p-1 relative">
                <div className="bg-white/95 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-3 w-[75%] mx-auto relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-1.5 px-3 shadow-lg mb-2 transform-gpu translate-z-0">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-xl transform -rotate-3">
                            <Sparkles className="w-4 h-4 text-pink-500" fill="currentColor" />
                        </div>
                        <h2 className="text-base font-semibold text-white ">{t.fillYourTickets}</h2>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                        <div className="relative px-3 py-1 bg-rose-50 rounded-full border border-rose-400 flex items-center gap-2">
                            <motion.div
                                animate={{ opacity: [0, 0.4, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full bg-rose-400 blur-sm"
                            />
                            <span className="relative z-10 text-xs font-semibold text-rose-700">
                                {t.activeCycle || "Cycle"}
                            </span>
                            <div className="relative z-10 bg-white text-pink-600 rounded-lg px-2.5 py-0.5 text-xs font-semibold shadow-lg transform -rotate-2 border border-pink-100">
                                {bidCycle}
                            </div>
                        </div>

                        <div className="relative px-3 py-1 bg-indigo-50 rounded-full border border-indigo-400 flex items-center gap-2">
                            <motion.div
                                animate={{ opacity: [0, 0.4, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute inset-0 rounded-full bg-indigo-400 blur-sm"
                            />
                            <span className="relative z-10 text-xs font-semibold text-indigo-700">
                                {t.set}
                            </span>
                            <div className="relative z-10 bg-indigo-500 text-white rounded-lg px-2.5 py-0.5 text-xs font-semibold shadow-lg transform rotate-2">
                                {batchCount}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2">
                        {Array(6).fill(null).map((_, index) => {
                            const isSelected = currentTicket === index;
                            const hasValue = selectedTickets[index];
                            const isDuplicate = hasValue && duplicateTicketNumbers.includes(hasValue);
                            
                            const ticketColor = isDuplicate
                                ? "bg-gradient-to-br from-rose-500 via-red-500 to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                                : (hasValue ? "gradient-diamond" : "gradient-button-gold");

                            const dashedBorderColor = isSelected
                                ? "border-[3px] border-white scale-[1.02] z-20 animate-[pulse_4s_ease-in-out_infinite]"
                                : (isDuplicate ? "border-white/80" : (hasValue ? "border-white" : "border-black"));

                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => handleTicketSelect(index)}
                                    className={`relative group active:scale-95 transition-all duration-300 transform-gpu translate-z-0 ${isSelected ? "z-10 scale-105" : ""}`}
                                >
                                    <div className="relative rounded-3xl overflow-hidden">
                                        <div
                                            className={`relative ${ticketColor} p-4 h-20 flex flex-col items-center justify-center`}
                                            style={TICKET_MASK_STYLE}
                                        >
                                            <div className={`absolute inset-2 border-2 border-dashed rounded-xl pointer-events-none transition-all duration-300 ${dashedBorderColor}`} />

                                            {hasValue ? (
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <p className="text-xl font-bold text-white drop-shadow-md">{hasValue}</p>
                                                    {isDuplicate ? (
                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-black/30 rounded-full border border-white/20">
                                                            <X className="w-3 h-3 text-white" strokeWidth={3} />
                                                            <span className="text-[9px] font-bold text-white ">{t.duplicate}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full">
                                                            <Check className="w-3 h-3 text-white" />
                                                            <span className="text-[9px] font-semibold text-white ">{t.filled}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="relative z-10 text-center">
                                                    <p className="text-xs font-bold text-indigo-600 tracking-[0.3px] mb-1">{t.ticket} {index + 1}</p>
                                                    <p className="text-[11px] font-bold text-[#ff0067] tracking-[0.3px]">{t.tapToEnter}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {Object.keys(selectedTickets).length === 6 && (
                        <div className="flex justify-center">
                            <div className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-xl border border-white/20 transform-gpu translate-z-0">
                                <p className="text-xs font-bold text-white ">✨ {t.goodLuck}! ✨</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
));

const KeypadSection = React.memo(({
    t, currentTicket, inputValue, handleCancelInput, handleDelete,
    handleConfirm, handleNumberClick, handleAutoPick, handleClearAll, handleSubmit, selectedTicketsCount
}: any) => (
    <div className="relative rounded-xl p-[4px] gradient-home-section shadow-2xl transform-gpu translate-z-0">
        <div className="border-2 border-dashed border-white/80 rounded-xl p-1">
            <div className="bg-white/95 rounded-lg p-3">
                <AnimatePresence>
                    {currentTicket !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden border-b border-indigo-50 pb-2 transform-gpu translate-z-0"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col border-l-4 border-pink-500 pl-3">
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-widest">
                                        {t.ticket} - {currentTicket + 1}
                                    </h3>
                                    <span className="text-xs font-bold text-slate-600  mt-1">
                                        {t.enterTicketNumber}
                                    </span>
                                </div>
                                <button onClick={handleCancelInput} className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-90 transform-gpu translate-z-0">
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <div className="flex justify-center gap-2 mb-6">
                                {[0, 1, 2, 3].map((i) => {
                                    const isFilled = !!inputValue[i];
                                    const isNext = inputValue.length === i;
                                    return (
                                        <div
                                            key={i}
                                            className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all duration-300 transform-gpu translate-z-0
                              ${isFilled ? 'border-pink-500 text-pink-600 bg-pink-50/50 shadow-[0_0_10px_rgba(236,72,153,0.2)] scale-105' :
                                                    isNext ? 'border-indigo-500 text-indigo-600 bg-indigo-50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' :
                                                        'border-indigo-300 text-slate-200 bg-slate-50'}`}
                                        >
                                            {inputValue[i] || "•"}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={inputValue.length === 0}
                                    className="flex-1 py-3.5 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-xl font-semibold text-xs active:scale-95 disabled:opacity-95 flex items-center justify-center gap-2 shadow-lg shadow-rose-200/50 transform-gpu translate-z-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {t.delete}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={inputValue.length === 0}
                                    className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-xs shadow-lg shadow-emerald-200/50 active:scale-95 transition-transform flex items-center justify-center gap-2 transform-gpu translate-z-0"
                                >
                                    <Check className="w-4 h-4" />
                                    {t.confirm}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-5 gap-0.5 mb-4 mt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                        <button
                            key={num}
                            disabled={currentTicket === null || inputValue.length >= 4}
                            onClick={() => handleNumberClick(num.toString())}
                            className="w-13 h-12 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 border-2 border-white text-white text-base font-bold flex items-center justify-center shadow-lg active:scale-95 active:opacity-90 disabled:opacity-90 will-change-transform transform-gpu translate-z-0"
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={handleAutoPick}
                        className="py-4 bg-indigo-600 text-white font-semibold text-xs rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-2 border border-white/10 transform-gpu translate-z-0"
                    >
                        <Shuffle className="w-4 h-4" />
                        {t.autoPick}
                    </button>
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="py-4 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-semibold text-xs rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-2 border border-white/10 transform-gpu translate-z-0"
                    >
                        <Trash2 className="w-4 h-4" />
                        {t.clearAll}
                    </button>
                </div>

                <button
                    type="button"
                    disabled={selectedTicketsCount !== 6}
                    className={`w-full mx-auto py-2 rounded-xl font-semibold leading-relaxed text-lg transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 mt-4 transform-gpu translate-z-0
                  ${selectedTicketsCount === 6
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_10px_30px_rgba(255,0,156,0.4)]"
                            : "bg-indigo-100 text-indigo-600 border-2 border-indigo-400 opacity-80"
                        }`}
                    onClick={handleSubmit}
                >
                    {selectedTicketsCount === 6 ? (
                        <div className="flex items-center gap-2">
                            <span className="uppercase">{t.submitAllTickets}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>{t.fillAllTickets}</span>
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">
                                {selectedTicketsCount}/6
                            </span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    </div>
));
