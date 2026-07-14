import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";

interface LeaderboardJoinPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin?: () => void;
}

export const LeaderboardJoinPopup: React.FC<LeaderboardJoinPopupProps> = ({
    isOpen,
    onClose,
    onJoin,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Blurred Dark Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 backdrop-blur-[2px]"
                    />

                    {/* Popup Content Box */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="bg-gradient-to-b from-[#1b1b1b75] to-[#0c0d14] border border-white/30 w-full max-w-sm rounded-[28px] p-6 shadow-2xl relative overflow-hidden text-white z-10 flex flex-col items-center text-center"
                    >
                        {/* Golden/Cyan glowing circle in background */}
                        <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#ffc200]/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Top Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center text-white/70 hover:text-white border-none cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="w-16 h-16 rounded-2xl  flex items-center justify-center shadow-lg shadow-amber-500/5 mb-4 mt-2">
                            <img src="/assets/images/img/trophy.png" className="w-16 h-16 object-contain" alt="Trophy" />
                        </div>

                        {/* Message Title & Subtitle */}
                        <h3 className="text-base font-extrabold uppercase tracking-wider text-[#ffc200] mb-2">
                            Leaderboard Locked
                        </h3>
                        <p className="text-sm text-slate-300 font-semibold leading-relaxed px-2">
                            To view the Leaderboard play the tournament
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-2.5 w-full mt-6">
                            {onJoin && (
                                <button
                                    onClick={() => {
                                        onJoin();
                                        onClose();
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-[#ffd43f] to-[#ffb800] hover:from-[#ffe066] hover:to-[#ffd014] text-[#0b2f5f] font-black uppercase text-xs rounded-xl shadow-lg active:scale-95 transition-transform border-none cursor-pointer"
                                >
                                    Play Tournament
                                </button>
                            )}
                            {/* <button
                                onClick={onClose}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-xs rounded-xl border border-white/10 active:scale-95 transition-all cursor-pointer"
                            >
                                Close
                            </button> */}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LeaderboardJoinPopup;
