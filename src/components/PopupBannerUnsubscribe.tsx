"use client";

import { useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";
import { useAppSelector } from "@/app/hooks";

const PopupBannerUnsubscribe = ({
  data,
  isShow,
  onClose,
  onConfirm,
  confirmText,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const dashboard = useAppSelector((state) => state?.dashboard);
  const is_freemium = dashboard?.data?.data?.user_is_freemium;

  useEffect(() => {
    if (!isShow) return;
    if (!data?.autoCloseTimer || data.autoCloseTimer <= 0) return;

    const timer = setTimeout(() => {
      onClose?.(); // notify parent on auto-close
    }, data.autoCloseTimer * 1000);

    return () => clearTimeout(timer);
  }, [isShow, data?.autoCloseTimer, onClose]);

  const handleClose = () => {
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          key="popup-banner-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[2px] will-change-transform"
          style={{ marginTop: "0px" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative dark:bg-[#00000094] backdrop-blur-md rounded-[2.5rem] max-w-sm w-[85%] p-6 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 overflow-hidden will-change-transform"
          >
            {/* Glowing Corner Accents */}
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-500 rounded-tl-[2.5rem] pointer-events-none" />

            {/* Top Right */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-tr-[2.5rem] pointer-events-none" />

            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-500 rounded-bl-[2.5rem] pointer-events-none" />

            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-500 rounded-br-[2.5rem] pointer-events-none" />


            {/* Luminous Ambient Glows (Aurora Effect) - Optimized blur */}
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
                  {/* Outer Atmosphere Glow - Reduced blur */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-xl rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="relative w-24 h-24">
                    {/* The Container */}
                    <div className="absolute inset-0 rounded-[2rem]">
                      <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
                        {/* Golden internal light */}
                        <div className="absolute inset-0 " />

                        <img
                          src="/assets/robotavatar/3.png"
                          className="w-full h-full object-cover relative z-10 "
                          alt="Success Robot"
                          loading="lazy"
                        />

                        {/* Floating Sparkle Particles */}
                        <motion.div
                          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="absolute top-4 right-4"
                        >
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                        </motion.div>
                        <motion.div
                          animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
                          className="absolute bottom-4 left-4"
                        >
                          <Sparkles className="w-3 h-3 text-pink-400" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {data?.title && (
                <h2 className="text-xl font-bold text-[#ffc200] leading-tight mb-3">
                  {data.title}
                </h2>
              )}
              {data?.description && (
                <p className="text-sm text-blue-100 leading-relaxed">
                  {data.description}
                </p>
              )}

              <div className="mt-8 space-y-3">
                <Button
                  className="text-base h-12 w-full bg-gradient-to-r from-[#ffd43f] to-[#ffb800] hover:from-[#ffe066] hover:to-[#ffd014] text-[#0b2f5f] font-bold rounded-2xl shadow-lg shadow-pink-900/20 border-t border-white/20 transition-all active:scale-95 "
                  onClick={() => {
                    onConfirm?.();
                    onClose?.();
                  }}
                >
                  {confirmText || t.subscribeNow}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupBannerUnsubscribe;
