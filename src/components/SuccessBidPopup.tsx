"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Sparkles, X } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

interface SuccessBidPopupProps {
  isShow: boolean;
  batchCount: number | string;
  onConfirm: () => void;
}

const SuccessBidPopup = ({
  isShow,
  batchCount,
  onConfirm,
}: SuccessBidPopupProps) => {
  const { t } = useLanguage();

  if (!isShow) return null;

  const handleClose = () => {
    onConfirm?.();
  };

  return (
    <motion.div
      key="success-bid-popup-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[2px] will-change-transform"
      style={{ marginTop: "0px" }}
    >
      {/* Fireworks layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/assets/images/firework.gif"
          className="absolute top-0 right-5 max-w-[480px]"
          loading="lazy"
          alt=""
        />
        <img
          src="/assets/images/firework.gif"
          className="absolute top-12 left-5 max-w-[480px]"
          loading="lazy"
          alt=""
        />
        <img
          src="/assets/images/firework.gif"
          className="absolute bottom-10 left-5 max-w-[480px]"
          loading="lazy"
          alt=""
        />
        <img
          src="/assets/images/firework.gif"
          className="absolute bottom-0 right-5 max-w-[480px]"
          loading="lazy"
          alt=""
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative gradient-popup-premium backdrop-blur-md rounded-[2.5rem] max-w-sm w-[85%] p-6 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 overflow-hidden will-change-transform"
      >
        {/* Glowing Corner Accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-500 rounded-tl-[2.5rem] pointer-events-none" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-tr-[2.5rem] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-500 rounded-bl-[2.5rem] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-500 rounded-br-[2.5rem] pointer-events-none" />

        {/* Celebration Balloons Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 400, opacity: 0, rotate: -10 }}
              animate={{
                y: -500,
                opacity: [0, 1, 1, 0],
                rotate: [10, -10, 10],
                x: [0, (i % 2 === 0 ? 30 : -30), 0]
              }}
              transition={{
                duration: 8 + Math.random() * 5,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "linear"
              }}
              className="absolute bottom-[-100px]"
              style={{ left: `${5 + i * 18}%` }}
            >
              <div className="relative">
                <div
                  className={`w-10 h-14 rounded-full shadow-xl ${i % 3 === 0 ? "bg-gradient-to-t from-pink-600 to-pink-400" :
                    i % 3 === 1 ? "bg-gradient-to-t from-yellow-500 to-yellow-300" :
                      "bg-gradient-to-t from-blue-500 to-blue-300"
                    } opacity-30 backdrop-blur-[1px]`}
                />
                <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full blur-[1px]" />
                <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent mx-auto" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Luminous Ambient Glows */}
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-pink-500/10 blur-[60px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute z-[50] top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 border-2 border-pink-900 flex items-center justify-center transition-all"
        >
          <X className="h-5 w-5 text-white/60 hover:text-white" />
        </button>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="w-full text-center relative z-10"
        >
          {/* Celebration Image Visual */}
          <div className="relative mb-4 flex justify-center">
            <motion.div
              animate={{
                y: [-4, 4, -4],
                rotate: [-1, 1, -1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative group"
            >
              <div className="absolute -inset-6 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-xl rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="relative w-24 h-24">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center relative">
                    <img
                      src="/assets/robotavatar/4.png"
                      className="w-full h-full object-cover relative z-10"
                      alt="Success Robot"
                      loading="lazy"
                    />

                    {/* Floating Sparkle Particles */}
                    <motion.div
                      animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute top-4 right-4 z-20"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
                      className="absolute bottom-4 left-4 z-20"
                    >
                      <Sparkles className="w-3 h-3 text-pink-400" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-white to-pink-600 bg-clip-text text-transparent leading-tight mb-3">
            {t.successfullyBidPlaced}
          </h2>

          <p className="text-sm leading-relaxed text-blue-100 mb-8">
            {Number(batchCount) === 5 ? (
              <>
                {t.successSet5Message}
              </>
            ) : (
              <>
                {t.successRemainingMessagePart1}
                <span className="text-yellow-400 font-bold">{batchCount}</span>
                {/* {t.successRemainingMessagePart2} */}

                {t.successRemainingMessagePart3}
                <span className="text-yellow-400 font-bold">
                  {5 - Number(batchCount)}
                </span>
              </>
            )}
          </p>

          <div className="w-full">
            <Button
              className="h-12 w-full bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-900/20 border-t border-white/20 transition-all active:scale-95 text-base"
              onClick={onConfirm}
            >
              {t.playMore}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessBidPopup;
