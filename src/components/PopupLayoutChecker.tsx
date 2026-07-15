import React from "react";
import { X, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface PopupLayoutCheckerProps {
  isShow: boolean;
  onClose: () => void;
  targetRoute: string;
}

const PopupLayoutChecker: React.FC<PopupLayoutCheckerProps> = ({
  isShow,
  onClose,
  targetRoute,
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    onClose();
    navigate(targetRoute);
  };

  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          key="layout-checker-popup-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90000] flex items-center justify-center bg-black/60 backdrop-blur-sm will-change-transform"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#1A1A1E] dark:bg-transparent text-white rounded-[2rem] max-w-sm w-[85%] p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center gap-4 overflow-hidden"
          >
            {/* Glowing Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-yellow-100/40 rounded-tl-[2rem] pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-yellow-100/40 rounded-tr-[2rem] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-yellow-100/40 rounded-bl-[2rem] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-yellow-100/40 rounded-br-[2rem] pointer-events-none" />

            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-yellow-100/5 blur-2xl rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute z-[50] top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 flex items-center justify-center transition-all"
            >
              <X className="h-4 w-4 text-white/60 hover:text-white" />
            </button>

            {/* Visual Icon */}
            <div className="relative mb-2 mt-4 flex justify-center">
              <div className="absolute -inset-4 bg-brand-yellow-100/10 blur-lg rounded-full" />
              <div className="relative w-16 h-16 rounded-2xl bg-brand-yellow-100/10 flex items-center justify-center border border-brand-yellow-100/20">
                <Layout className="w-8 h-8 text-brand-yellow-100" />
              </div>
            </div>

            {/* Content text */}
            <div className="w-full text-center relative z-10 space-y-2">
              <h3 className="text-lg font-black tracking-wide text-white">
                Please check the other layout
              </h3>
              <p className="text-xs text-white/60 leading-relaxed max-w-[85%] mx-auto">
                We have alternative design layouts available for this screen.
              </p>
            </div>

            {/* Action button */}
            <div className="w-full mt-4">
              <Button
                className="h-11 w-full bg-brand-gradient hover:brightness-110 text-brand-black-100 font-extrabold rounded-xl shadow-lg transition-all active:scale-95 text-sm"
                onClick={handleAction}
              >
                Check
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupLayoutChecker;
