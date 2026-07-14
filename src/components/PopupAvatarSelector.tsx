"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./context/LanguageContext";

interface PopupAvatarSelectorProps {
  isShow: boolean;
  onClose: () => void;
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
  onSave: () => void;
}

const PopupAvatarSelector: React.FC<PopupAvatarSelectorProps> = ({
  isShow,
  onClose,
  selectedAvatar,
  onSelect,
  onSave,
}) => {
  const { t } = useLanguage();
  const avatars: string[] = Array.from(
    { length: 15 },
    (_, i) => `${i + 1}.png`
  );

  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 will-change-transform"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative gradient-popup-premium border border-white/20 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 overflow-hidden will-change-transform"
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



            {/* Luminous Ambient Glows (Aurora Effect) - Reduced blur for mobile performance */}
            <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-pink-500/10 blur-[60px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute z-[50] top-2 right-3 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 border-2 border-pink-900 flex items-center justify-center transition-all"
            >
              <X className="h-5 w-5 text-white/60 hover:text-white" />
            </button>

            <div className="relative z-10 w-full pt-4">
              {/* Header */}
              <div className="text-center mb-6 px-10">
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-white to-pink-600 bg-clip-text text-transparent mb-1 leading-tight">
                  {t.chooseYourAvatar}
                </h2>
              </div>

              {/* Avatar Grid - 3 Columns */}
              <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar bg-white/5 backdrop-blur-sm p-3 rounded-2xl">
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => onSelect(avatar)}
                    className={`relative aspect-square rounded-[2rem] bg-white/10 border transition-all duration-200 active:scale-95 flex items-center justify-center p-2 ${selectedAvatar === avatar
                      ? "ring-2 ring-yellow-500 ring-offset-2 ring-offset-[#111] border-transparent scale-105"
                      : "ring-0 border-white/10 opacity-90 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={`/assets/users/${avatar}`}
                      alt={avatar}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    {selectedAvatar === avatar && (
                      <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center rounded-[2rem] overflow-hidden">
                        <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-white" strokeWidth={4} />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Save Button */}
              <div className="mt-8">
                <Button
                  className="h-12 w-full bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-900/20 border-t border-white/20 transition-all active:scale-95"
                  onClick={onSave}
                >
                  {t.saveProfile}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupAvatarSelector;