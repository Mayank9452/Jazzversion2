"use client";

import { Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useLanguage } from "./context/LanguageContext";

const PopupNotSubscribed = ({ isShow, onClose }: { isShow: boolean; onClose: () => void }) => {
  const { t } = useLanguage();

  if (!isShow) return null;

  return (
    <motion.div
      key="popup-not-subscribed-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[2px] overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative gradient-popup-premium backdrop-blur-md rounded-[2.5rem] max-w-sm w-[85%] p-6 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 overflow-hidden"
      >
        {/* Glowing Corner Accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-500 rounded-tl-[2.5rem] pointer-events-none" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-tr-[2.5rem] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-500 rounded-bl-[2.5rem] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-500 rounded-br-[2.5rem] pointer-events-none" />

        {/* Ambient Glows */}
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-pink-500/10 blur-[60px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onClose}
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
          {/* Visual Icon */}
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
              <div className="absolute -inset-6 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-xl rounded-full opacity-80" />
              <div className="relative w-24 h-24">
                <img
                  src="/assets/robotavatar/2.png"
                  className="w-full h-full object-cover relative z-10"
                  alt="Not Subscribed"
                />
                <motion.div
                  animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-4 right-4"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-white to-pink-600 bg-clip-text text-transparent leading-tight mb-3 font-bold">
            {t.notSubscribedTitle || "Not Subscribed !"}
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            {t.notSubscribedDesc || "You are not subscribe with us, Please subscribe with Daily or Weekly plan."}
          </p>

          <div className="mt-8">
            <Button
              className="text-base h-12 w-full bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-900/20 border-t border-white/20 transition-all active:scale-95"
              onClick={onClose}
            >
              {t.subscribeNow || "Subscribe"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PopupNotSubscribed;
