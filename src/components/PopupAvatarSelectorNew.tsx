"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./context/LanguageContext";

interface PopupAvatarSelectorProps {
    isShow: boolean;
    onClose: () => void;
    selectedAvatar: string;
    currentAvatar?: string;
    onSelect: (avatar: string) => void;
    onSave: (avatar: string, cost: number) => void;
    userCoins?: number;
}

const avatarCosts: Record<string, number> = {
    "1.png": 0,
    "2.png": 0,
    "3.png": 0,
    "4.png": 0,
    "5.png": 0,
    "6.png": 0,
    "7.png": 0,
    "8.png": 0,
    "9.png": 0,
    "10.png": 0,
    "11.png": 0,
    "12.png": 0,
    "13.png": 0,
    "14.png": 0,
    "15.png": 0,
    "16.png": 0,
    "17.png": 0,
    "18.png": 0,
    "19.png": 0,
    "20.png": 0,
    "21.png": 0,
    "22.png": 0,
    // "23.png": 300,
    // "24.png": 200,
    // "25.png": 150,
    // "26.png": 120,
    // "27.png": 0,
    // "28.png": 130,
    // "29.png": 200,
    // "30.png": 160,
    // "31.png": 0,
    // "32.png": 250,
    // "33.png": 120,
    // "34.png": 150
};

