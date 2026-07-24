"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
    fetchJazzSpinWinInfoThunk,
    fetchJazzSpinJSONThunk,
    processJazzSpinWinThunk
} from "../features/jazzSpinWin/jazzSpinWinSlice";
import { getProfileInfo } from "@/features/bidProfile/profileSlice";

interface PopupSpinWheelProps {
    isShow: boolean;
    onClose: () => void;
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

export const PopupSpinWheel: React.FC<PopupSpinWheelProps> = ({ isShow, onClose }) => {
    const dispatch = useAppDispatch();
    const { spinWinInfo, spinJSON } = useAppSelector((state) => state.jazzSpinWin);
    const avatar = useAppSelector((state) => state?.profile?.data?.data?.user?.avatar || "1.png");

    const [result, setResult] = useState<any | null>(null);
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [status, setStatus] = useState("idle"); // idle / success / lose
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

    useEffect(() => {
        if (isShow) {
            dispatch(fetchJazzSpinWinInfoThunk());
            dispatch(fetchJazzSpinJSONThunk());
        }
    }, [isShow, dispatch]);

    const defaultSegments = ["100", "50", "200", "50", "300", "400", "450", "500", "10", "100"];
    const defaultColors = [
        "#364C62", "#F1C40F", "#E67E22", "#E74C3C",
        "#98985A", "#95A5A6", "#16A085", "#27AE60", "#2980B9"
    ];

    const rawRewards = spinJSON?.segmentValuesArray || [];
    const rewards = rawRewards.length > 0
        ? (rawRewards.length % 2 !== 0
            ? [...rawRewards, { ...rawRewards[0], id: rawRewards[0].id + "_dup" }]
            : rawRewards)
        : defaultSegments.map((val, idx) => ({ id: String(idx + 1), value: val, resultText: `YOU WON ${val} COINS` }));

    const segmentCount = rewards.length || 10;
    const angle = 360 / segmentCount;

    const handleSpin = async () => {
        if (isSpinning) return;

        // Check eligibility status
        const hasSpins = spinWinInfo?.status;
        if (hasSpins === false) {
            return;
        }

        try {
            setIsSpinning(true);
            getSpinSound().play();
            setResult(null);
            setStatus("idle");

            const randomIndex = Math.floor(Math.random() * rewards.length);
            const rawSelected = rewards[randomIndex];
            const rawId = String(rawSelected.id).replace("_dup", "");
            const selectedSegment = {
                ...rawSelected,
                id: Number(rawId),
                name: rawSelected.resultText || (rawSelected.value + " Coins")
            };

            const targetAngle = 360 - randomIndex * angle;
            const final = 5 * 360 + targetAngle + (rotation % 360);

            setTimeout(() => {
                setRotation(final);
            }, 50);

            setTimeout(() => getSpinSound().pause(), successInterval + 250);

            setTimeout(async () => {
                setIsSpinning(false);
                setResult(selectedSegment);

                try {
                    await dispatch(processJazzSpinWinThunk(rawId));
                } catch (err) {
                    console.error("Failed to process spin result:", err);
                }

                if (selectedSegment?.id !== 0) {
                    getSpinSound().pause();
                    getSuccessSound().play();
                    setStatus("success");
                    dispatch(getProfileInfo()); // Refresh user coins!

                    setTimeout(() => {
                        setStatus("idle");
                        setResult(null);
                    }, successInterval);

                    setTimeout(() => setRotation(0), 1500);
                } else {
                    setTimeout(() => {
                        getLoseSound().play();
                        setStatus("lose");

                        setTimeout(() => {
                            setRotation(0);
                            getLoseSound().pause();
                            setStatus("idle");
                            setResult(null);
                        }, successInterval);
                    }, 1000);
                }
            }, successInterval + 750);
        } catch (error) {
            console.error("error::", error);
            setIsSpinning(false);
            getSpinSound().pause();
        }
    };

    return (
        <AnimatePresence>
            {isShow && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[95000] flex items-center justify-center bg-black/60 backdrop-blur-[6px] p-4 overflow-y-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-transparent flex flex-col items-center gap-4 w-full max-w-sm"
                    >
                        {/* Wheel Container */}
                        <div className="flex flex-col items-center space-y-4 w-full">
                            <div className="relative mt-0 flex flex-col items-center">
                                <div className="relative flex flex-col gap-0 items-center">
                                    <div className="px-[50px] sm:px-[65px] pb-8 pt-5 relative flex flex-col gap-8 items-center">
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative">
                                                {/* Wheel Layout identical to SpinWheelUpdatedVoucher */}
                                                <div className="h-[17rem] sm:h-80 aspect-square rounded-full shadow-[0_0_25px_35px_rgba(255,202,32,0.2)] dark:shadow-[0_0_25px_35px_rgba(255,202,32,0.45)] custom-box">
                                                    <div
                                                        className="absolute h-[6.25rem] sm:h-[8rem] z-[60] top-[0%] start-[50%] translate-x-[-45%] sm:translate-x-[-41%] translate-y-[-65%] sm:translate-y-[-58%] flex items-center justify-center"
                                                        style={{ opacity: "1" }}
                                                    >
                                                        <img
                                                            src="/assets/images/iconspin.png"
                                                            className="h-full w-full object-contain drop-shadow-[0px_8px_4px_rgba(0,0,0,1)]"
                                                            alt=""
                                                            loading="lazy"
                                                        />
                                                    </div>

                                                    {/* Stars and Lights ring */}
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
                                                            .map((_, index: number) => {
                                                                const arrayLength = 360 / 23;
                                                                const rotation = arrayLength * index - arrayLength / 2;
                                                                const defValue = window.innerWidth < 645 ? -5 : -6.4;
                                                                const bt = defValue + (segmentCount - 5) * 8.9;
                                                                const pt = -3 + (segmentCount - 5) * -1.2;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={cn(
                                                                            "segment absolute w-1/2 h-1/2 top-0 left-[50%] origin-bottom-right text-xs font-semibold text-black text-center flex items-end justify-center pb-2 overflow-hidden text-white"
                                                                        )}
                                                                        style={{
                                                                            transform: `rotate(${rotation}deg) skewY(-${90 - angle}deg)`,
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className="absolute inset-0 flex gap-2 items-center justify-center bottom-0 h-full"
                                                                            style={{
                                                                                transform: `skewY(${90 - angle}deg) rotate(${angle / 2}deg) translate(${pt}%, ${bt}%)`,
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className="relative h-[15px] aspect-square rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#fff9d1] to-[#927f02] shadow-[0px_5.5px_1px_-2.5px_rgba(0,0,0,1)] mb-1 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:shadow-[-2px_-3px_8px_0px_rgba(255,255,255,1)] after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:rounded-full after:shadow-[0px_0px_4px_4px_rgba(255,255,255,.25)]"
                                                                                style={{
                                                                                    transform: `rotate(-${index * arrayLength + 35}deg)`,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>

                                                    {/* Wheel Outer ring and segments */}
                                                    <div
                                                        className="relative h-full w-full overflow-hidden rounded-full outline outline-[#ffca20] outline-[20px] border-[6px] border-black"
                                                        style={{ borderStyle: "inset" }}
                                                    >
                                                        <div className="absolute z-[51] h-full w-full rounded-full border-[5px] border-white shadow-[inset_0_0_10px_4px_rgba(23,24,53,.81)]" />

                                                        {/* Spinning segments container */}
                                                        <div
                                                            className="w-full h-full bg-black"
                                                            style={{
                                                                transform: `rotate(${rotation}deg)`,
                                                                transition: isSpinning ? `transform ${successInterval}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : "none",
                                                                transformOrigin: "center center",
                                                            }}
                                                        >
                                                            {rewards.length > 0 &&
                                                                rewards.map((segment: any, index: number) => {
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
                                                                                className="absolute inset-0 flex flex-col gap-2 items-start justify-center bottom-0 h-full pe-3"
                                                                                style={{
                                                                                    transform: `skewY(${90 - angle}deg) rotate(${360 - (90 - angle / 2)}deg) translate(-${pt}%, -${ps}%)`,
                                                                                }}
                                                                            >
                                                                                <div className="h-[1.4rem] sm:h-6 w-full absolute flex items-center justify-center top-[45.5%] sm:top-[47%] -start-5">
                                                                                    {segment?.id === 0 ? (
                                                                                        <span
                                                                                            className="text-[13px] sm:text-[15px] text-center font-pop font-extrabold px-2 pt-0.5 leading-tight break-words"
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

                                                                                        if (!hasNumber) {
                                                                                            return (
                                                                                                <div
                                                                                                    className="flex flex-col items-center justify-start gap-1 text-center font-pop font-extrabold px-2"
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
                                                                                                className="-ms-2 flex flex-col items-center justify-start gap-1 text-center font-pop font-extrabold px-2"
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
                                                                                                        <span className="text-[16px] sm:text-xs font-bold opacity-90 uppercase ml-0.5">
                                                                                                            {unitStr}
                                                                                                        </span>
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
                                                                })}
                                                        </div>

                                                        {/* Center Pointer and Spin click button */}
                                                        <div
                                                            onClick={handleSpin}
                                                            className={cn(
                                                                "absolute h-16 sm:h-20 aspect-square rounded-full flex flex-col justify-center items-center cursor-pointer shadow-lg select-none z-[80] transition-all hover:scale-105 active:scale-95 border-2 border-white",
                                                                isSpinning
                                                                    ? "bg-slate-400 cursor-not-allowed opacity-80"
                                                                    : "bg-gradient-to-b from-[#ffca20] to-[#dfa208]"
                                                            )}
                                                            style={{
                                                                top: "50%",
                                                                left: "50%",
                                                                transform: "translate(-50%, -50%)",
                                                            }}
                                                        >
                                                            <span className="font-extrabold text-[15px] sm:text-[17px] text-[#0b2f5f] uppercase tracking-wide">
                                                                Spin
                                                            </span>
                                                        </div>

                                                        {/* Success / You Won overlay circle */}
                                                        {["success"].includes(status) && (
                                                            <div className="absolute inset-0 bg-[#0f213df0] backdrop-blur-sm rounded-full flex flex-col justify-center items-center z-[85] overflow-hidden custom-box-animate">
                                                                <div className="absolute h-full w-full flex flex-col justify-center items-center gap-2 p-4">
                                                                    <img
                                                                        src="/assets/images/you-won.png"
                                                                        className="w-full h-full absolute top-0 start-0 rounded-full z-[54] custom-win-banner"
                                                                        alt=""
                                                                        loading="lazy"
                                                                    />
                                                                    <img
                                                                        src="/assets/images/cartoon.gif"
                                                                        className="w-[50%] h-[50%] rounded-full object-cover drop-shadow-md relative z-10"
                                                                        alt=""
                                                                        loading="lazy"
                                                                    />
                                                                    <span className="font-black text-white text-md sm:text-2xl max-w-[70%] text-center relative z-10">
                                                                        {result?.name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Lose / Try Again overlay circle */}
                                                        {["lose"].includes(status) && (
                                                            <div className="absolute inset-0 bg-[#000000eb] backdrop-blur-sm rounded-full flex flex-col justify-center items-center z-[85] overflow-hidden custom-box-animate">
                                                                <div className="absolute h-full w-full flex flex-col justify-center items-center gap-2 p-4">
                                                                    <img
                                                                        src="/assets/images/cat-cry.gif"
                                                                        className="w-[50%] h-[50%] rounded-full object-cover drop-shadow-md"
                                                                        alt=""
                                                                        loading="lazy"
                                                                    />
                                                                    <span className="font-black text-white text-md sm:text-lg max-w-[85%] text-center mt-2">
                                                                        Try Again Tomorrow!
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
                        </div>

                        {/* Skip Button */}
                        <button
                            onClick={onClose}
                            className="mt-6 px-12 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-black/20"
                        >
                            Skip
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PopupSpinWheel;
