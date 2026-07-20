"use client"
import { motion } from "framer-motion"
import React, { useEffect, useRef } from 'react'
import { Card } from "./ui/card"
import { useAppSelector } from "@/app/hooks";
import { X } from "lucide-react";

function LosePopUpPage({ resetResults, onClose }: any) {
    const { language } = useAppSelector((state) => state?.config);
    const closeOnceRef = useRef(false);

    // ✅ AUTO CLOSE
    useEffect(() => {
        const timer = setTimeout(() => {
            if (closeOnceRef.current) return;
            closeOnceRef.current = true;
            onClose?.();
        }, 5000); // ⏱ auto close after 5s

        return () => clearTimeout(timer);
    }, [onClose]);

    // ✅ MANUAL CLOSE
    const handleManualClose = () => {
        if (closeOnceRef.current) return;
        closeOnceRef.current = true;
        onClose?.();
    };


    return (
        <motion.div
            initial={{ opacity: 0.9, height: "0vh" }}
            animate={{ opacity: 0.9, height: "100vh" }}
            exit={{ opacity: 0, height: "0vh" }}
            transition={{ duration: 0.5 }}
            className="fixed mx-auto w-full max-w-[480px] flex items-center justify-center z-[1100] bottom-0 start-[50%] -translate-x-[50%] overflow-hidden"
            style={{
                background: "linear-gradient(360deg, rgba(223, 162, 8, 0.3) 0%, rgba(25, 25, 25, 1) 25%, rgba(25, 25, 25, 1) 100%)",
                opacity: "50%"
            }}
        >
            {/* <button
                onClick={() => {
                    onClose();
                }}
                className="absolute top-2 right-4 z-20 rounded-full bg-black/40 hover:bg-black/60 p-2 transition"
            >
                <X className="w-5 h-5 text-white" />
            </button> */}

            <button
                onClick={handleManualClose}
                className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white"
            >
                <X size={20} />
            </button>
            <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 5, delay: 0.65 }}
                className="w-full px-4"
            >
                <Card className="p-8 text-center w-full aspect-square border-0 bg-transparent relative">

                    {/* Content Overlay */}
                    <div className="w-full flex flex-col justify-center items-center absolute gap-6 top-[50%] start-[50%] -translate-x-[50%] -translate-y-[50%]">
                        <span className="text-sm tracking-widest text-gray-300 absolute w-28 top-[5.5rem] h-4 bg-[radial-gradient(white,rgba(255,255,255,0.8),rgba(255,255,255,0.5),transparent,transparent,transparent)]" />
                        <img src={'/assets/images/cat-cry.gif'} className="w-24 h-24" loading="lazy" alt="" />
                        <span className="text-sm tracking-widest text-[#ffca20] font-black">OOPS!</span>
                        <span className="text-2xl font-bold text-[#ffca20] drop-shadow-md">
                            {language == "my" ? "နောက်တစ်ကြိမ် ကံကောင်းပါစေ။" : "Better Luck Next Time"}
                        </span>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
}

export default LosePopUpPage