const PopupAvatarSelectorNew: React.FC<PopupAvatarSelectorProps> = ({
    isShow,
    onClose,
    selectedAvatar,
    currentAvatar = "1.png",
    onSelect,
    onSave,
    userCoins = 0,
}) => {
    const { t } = useLanguage();
    const [showConfirm, setShowConfirm] = useState(false);
    const [showLowBalance, setShowLowBalance] = useState(false);
    const [requiredCoins, setRequiredCoins] = useState(0);
    const avatars: string[] = Array.from(
        { length: 17 },
        (_, i) => `${i + 1}.png`
    );

    const handleSaveClick = () => {
        const cost = selectedAvatar === currentAvatar ? 0 : (avatarCosts[selectedAvatar] || 0);
        if (cost > 0) {
            setShowConfirm(true);
        } else {
            onSave(selectedAvatar, 0);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isShow && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[10px] z-[100] flex items-center justify-center p-4 will-change-transform"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-[#282828c2] dark:bg-[#0000002b] border border-white/20 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 overflow-hidden w-full max-w-sm will-change-transform"
                        >
                            {/* Glowing Corner Accents */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-brand-yellow-100 rounded-tl-[2.5rem] pointer-events-none" />
                            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-brand-yellow-100 rounded-tr-[2.5rem] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-brand-yellow-100 rounded-bl-[2.5rem] pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-brand-yellow-100 rounded-br-[2.5rem] pointer-events-none" />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute z-[50] top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 border-2 border-brand-yellow-100 flex items-center justify-center transition-all"
                            >
                                <X className="h-5 w-5 text-white/60 hover:text-white" />
                            </button>

                            <div className="relative z-10 w-full pt-4">
                                {/* Header */}
                                <div className="text-center mb-6 px-10">
                                    <h2 className="text-xl font-bold text-brand-yellow-100 mb-1 leading-tight">
                                        {t.chooseYourAvatar || "Choose Your Avatar"}
                                    </h2>
                                </div>

                                {/* Avatar Grid - 3 Columns */}
                                <div className="grid grid-cols-3 gap-x-3 gap-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar bg-white/5 p-3 rounded-2xl">
                                    {avatars.map((avatar) => {
                                        const cost = avatarCosts[avatar] || 0;
                                        const isAffordable = userCoins >= cost;
                                        const isSelected = selectedAvatar === avatar;

                                        return (
                                            <div key={avatar} className="flex flex-col items-center gap-1.5">
                                                <button
                                                    onClick={() => {
                                                        if (isAffordable) {
                                                            onSelect(avatar);
                                                        } else {
                                                            setRequiredCoins(cost);
                                                            setShowLowBalance(true);
                                                        }
                                                    }}
                                                    className={`relative aspect-square w-full rounded-[2rem] bg-white/10 border transition-all duration-200 active:scale-95 flex items-center justify-center ${isSelected
                                                        ? "ring-2 ring-brand-yellow-100 ring-offset-2 ring-offset-[#111] border-transparent scale-105"
                                                        : isAffordable
                                                            ? "ring-0 border-white/10 hover:border-white/20 hover:bg-white/15"
                                                            : "ring-0 border-white/5 bg-white/5 hover:border-white/10"
                                                        }`}
                                                >
                                                    <img
                                                        src={`/assets/users/${avatar}`}
                                                        alt={avatar}
                                                        className="w-full h-full object-cover transition-all duration-200"
                                                        loading="lazy"
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-brand-yellow-100/20 flex items-center justify-center rounded-[2rem] overflow-hidden">
                                                            <div className="w-6 h-6 bg-brand-yellow-100 rounded-full flex items-center justify-center shadow-lg">
                                                                <Check className="w-3 h-3 text-blue-main" strokeWidth={4} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {!isAffordable && (
                                                        <div className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-black/60 border border-brand-yellow-100/30 rounded-full flex items-center justify-center shadow-lg">
                                                            <Lock className="w-3 h-3 text-brand-yellow-100" />
                                                        </div>
                                                    )}
                                                </button>

                                                {/* Cost layout below image */}
                                                <div className="flex items-center gap-1 bg-[#5e5e5e47] px-2 py-0.5 rounded-full border border-white/5">
                                                    <span className={`text-xs font-bold ${isAffordable ? "text-white" : "text-brand-gold-100 font-extrabold"}`}>
                                                        {cost === 0 ? "Free" : cost}
                                                    </span>
                                                    {cost > 0 && (
                                                        <img
                                                            src="/assets/images/img/gold-coin.png"
                                                            alt="coin"
                                                            className="w-3 h-3 object-contain"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Save Button */}
                                <div className="mt-8">
                                    <Button
                                        className="h-12 w-full bg-brand-gradient hover:opacity-90 text-blue-main font-bold rounded-2xl shadow-lg border-2 border-white transition-all active:scale-95 text-base"
                                        onClick={handleSaveClick}
                                    >
                                        {t.saveProfile || "Save Profile"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmation Popup */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[120] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-[#282828c2] dark:bg-[#7272722b] border border-white/10 rounded-[2rem] p-6 shadow-2xl max-w-xs w-full text-center flex flex-col items-center gap-4 text-white"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-yellow-100/20 to-brand-gold-100/5 border-2 border-brand-yellow-100 flex items-center justify-center shadow-[0_0_20px_rgba(255,202,32,0.35)]"
                            >
                                <Check className="w-8 h-8 text-brand-yellow-100 stroke-[3]" />
                            </motion.div>
                            <h3 className="text-lg text-brand-yellow-100 font-bold ">Successfully Updated</h3>
                            <p className="text-sm text-white/70 leading-relaxed">
                                {(selectedAvatar === currentAvatar ? 0 : (avatarCosts[selectedAvatar] || 0))} coins will be deducted from your account.
                            </p>
                            <div className="flex gap-3 w-full mt-2">
                                <Button
                                    className="flex-1 rounded-xl bg-brand-gradient hover:opacity-90 text-blue-main font-bold rounded-2xl shadow-lg border-2 border-white transition-all active:scale-95 text-sm font-bold"
                                    onClick={() => {
                                        const cost = selectedAvatar === currentAvatar ? 0 : (avatarCosts[selectedAvatar] || 0);
                                        onSave(selectedAvatar, cost);
                                        setShowConfirm(false);
                                    }}
                                >
                                    OK
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Insufficient Coins Popup */}
            <AnimatePresence>
                {showLowBalance && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[8px] z-[120] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-[#282828c2] dark:bg-[#7272722b] border border-brand-yellow-100/20 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(255,202,32,0.1)] max-w-xs w-full text-center flex flex-col items-center gap-4 text-white overflow-hidden"
                        >
                            {/* Glowing Top Border Accent */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-yellow-100 via-brand-gold-100 to-brand-yellow-100" />

                            {/* Close Button */}
                            <button
                                onClick={() => setShowLowBalance(false)}
                                className="absolute z-[50] top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 border-2 border-brand-yellow-100 flex items-center justify-center transition-all"
                            >
                                <X className="h-5 w-5 text-white/60 hover:text-white" />
                            </button>

                            <motion.div
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                className="w-16 h-16 rounded-full bg-brand-gold-100/10 border-2 border-brand-gold-100/30 flex items-center justify-center shadow-[0_0_20px_rgba(223,162,8,0.2)]"
                            >
                                <Lock className="w-8 h-8 text-brand-gold-100 stroke-[2.5]" />
                            </motion.div>

                            <h3 className="text-lg text-brand-gold-100 font-extrabold uppercase tracking-wide">Insufficient Coins</h3>

                            <div className="text-sm text-white/80 leading-relaxed space-y-2 w-full">
                                <p className="px-1 text-[13px] text-white/70">
                                    You don't have enough coins to unlock this premium avatar.
                                </p>
                                {/* <div className="bg-black/30 rounded-2xl p-3.5 flex flex-col gap-1.5 border border-white/5 text-left">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Required:</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      {requiredCoins}
                      <img src="/assets/images/img/gold-coin.png" alt="coin" className="w-3.5 h-3.5 object-contain" />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Your Balance:</span>
                    <span className="font-bold text-brand-gold-100 flex items-center gap-1">
                      {userCoins}
                      <img src="/assets/images/img/gold-coin.png" alt="coin" className="w-3.5 h-3.5 object-contain" />
                    </span>
                  </div>
                  <div className="h-px bg-white/5 my-1" />
                  <div className="flex justify-between text-sm font-black text-brand-yellow-100">
                    <span>Needed:</span>
                    <span className="flex items-center gap-1 text-brand-gold-100">
                      {requiredCoins - userCoins}
                      <img src="/assets/images/img/gold-coin.png" alt="coin" className="w-3.5 h-3.5 object-contain" />
                    </span>
                  </div>
                </div> */}
                            </div>

                            <div className="flex flex-col gap-2.5 w-full mt-2">
                                <Button
                                    className="w-full rounded-2xl bg-brand-gradient hover:opacity-90 text-blue-main font-extrabold shadow-lg border-2 border-white transition-all active:scale-95 text-sm py-5"
                                    onClick={() => {
                                        setShowLowBalance(false);
                                        onClose();
                                        window.location.href = "/";
                                    }}
                                >
                                    Play Games & Earn
                                </Button>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PopupAvatarSelectorNew;