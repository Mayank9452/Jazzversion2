"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

const PopupBannerStaticUpdated = ({ data, isShow }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const { language } = useAppSelector((state) => state?.config);

  useEffect(() => {
    setIsVisible(true);
  }, [isShow]);

  useEffect(() => {
    if (!isShow) return;
    if (!data?.autoCloseTimer || data.autoCloseTimer <= 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, data.autoCloseTimer * 1000); // seconds → ms

    return () => clearTimeout(timer);
  }, [isShow, data?.autoCloseTimer]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="popup-banner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          style={{ marginTop: "0px" }}
        >
          <img
            src="/assets/images/jackpot.gif"
            className="h-[100vh] fixed object-cover top-0 max-w-[480px] mx-auto"
            loading="lazy"
            alt=""
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative gradient-casino-dark rounded-2xl max-w-sm w-[90%] p-3 shadow-[0_0_20px_4px_rgba(0,0,0,1)]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute z-10 top-0 right-0 rounded-es-sm rounded-se-sm glass-card-extralight border-none p-2 shadow shadow-white/30"
            >
              <X className="h-5 w-5 text-gray-300 dark:text-gray-300" />
            </button>

            {/* Image */}
            {data?.image && (
              <div className="w-full overflow-hidden rounded-xl">
                <div
                  className="w-full relative"
                  style={{
                    aspectRatio: data.imageAspect || "16/9",
                  }}
                >
                  <img
                    src={data.image}
                    alt={data.title || "Popup Banner"}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-4 text-center"
            >
              {data?.title && (
                <h2
                  className="text-xl sm:text-2xl font-semibold 
                    bg-gradient-to-r from-yellow-700 via-yellow-200 to-yellow-700
                    bg-clip-text text-transparent"
                >
                  {data.title}
                </h2>
              )}
              {data?.description && (
                <p className="text-sm mt-1 text-white">{data.description}</p>
              )}
              {data?.handle && (
                <Button
                  className="h-10 px-8 w-full bg-gradient-to-br from-yellow-700 via-yellow-200 to-yellow-700 text-orange-950 text-lg font-bold shadow-[0_0_8px_1.5px_rgba(0,24,43,1)] mt-4"
                  // disabled={spin?.pendingSpins !== 0 && spin?.pendingSpinPlays === 0}
                  // onClick={() => {
                  //   navigate(`/prospinner/${data?.handle}`);
                  // }}
                  onClick={() => setIsVisible(false)}
                >
                  <span className="animate-scale-pulse">
                    {language == "my" ? "အိုကေ" : "OK"}
                  </span>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupBannerStaticUpdated;
