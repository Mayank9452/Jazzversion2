"use client"
import { motion, AnimatePresence } from "framer-motion"
import React, { useEffect, useState } from 'react'
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import Ticket from "./ui/Ticket"
import TicketCombo from "./ui/TicketCombo"
import RupeeCombo from "./ui/RupeeCombo"

function SuccessPopUpPageUpdated({ result = {
    id: 1,
    name: "10 Coins",
    value: 10,
    color: `bg-[#FFD700]`,
    text: "text-black",
    image: "/assets/images/image.png",
} }) {
    return (
        <motion.div
            initial={{ opacity: 1, height: "0vh" }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: "0vh" }}
            transition={{ duration: 0.5 }}
            className="fixed mx-auto w-full max-w-[480px] flex items-center justify-center z-[1100] bottom-0 start-[50%] -translate-x-[50%] overflow-hidden"
            style={{ marginTop: "0px", background: "linear-gradient(360deg, rgba(223, 162, 8, 0.45) 0%, rgba(25, 25, 25, 1) 25%, rgba(25, 25, 25, 1) 100%)" }}
        >
            <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, translateX: "0%", translateY: "0%" }}
                exit={{ scale: 0, translateX: "50%", translateY: "-120%", opacity: 1 }}
                transition={{ type: "spring", damping: 5, delay: 0.65 }}
                className="w-full px-4"
            >
                <Card
                    className="p-8 text-center w-full aspect-square border-0 bg-transparent relative"
                >
                    <video
                        src="/assets/video/spark.webm"
                        className="absolute top-0 start-0 h-full w-full object-cover"
                        autoPlay
                        playsInline
                        muted
                        loop={false}
                    />
                    <div className="w-full h-100 flex flex-col justify-center items-center absolute gap-9 top-[50%] start-[50%] -translate-x-[50%] -translate-y-[50%]">
                        <span className="text-xs tracking-widest text-[#ffca20] font-black">YOU WON</span>
                        <TicketCombo size={14} tickets={result?.name ?? "1 GB data"} />
                    </div>
                    {/* <img src="/assets/images/spark.gif" className="absolute top-0 start-0 h-full w-full" alt="" loading="lazy" /> */}
                </Card>
            </motion.div>
        </motion.div>
    )
}

export default SuccessPopUpPageUpdated