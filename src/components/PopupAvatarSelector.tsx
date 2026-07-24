"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./context/LanguageContext";

interface PopupAvatarSelectorProps {
  isShow: boolean;
  onClose: () => void;
  selectedAvatar: string;
  currentAvatar: string;
  onSelect: (avatar: string) => void;
  onSave: (avatar: string, cost: number) => void;
  userCoins: number;
}

const avatarCosts: Record<string, number> = {
  "1.png": 0,
  "2.png": 50,
  "3.png": 100,
  "4.png": 50,
  "5.png": 150,
  "6.png": 100,
  "7.png": 50,
  "8.png": 200,
  "9.png": 100,
  "10.png": 150,
  "11.png": 50,
  "12.png": 200,
  "13.png": 100,
  "14.png": 50,
  "15.png": 150
};

const PopupAvatarSelector: React.FC<PopupAvatarSelectorProps> = ({
  isShow,
  onClose,
  selectedAvatar,
  currentAvatar,
  onSelect,
  onSave,
  userCoins,
}) => {
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);
  const avatars: string[] = Array.from(
    { length: 15 },
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
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 will-change-transform"
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
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-500 rounded-tl-[2.5rem] pointer-events-none" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-500 rounded-tr-[2.5rem] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-500 rounded-bl-[2.5rem] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-500 rounded-br-[2.5rem] pointer-events-none" />

              {/* Luminous Ambient Glows */}
              {/* <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#ffc200]/10 blur-[60px] rounded-full pointer-events-none animate-pulse" />
              <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-500/20 blur-[80px] rounded-full pointer-events-none animate-pulse" /> */}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute z-[50] top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 border-2 border-yellow-main flex items-center justify-center transition-all"
              >
                <X className="h-5 w-5 text-white/60 hover:text-white" />
              </button>

              <div className="relative z-10 w-full pt-4">
                {/* Header */}
                <div className="text-center mb-6 px-10">
                  <h2 className="text-xl font-bold text-[#ffc200] mb-1 leading-tight">
                    {t.chooseYourAvatar || "Choose Your Avatar"}
                  </h2>
                </div>

                {/* Avatar Grid - 3 Columns */}
                <div className="grid grid-cols-3 gap-x-3 gap-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar bg-white/5 backdrop-blur-sm p-3 rounded-2xl">
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
                            }
                          }}
                          disabled={!isAffordable}
                          className={`relative aspect-square w-full rounded-[2rem] bg-white/10 border transition-all duration-200 active:scale-95 flex items-center justify-center p-2 ${isSelected
                            ? "ring-2 ring-yellow-500 ring-offset-2 ring-offset-[#111] border-transparent scale-105"
                            : isAffordable
                              ? "ring-0 border-white/10 opacity-90 hover:opacity-100"
                              : "ring-0 border-white/5 opacity-40 cursor-not-allowed"
                            }`}
                        >
                          <img
                            src={`/assets/users/${avatar}`}
                            alt={avatar}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#ffc200]/20 flex items-center justify-center rounded-[2rem] overflow-hidden">
                              <div className="w-6 h-6 bg-[#ffc200] rounded-full flex items-center justify-center shadow-lg">
                                <Check className="w-3 h-3 text-[#0b2f5f]" strokeWidth={4} />
                              </div>
                            </div>
                          )}
                        </button>

                        {/* Cost layout below image */}
                        <div className="flex items-center gap-1 bg-[#5e5e5e47] px-2 py-0.5 rounded-full border border-white/5">
                          <span className={`text-xs font-bold ${isAffordable ? "text-white" : "text-red-400"}`}>
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
                    className="h-12 w-full bg-gradient-to-r from-[#ffd43f] to-[#ffb800] hover:from-[#ffe066] hover:to-[#ffd014] text-[#0b2f5f] font-bold rounded-2xl shadow-lg border-2 border-white transition-all active:scale-95 text-base"
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
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFCA20]/20 to-[#E6B53A]/5 border-2 border-[#FFCA20] flex items-center justify-center shadow-[0_0_20px_rgba(255,202,32,0.35)]"
              >
                <Check className="w-8 h-8 text-[#FFCA20] stroke-[3]" />
              </motion.div>
              <h3 className="text-lg text-[#ffc200] font-bold ">Successfully Updated</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {(selectedAvatar === currentAvatar ? 0 : (avatarCosts[selectedAvatar] || 0))} coins will be deducted from your account.
              </p>
              <div className="flex gap-3 w-full mt-2">
                {/* <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-white/10 text-black dark:text-white hover:bg-white/5 h-10 text-sm font-bold"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button> */}
                <Button
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#ffd43f] to-[#ffb800] hover:from-[#ffe066] hover:to-[#ffd014] text-[#0b2f5f] font-bold rounded-2xl shadow-lg border-2 border-white transition-all active:scale-95 text-sm font-bold"
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
    </>
  );
};

export default PopupAvatarSelector;