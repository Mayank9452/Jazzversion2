import React from "react";
import { motion } from "framer-motion";
import { LoaderPinwheel } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RedeemSpinPopupProps {
    isOpen: boolean;
    onClose: () => void;
    userCoins: number | string;
    onRedeem: () => void;
}

export default function RedeemSpinPopup({
    isOpen,
    onClose,
    userCoins,
    onRedeem,
}: RedeemSpinPopupProps) {
    if (!isOpen) return null;

    const navigate = useNavigate();

    const handleClose = () => {

        navigate("/");
        onClose();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
            {/* Backdrop Click */}
            <div
                className="absolute inset-0 z-0"
                onClick={onClose}
            />

            {/* Modal Box */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative w-full max-w-xs bg-gradient-to-b from-[#2a2a2a] to-[#15151542] rounded-[2rem] p-6 text-center border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 flex flex-col items-center gap-4"
            >
                {/* Glowing Corner Accents */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-500 rounded-tl-[2.5rem] pointer-events-none" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-tr-[2.5rem] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-500 rounded-bl-[2.5rem] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-500 rounded-br-[2.5rem] pointer-events-none" />

                {/* Yellow Glow Effect */}
                <div className="absolute -top-12 left-[50%] -translate-x-[50%] w-24 h-24 bg-[#FFCA20]/20 rounded-full blur-2xl pointer-events-none" />

                {/* Icon container */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFCA20]/20 to-[#E6B53A]/5 border border-[#FFCA20]/20 flex items-center justify-center shadow-lg">
                    <LoaderPinwheel className="w-8 h-8 text-[#FFCA20] animate-spin" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-white text-base font-black uppercase tracking-wider">
                        Spin & Win Limit
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed px-1">
                        Sorry, You already used Spin & Win today. Do you want to spin again?
                    </p>
                </div>

                {/* Divider line */}
                <div className="w-full h-px bg-white/5" />
                {/* <h5 className="text-white text-xs font-black uppercase tracking-wider">
                    Do you want to spin again?
                </h5> */}


                {/* Actions */}
                <div className="w-full flex flex-col gap-2.5 mt-2">
                    <button
                        onClick={onRedeem}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-[#FFCA20] to-[#E6B53A] text-slate-950 font-black uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(255,202,32,0.3)] hover:shadow-[0_0_20px_rgba(255,202,32,0.5)] active:scale-95 transition-all border-2 border-white"
                    >
                        Get 1 Spin (50 coins)
                    </button>

                </div>

                {/* Coins Balance Display */}
                <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.05] rounded-full px-3.5 py-1 text-[11px] text-slate-300 font-bold">
                    <span>Account Balance:</span>
                    <span className="text-[#FFCA20] font-black">{userCoins} Coins</span>
                </div>
                <button
                    onClick={handleClose}
                    className="w-full py-2.5 rounded-full bg-transparent hover:bg-white/5 text-slate-400 font-bold text-xs active:scale-95 transition-all"
                >
                    Maybe Later
                </button>
            </motion.div>
        </motion.div>
    );
}
