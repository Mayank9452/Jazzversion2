import { useState, useEffect } from "react";
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
// import biddingPageImg from "../assets/image/biddingPage.png";
// import jackpotGif from "../assets/image/jackpot.gif";

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

export default function BiddingPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [selectedTickets, setSelectedTickets] = useState<{
        [key: number]: string;
    }>({});
    const [currentTicket, setCurrentTicket] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [timeLeft, setTimeLeft] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
    const [duplicateSets, setDuplicateSets] = useState<any>(null);
    const [isShowingFilledSets, setIsShowingFilledSets] = useState(false);
    const { t } = useLanguage();



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
    const bidName = bidInfo?.bid_name?.replace(/\+/g, " ");
    const bidCycle = bidData?.cycleCount;
    const batchCount = bidData?.batchCount;
    const completeSets = bidData?.completeSets;

    useEffect(() => {
        const encodedBidId = sessionStorage.getItem("bidId");
        if (encodedBidId) {
            dispatch(fetchBidInfo(encodedBidId));
        }
    }, []);

    useEffect(() => {
        if (!bidInfo?.bid_end_timestamp) return;

        setTimeLeft(getTimeLeft(bidInfo.bid_end_timestamp));
        const id = setInterval(() => {
            setTimeLeft(getTimeLeft(bidInfo.bid_end_timestamp));
        }, 1000);
        return () => clearInterval(id);
    }, [bidInfo?.bid_end_timestamp]);

    const tickets = Array(6).fill(null);

    const handleNumberClick = (num: string) => {
        if (currentTicket === null) return;

        const newValue = inputValue + num;
        if (newValue.length <= 4) {
            setInputValue(newValue);
        }
    };

    const handleTicketSelect = (index: number) => {
        setCurrentTicket(index);
        setInputValue(selectedTickets[index] || "");
    };

    const handleConfirm = () => {
        if (currentTicket !== null && inputValue.length > 0) {
            setSelectedTickets({ ...selectedTickets, [currentTicket]: inputValue });
            setInputValue("");
            setCurrentTicket(null);
        }
    };

    const handleDelete = () => {
        setInputValue(inputValue.slice(0, -1));
    };

    const handleConfirmValue = () => {
        if (inputValue.length === 4) {
            handleConfirm();
        }
    };

    const handleCancelInput = () => {
        setInputValue("");
        setCurrentTicket(null);
    };

    const handleAutoPick = () => {
        const newTickets: { [key: number]: string } = {};
        tickets.forEach((_, index) => {
            const digits = Math.floor(Math.random() * 4) + 1; // 1-4 digits
            const maxNum = Math.pow(10, digits) - 1;
            const minNum = Math.pow(10, digits - 1);
            newTickets[index] = Math.floor(
                minNum + Math.random() * (maxNum - minNum + 1),
            ).toString();
        });
        setSelectedTickets(newTickets);
        setCurrentTicket(null);
        setInputValue("");
    };

    const handleClearAll = () => {
        setSelectedTickets({});
        setCurrentTicket(null);
        setInputValue("");
    };

    const handleSubmit = async (e?: any) => {
        e?.preventDefault();

        if (Object.keys(selectedTickets).length !== 6) return;

        const numbersArray = Object.values(selectedTickets).map(Number);

        const checkPayload = {
            bid: btoa(bidInfo?.bid_id.toString()),
            data: JSON.stringify(numbersArray),
        };

        try {
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
            console.error("Error:", err.message);
        }
    };

    const handlePlayMoreBids = () => {
        const encodedBidId = sessionStorage.getItem("bidId");
        if (encodedBidId) {
            dispatch(fetchBidInfo(encodedBidId));
        }
        setSelectedTickets({});
        setShowSuccessPopup(false);
    };



    return (
        <>
            <TopBar />
            <div className="min-h-screen overflow-x-hidden relative">
                {/* Background Layers */}
                <div className="h-[100vh] fixed w-full top-0 left-0 z-[-1] overflow-hidden">
                    <img
                        src="/assets/images/biddingPage.png"
                        className="w-full h-full object-cover"
                        alt="Background"
                    />
                </div>
                {/* Jackpot GIF Overlay (Appears ABOVE all components) */}
                <div className="fixed inset-0 z-[50] overflow-hidden pointer-events-none mix-blend-screen ">
                    <img
                        src="/assets/images/jackpot.gif"
                        className="w-full h-full object-cover"
                        alt="Jackpot"
                    />
                </div>

                <div className="relative z-10 p-2 pb-8">

                    {/* Global Brand Gradient Header */}
                    <div className="relative gradient-home-section py-4 px-3 overflow-hidden rounded-xl mb-4 shadow-xl shadow-pink-200/20 flex flex-col justify-center items-center gap-2">
                        {/* Dashed internal border */}
                        <div className="absolute inset-2 border-2 border-dashed border-white/70 rounded-xl pointer-events-none" />
                        <div className="relative z-10 max-w-md mx-auto text-center flex flex-col items-center gap-1">
                            <h1 className="text-xl font-bold text-white  drop-shadow-md">
                                {bidName?.includes("Daily")
                                    ? `${t.bidDaily} ${bidName?.split(" ")[2]}`
                                    : `${t.bidWeekly} ${bidName?.split(" ")[2]}`}
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 shadow-sm shadow-yellow-400 animate-pulse">
                                <span className="text-[10px] font-bold text-white uppercase opacity-80">
                                    {t.activeCycle || "Cycle"}
                                </span>
                                <div className="bg-white text-pink-600 rounded-lg px-2.5 py-0.5 text-[12px] font-bold shadow-lg transform -rotate-2">
                                    {bidCycle}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 shadow-sm shadow-yellow-400 animate-pulse">
                                <span className="text-[10px] font-bold text-white uppercase opacity-80">
                                    Set
                                </span>
                                <div className="bg-indigo-500 text-white rounded-lg px-2.5 py-0.5 text-[12px] font-bold shadow-lg transform rotate-2">
                                    {batchCount}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Small Premium Timer */}
                    <div className="flex flex-col items-center justify-center -mt-12 bg-white backdrop-blur-2xl  w-[85%] rounded-xl p-2 mx-auto mb-4 ">
                        {/* <div className="flex items-center gap-1.5 mb-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1 border border-white/20">
                <Clock className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-bold  tracking-[2.5px] text-white">
                  {t.endsIn || "Ends In"}
                </span>
              </div> */}

                        <div className="flex items-center justify-center gap-2 ">
                            {timeLeft.split(" : ").map((unit, i) => (
                                <div key={i} className="flex items-center justify-center gap-2">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative bg-[#ff084bcc]/80 backdrop-blur-lg border border-white/80 rounded-xl w-12 h-12 flex items-center justify-center shadow-2xl">
                                            <span className="text-lg font-bold text-white tabular-nums drop-shadow-lg">
                                                {unit}
                                            </span>
                                        </div>
                                        <span className="text-[10px]  font-bold text-pink-500/90 mt-1.5">
                                            {[t.daysShort, t.hoursShort, t.minutesShort, t.secondsShort][i]}
                                        </span>
                                    </div>
                                    {i < 3 && (
                                        <div className="text-xl font-bold text-[#ff084bcc] mb-5 animate-pulse">
                                            :
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Note & Show Filled Sets Button */}
                    <div className="flex flex-col items-center gap-3 mb-4 w-[100%] mx-auto relative z-10">
                        {/* Unique Numbers Note */}
                        <div className="flex items-start gap-3 bg-indigo-500/10 backdrop-blur-md border border-white/50 rounded-2xl p-3 w-full shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                            <div className="bg-[#ff0000] p-2 rounded-xl mt-0.5">
                                <Info className="w-4 h-4 text-white font-bold" />
                            </div>
                            <div className="flex flex-col justify-center gap-0.5">
                                <span className="text-[12px] font-bold text-[#ff0000] uppercase ">{t.note} :-</span>
                                <p className="text-[11px] font-semibold text-white tracking-widest leading-relaxed">
                                    {t.uniqueNumbersNote}
                                </p>
                                {completeSets && completeSets.length > 0 && (
                                    <button
                                        onClick={() => setIsShowingFilledSets(!isShowingFilledSets)}
                                        className="w-full h-12 bg-gradient-to-r from-pink-600/20 to-rose-600/20 hover:from-pink-600/30 hover:to-rose-600/30 backdrop-blur-xl text-white text-[11px] font-bold rounded-2xl shadow-xl border border-white/20 transition-all active:scale-95 flex items-center justify-center gap-2.5 uppercase group overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        {isShowingFilledSets ? (
                                            <>
                                                <X className="w-4 h-4 text-pink-400" />
                                                <span>{t.hideFilledSets}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-4 h-4 text-pink-400" />
                                                <span>{t.showAllFilledSets}</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                        </div>

                        {/* View Filled Sets Button */}

                    </div>

                    {/* Content Wrapper - Using Tinted Layers to Replace White Backgrounds */}
                    <div className="">
                        <div className="max-w-md mx-auto space-y-6">
                            {/* Historical Filled Sets - Horizontal Scroll */}
                            <AnimatePresence>
                                {isShowingFilledSets && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 px-1 scrollbar-hide">
                                            {completeSets?.map((setData: any, setIndex: number) => {
                                                const setNumbers = [
                                                    setData.batch_set_1,
                                                    setData.batch_set_2,
                                                    setData.batch_set_3,
                                                    setData.batch_set_4,
                                                    setData.batch_set_5,
                                                    setData.batch_set_6
                                                ];
                                                return (
                                                    <div
                                                        key={setIndex}
                                                        className={`${completeSets.length === 1 ? "w-full" : "min-w-[80%]"} flex-shrink-0 snap-center relative`}
                                                    >
                                                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl blur-xl" />
                                                        <div className="relative rounded-xl p-2 shadow-2xl border border-white/40 bg-white/5 backdrop-blur-sm">
                                                            <div className="border-2 border-dashed border-white/60 rounded-xl p-3">
                                                                {/* Header for Historical Set */}
                                                                <div className="flex items-center justify-center gap-2 w-[70%] mx-auto relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-[#fd0075] p-1.5 shadow-lg mb-4 backdrop-blur-2xl">
                                                                    <Trophy className="w-4 h-4 text-white" />
                                                                    <h3 className="text-[12px] font-bold text-white ">
                                                                        {t.setNumbersTitle.replace("{0}", setData.batch_bid_batch)}
                                                                    </h3>
                                                                </div>

                                                                {/* Mini Grid for Historical Set */}
                                                                <div className="grid grid-cols-2 gap-3 mb-2">
                                                                    {setNumbers.map((val, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className="relative rounded-2xl overflow-hidden ring-2 ring-white shadow-md"
                                                                        >
                                                                            <div className="relative bg-[linear-gradient(to_right,_#fb9f35,_#fe0d68)] p-2 h-14 flex flex-col items-center justify-center">
                                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                                                                <div className="absolute inset-1.5 border-2 border-dashed border-white/80 rounded-lg pointer-events-none" />

                                                                                {/* Mini Notches */}
                                                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-6 bg-[#f8fafc] rounded-r-full" />
                                                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-6 bg-[#f8fafc] rounded-l-full" />

                                                                                <p className="text-sm font-bold text-white drop-shadow-md">
                                                                                    {val}
                                                                                </p>
                                                                                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full mt-0.5">
                                                                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                                                    <span className="text-[8px] font-bold text-white ">{t.filled}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Tickets Grid - Tinted Container (Less White) */}
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-xl blur-2xl" />

                                {/* Tinted container instead of bg-white */}
                                <div className="relative rounded-xl p-2 shadow-2xl border border-white/50">
                                    {/* Grid Header */}
                                    <div className="border-2 border-dashed border-white rounded-xl p-3 ">
                                        <div className="flex items-center justify-center gap-3 w-[80%] mx-auto relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 p-2 shadow-xl  mb-6 backdrop-blur-2xl">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl transform -rotate-3 transition-transform hover:rotate-0">
                                                <Sparkles
                                                    className="w-5 h-5 text-pink-500"
                                                    fill="currentColor"
                                                />
                                            </div>
                                            <h2 className="text-base font-bold text-white ">
                                                {t.fillYourTickets}
                                            </h2>
                                        </div>

                                        {/* Tickets Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <AnimatePresence mode="popLayout">
                                                {tickets.map((_, index) => {
                                                    const isSelected = currentTicket === index;
                                                    const hasValue = selectedTickets[index];

                                                    // Using White cards for tickets to pop against the tinted container
                                                    const ticketColor = hasValue
                                                        ? " gradient-diamond"
                                                        : "gradient-button-gold border-2 border-pink-100/50";

                                                    return (
                                                        <motion.button
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            type="button"
                                                            key={index}
                                                            onClick={() => handleTicketSelect(index)}
                                                            className={`relative group active:scale-95 transition-all duration-300 ${isSelected ? "z-10 scale-105" : ""}`}
                                                        >
                                                            <div
                                                                className={`relative rounded-3xl overflow-hidden ${isSelected ? "ring-4 ring-pink-500/20 shadow-2xl" : "shadow-lg shadow-pink-200/20"}`}
                                                            >
                                                                <div
                                                                    className={`relative ${ticketColor} p-4 h-20 flex flex-col items-center justify-center`}
                                                                >
                                                                    {/* Shimmer for filled */}
                                                                    {hasValue && (
                                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                                                    )}

                                                                    {/* Dashed internal border */}
                                                                    <div
                                                                        className={`absolute inset-2 border-2 border-dashed rounded-xl pointer-events-none ${hasValue ? "border-white/70" : "border-black"}`}
                                                                    />

                                                                    {/* Premium Notches - Matched to Body Color #f8fafc */}
                                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-10 bg-[#f8fafc] rounded-r-full shadow-inner" />
                                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-10 bg-[#f8fafc] rounded-l-full shadow-inner" />

                                                                    {hasValue ? (
                                                                        <motion.div
                                                                            initial={{ scale: 0.5 }}
                                                                            animate={{ scale: 1 }}
                                                                            className="relative z-10 flex flex-col items-center justify-center gap-0"
                                                                        >
                                                                            <p className="text-xl font-bold text-white drop-shadow-md">
                                                                                {hasValue}
                                                                            </p>
                                                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                                                                <Check
                                                                                    className="w-3.5 h-3.5 text-white"
                                                                                    strokeWidth={3}
                                                                                />
                                                                                <span className="text-[10px] font-bold text-white ">
                                                                                    {t.filled}
                                                                                </span>
                                                                            </div>
                                                                        </motion.div>
                                                                    ) : (
                                                                        <div className="relative z-10 text-center">
                                                                            <p className="text-[11px] font-bold text-indigo-900  mb-1">
                                                                                {t.ticket} {index + 1}
                                                                            </p>
                                                                            <p className="text-[12px] font-bold text-[#ff0067] ">
                                                                                {t.tapToEnter}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </div>

                                        {/* Good Luck Badge */}
                                        <div className="flex justify-center ">
                                            <div className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-xl border border-white/20">
                                                <p className="text-xs font-bold text-white  ">
                                                    ✨ {t.goodLuck}! ✨
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MODERN INPUT DISPLAY */}
                            <AnimatePresence>
                                {currentTicket !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative space-y-4"
                                    >
                                        <div className="relative rounded-xl p-6 shadow-2xl border border-white/30">
                                            {/* Dashed internal border */}
                                            <div className="absolute inset-2 border-2 border-dashed border-white/70 rounded-xl pointer-events-none" />
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                                        <span className="text-sm font-bold text-indigo-600">{currentTicket + 1}</span>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">{t.enterTicketNumber}</h3>
                                                </div>
                                                <button onClick={handleCancelInput} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-white">
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>

                                            {/* Digit Bubbles */}
                                            <div className="flex justify-center gap-3 mb-8">
                                                {[0, 1, 2, 3].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={inputValue[i] ? { scale: [1, 1.1, 1] } : {}}
                                                        className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all duration-300
                            ${inputValue[i] ? 'border-pink-500 text-white bg-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-white/40 text-white bg-white/40'}`}
                                                    >
                                                        {inputValue[i] || "•"}
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleDelete}
                                                    disabled={inputValue.length === 0}
                                                    className="flex-1 bg-white/5 border border-white text-red-500 rounded-2xl py-4 font-bold text-[10px] tracking-widest uppercase active:scale-95 transition-transform"
                                                >
                                                    {t.delete}
                                                </button>
                                                <button
                                                    onClick={handleConfirm}
                                                    disabled={inputValue.length === 0}
                                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 border border-white text-white rounded-2xl py-4 font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
                                                >
                                                    {t.confirm}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* MODERN 3x4 KEYPAD */}
                            <div className="relative rounded-xl p-6 shadow-2xl border border-white/30">
                                {/* Dashed internal border */}
                                <div className="absolute inset-2 border-2 border-dashed border-white/70 rounded-xl pointer-events-none" />
                                <div className="grid grid-cols-5 gap-2 mb-6">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                                        <motion.button
                                            key={num}
                                            whileTap={{ scale: 0.9 }}
                                            disabled={currentTicket === null || inputValue.length >= 4}
                                            onClick={() => handleNumberClick(num.toString())}
                                            className="h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 border-2 border-white text-white text-xl font-bold flex items-center justify-center 
                             active:bg-pink-500/20 active:border-pink-500/50 transition-all shadow-lg"
                                        >
                                            {num}
                                        </motion.button>
                                    ))}

                                    {/* Backspace */}
                                    {/* <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    disabled={currentTicket === null || inputValue.length === 0}
                    className="h-14 rounded-2xl bg-red-500/30 border-2 border-red-500 text-red-500 flex items-center justify-center disabled:opacity-90"
                  >
                    <X className="w-6 h-6" />
                  </motion.button> */}

                                    {/* Zero */}
                                    {/* <motion.button
                    whileTap={{ scale: 0.9 }}
                    disabled={currentTicket === null || inputValue.length >= 4}
                    onClick={() => handleNumberClick("0")}
                    className="h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 border-2 border-white text-white text-xl font-bold flex items-center justify-center"
                  >
                    0
                  </motion.button> */}

                                    {/* Quick Confirm */}
                                    {/* <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleConfirmValue}
                    disabled={currentTicket === null || inputValue.length < 4}
                    className="h-14 rounded-2xl bg-pink-500/20 border-2 border-pink-500 text-pink-500 flex items-center justify-center disabled:opacity-90 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                  >
                    <Check className="w-6 h-6" />
                  </motion.button> */}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={handleAutoPick}
                                        className="bg-indigo-600 text-white font-bold text-[10px] tracking-widest py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10"
                                    >
                                        <Shuffle className="w-4 h-4" />
                                        {t.autoPick}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClearAll}
                                        className="bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold text-[10px] tracking-widest py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {t.clearAll}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button - Brand Primary */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                disabled={Object.keys(selectedTickets).length !== 6}
                                className={`w-fit mx-auto py-3 px-6 rounded-lg font-bold text-lg  shadow-2xl transition-all flex items-center justify-center gap-3  
                ${Object.keys(selectedTickets).length === 6
                                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/20"
                                        : "bg-gradient-to-r from-pink-400 to-rose-600 text-white border border-slate-200 cursor-not-allowed"
                                    }`}
                                onClick={handleSubmit}
                            >
                                {Object.keys(selectedTickets).length === 6 ? (
                                    <>{t.submitAllTickets}</>
                                ) : (
                                    <>
                                        {t.fillAllTickets} ({Object.keys(selectedTickets).length}/6)
                                    </>
                                )}
                            </motion.button>
                            <div className="text-center mt-6">
                                <p className="text-[10px] font-bold text-slate-300 tracking-[3.5px] ">
                                    ✨ {t.goodLuck}! ✨
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNavBar />

            <PopupBannerForBidPage
                isShow={bidData?.redirect === "RESULT"}
                data={{
                    title: t.resultAwaiting,
                    description:
                        bidData?.redirect_to === "CYCLE_END"
                            ? t.resultAwaitingCycleEnd
                            : t.resultAwaitingCycleGeneral,
                }}
                onConfirm={() => navigate("/dashboard")}
            />

            <SuccessBidPopup
                isShow={showSuccessPopup}
                batchCount={batchCount}
                onConfirm={handlePlayMoreBids}
            />

            <PopupBannerForDuplicateSet
                isShow={showDuplicatePopup}
                duplicateSets={duplicateSets}
                onConfirm={() => setShowDuplicatePopup(false)}
            />

            {isLoading && <WaitLoader isOverlay />}
        </>
    );
}
