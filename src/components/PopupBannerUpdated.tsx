"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useLanguage } from "./context/LanguageContext";

interface PopupBannerUpdatedProps {
  onClose?: () => void;
}

const PopupBannerUpdated: React.FC<PopupBannerUpdatedProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="welcome-popup-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90000] flex items-center justify-center bg-black/40 backdrop-blur-[7px] will-change-transform"
          style={{ marginTop: "0px" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#282828c2] dark:bg-[#0000002b] backdrop-blur-md rounded-[2.5rem] max-w-sm w-[85%] p-6 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 overflow-hidden will-change-transform"
          >
            {/* Glowing Corner Accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-500 rounded-tl-[2.5rem] pointer-events-none" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-tr-[2.5rem] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-500 rounded-bl-[2.5rem] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-500 rounded-br-[2.5rem] pointer-events-none" />

            {/* Luminous Ambient Glows */}
            <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-pink-500/10 blur-[60px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute z-[50] top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 border-2 border-yellow-main flex items-center justify-center transition-all"
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
              {/* Image Visual */}
              <div className="relative mb-6 flex justify-center">
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
                  <div className="absolute -inset-6 blur-xl rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="relative w-24 h-16">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center relative">
                        <img
                          src="/assets/images/gamenow.png"
                          className="w-full h-full object-cover relative z-10"
                          alt="Welcome Robot"
                          loading="lazy"
                        />

                        {/* Sparkles */}
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

              {/* Title */}
              <h2 className="text-lg font-bold leading-tight mb-3">
                <span className="text-white leading-relaxed">Welcome to</span> <br />
                <span className="text-[#ffc200] leading-relaxed">GAMENOW Premier League</span>
              </h2>

              {/* Description */}
              <p className="text-sm text-blue-100 leading-relaxed mb-8">
                Start Playing tournament and win amazing prizes
              </p>

              {/* Action Button */}
              <div className="w-full">
                <Button
                  className="h-12 w-full bg-gradient-to-r from-[#ffd43f] to-[#ffb800] hover:from-[#ffe066] hover:to-[#ffd014] text-[#0b2f5f] font-bold rounded-2xl shadow-lg border-2 border-white transition-all active:scale-95 text-base"
                  onClick={handleClose}
                >
                  Let's Play
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupBannerUpdated;
