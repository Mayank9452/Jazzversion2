"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Ticket from "./ui/Ticket";
import TicketCombo from "./ui/TicketCombo";
import RupeeCombo from "./ui/RupeeCombo";
import { ArrowLeft, ArrowRight, Copy, Tag, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Swal from "sweetalert2";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { claimReward } from "@/features/spinnerRewards/spinnerRewardsSlice";
import GiftCombo from "./ui/GiftCombo";

function ProductPopUpPageDummy({
    result = {
        id: 1,
        name: "10 Coins",
        description: "",
        value: 10,
        bgColor: `bg-[#FFD700]`,
        text: "text-black",
        image: "",
        burmeseName: "",
        burmeseDescription: "",
    },
    resetResults,
    spinId,
}) {
    const { language } = useAppSelector((state) => state?.config);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const auth = useAppSelector((state) => state?.auth);
    const dashboard = useAppSelector((state) => state?.dashboard);
    const is_freemium = dashboard?.data?.data?.user_is_freemium;
    // console.log("result", result);
    // console.log("resetResults", resetResults);
    // console.log("spinId", spinId);

    const [rewardsList, setRewardsList] = useState<any[]>([]);
    const [isClaiming, setIsClaiming] = useState(false);

    //   const handleClaim = async (rewardId: number) => {
    //     try {
    //       const res: any = await dispatch(claimReward(rewardId) as any);

    //       // if (res?.payload?.success) {
    //       //   // Reward successfully claimed
    //       //   Swal.fire({
    //       //     icon: "success",
    //       //     title: "Successfully Claimed!",
    //       //     text: "Your reward has been added to your account.",
    //       //     confirmButtonText: "OK",
    //       //   });

    //       //   setRewardsList((prev) =>
    //       //     prev.map((item) =>
    //       //       item.id === rewardId
    //       //         ? { ...item, claimed: true, claimedAt: new Date() }
    //       //         : item
    //       //     )
    //       //   );
    //       // } else {
    //       //   // API returned false due to subscription or other checks
    //       //   const message = (() => {
    //       //     if (res?.payload?.message.includes("subscribed")) {
    //       //       return language === "my"
    //       //         ? "စာရင်းသွင်းရန် အောက်ပါခလုတ်ကိုနှိပ်ပါ"
    //       //         : "Click the button below to subscribe.";
    //       //     }

    //       //     return res?.payload?.message || "Failed to claim reward.";
    //       //   })();

    //       //   Swal.fire({
    //       //     icon: "info",
    //       //     title: language === "my" ? "စာရင်းသွင်းရန် လိုအပ်ပါသည်" : "Subscription Required",
    //       //     text: message,
    //       //     confirmButtonText: language === "my" ? "စာရင်းသွင်း" : "Subscribe",
    //       //     // showCancelButton: true,
    //       //     // cancelButtonText: language === "my" ? "ပိတ်မည်" : "Cancel",
    //       //   }).then((result) => {
    //       //     if (result.isConfirmed) {
    //       //       window.location.href = "https://billing.atomspinzone.com/sandbox";
    //       //     }
    //       //   });
    //       // }

    //       if (res?.payload?.success) {
    //         Swal.fire({
    //           icon: "success",
    //           title: language == "my" ? "အောင်မြင်ခဲ့သည်!" : "Successfully Claimed!",
    //           text: language == "my"
    //             ? "ဆုလာဘ်ကို သင့်အကောင့်ထဲသို့ ထည့်သွင်းပြီးပါပြီ။"
    //             : "Your reward has been added to your account.",
    //           confirmButtonText: "OK",
    //         });

    //         setRewardsList((prev) =>
    //           prev.map((item) =>
    //             item.id === rewardId
    //               ? { ...item, claimed: true, claimedAt: new Date() }
    //               : item
    //           )
    //         );
    //         navigate("/rewards");
    //       } else {

    //         // 🔥 Handle Atom API Failure
    //         if (res?.payload?.message === "Atom API reward processing failed.") {
    //           toast({
    //             title: language == "my" ? "ဆုလက်ခံပေးမှု မအောင်မြင်ပါ" : "Reward processing failed",
    //             description: language == "my"
    //               ? "ကျေးဇူးပြု၍ နောက်တစ်ကြိမ် ပြန်လည်ကြိုးစားပါ။"
    //               : "Please try again later.",
    //             variant: "destructive",
    //             duration: 1000,
    //           });
    //           navigate("/rewards");
    //           return;
    //         }

    //         // 🔥 Handle subscription issues
    //         if (res?.payload?.message?.includes("subscribed")) {
    //           Swal.fire({
    //             icon: "info",
    //             title: language == "my" ? "စာရင်းသွင်းရန် လိုအပ်ပါသည်" : "Subscription Required",
    //             text: language == "my"
    //               ? "စာရင်းသွင်းရန် အောက်ပါခလုတ်ကိုနှိပ်ပါ"
    //               : "Click the button below to subscribe.",
    //             confirmButtonText: language == "my" ? "စာရင်းသွင်း" : "Subscribe",
    //             width: "280px",
    //             // padding: "0.75rem",
    //             customClass: {
    //               popup: "small-popup",
    //               title: "small-title",
    //             },
    //           }).then((result) => {
    //             if (result.isConfirmed) {
    //               // window.location.href = "https://billing.atomspinzone.com/";
    //               window.location.href = is_freemium === 1 || is_freemium === 2 ? "https://billing.atomspinzone.com/?AdNetwork=freemium&ClickID=&Publisher=" : "https://billing.atomspinzone.com/";
    //             }
    //           });
    //           navigate("/rewards");
    //           return;
    //         }
    //       }
    //     } catch (error) {
    //       Swal.fire({
    //         icon: "error",
    //         title: "Something went wrong",
    //         text: "Please try again later.",
    //         confirmButtonText: "OK",
    //       });
    //       navigate("/rewards");
    //     }
    //   };

    const handleClaim = async (rewardId: number) => {
        if (isClaiming) return;
        setIsClaiming(true);
        try {
            const res: any = await dispatch(claimReward(rewardId) as any);

            if (res?.payload?.success) {
                navigate("/rewards", { state: { claimSuccess: true } });
                return;
            }

            if (
                res?.payload?.message === "Atom API reward processing failed." ||
                res?.payload?.message === "Reward already claimed." ||
                res?.payload?.message === "Internal Server Error."
            ) {
                navigate("/rewards", { state: { claimError: true } });
                return;
            }

            if (res?.payload?.message?.includes("subscribed")) {
                navigate("/rewards", { state: { subscriptionRequired: true } });
                return;
            }
        } catch (error) {
            navigate("/rewards", { state: { claimError: true } });
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0.9, bottom: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed w-full max-w-[480px] h-[100vh] flex items-center justify-center z-[1100] bottom-0 start-[50%] -translate-x-[50%] overflow-hidden"
            // style={{marginTop: "0px", background: "linear-gradient(360deg, rgba(199, 87, 188, 1) 0%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 100%)"}}
            style={{
                marginTop: "0px",
                background:
                    "linear-gradient(180deg, rgba(0, 36, 166, 1) 0%, rgba(0, 36, 166, 1) 60%, rgba(2, 125, 174, 1) 100%)",
            }}
        >
            {true && (
                <img
                    src="/assets/images/jackpot.gif"
                    className="absolute inset-0 w-full h-full object-cover z-[1050] pointer-events-none"
                    alt="celebration"
                />
            )}
            <motion.div
                initial={{
                    scale: 0,
                    opacity: 1,
                    y: 200, // Start from bottom
                    originX: 0.5,
                    originY: 1,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0, // Move to center
                    originX: 0.5,
                    originY: 0.5,
                }}
                exit={{
                    scale: 0,
                    y: "0%", // Exit to top
                    opacity: 0,
                    originX: 1,
                    originY: 0,
                }}
                transition={{
                    delay: 0.35,
                    duration: 0.5,
                }}
                className="w-full px-4 h-full flex items-center relative"
            >
                <button
                    className="absolute top-[10%] end-[10%] z-[99999]"
                    onClick={() => {
                        resetResults({ status: "idle", isResultNull: true, time: 0 });
                    }}
                >
                    <X />
                </button>
                <Card className="p-8 sm:px-10 text-center w-full border-0 bg-transparent flex flex-col gap-9 items-center justify-center relative">
                    <div className="flex flex-col gap-6 items-center justify-center w-full relative">
                        {/* <RupeeCombo size={12} tickets={(language == "my" && result?.burmeseName !== "") ? result?.burmeseName : result?.name ?? "1 GB"} /> */}
                        <GiftCombo
                            size={120}
                            tickets={
                                language == "my" && result?.burmeseName !== ""
                                    ? result?.burmeseName
                                    : (result?.name ?? "1 GB")
                            }
                        />
                    </div>
                    <div className="w-full relative">
                        <div className="border-[8px] border-gray-300  rounded-lg bg-gray-300">
                            <img
                                src={
                                    ([4, 5, 6, 7].includes(result?.id) || (result?.image && !result.image.includes("crown")))
                                        ? result?.image
                                        : "/assets/images/dashboard_banner.jpg"
                                }
                                className="w-full aspect-square rounded-sm object-cover"
                                alt=""
                                loading="lazy"
                            />
                        </div>
                        <div className="border-t-4 border-dashed border-gray-400 rounded-t-lg bg-white w-full min-h-20 flex flex-col align-center justify-center p-4 text-start gap-3">
                            <div className="flex flex-col align-center justify-center text-start gap-1">
                                {/* <div className="text-black font-bold text-xl flex gap-2 items-center">
                  {(language == "my" && result?.burmeseName !== "") ? result?.burmeseName : result?.name ?? "perfume gift set for $298"}
                </div> */}
                                <span className="text-black text-md flex gap-2 items-center">
                                    <span>
                                        {language == "my" && result?.burmeseDescription !== ""
                                            ? result?.burmeseDescription
                                            : `You won ${result?.description}!`}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div
                            className={`border-dashed border-b-[6px] gradient-green-light w-full min-h-12 flex flex-col align-center justify-center p-4 text-start gap-3 ${isClaiming ? "opacity-50 pointer-events-none" : "cursor-pointer"
                                }`}
                            onClick={() => !isClaiming && handleClaim(spinId)}
                        >
                            <div className="text-white tracking-wide text-lg flex justify-between">
                                {isClaiming
                                    ? (language == "my" ? "ခေတ္တစောင့်ဆိုင်းပါ..." : "Processing...")
                                    : (language == "my" ? "ယခု ရွေးပါ။" : "Reedem now")}
                                {!isClaiming && <ArrowRight />}
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}

export default ProductPopUpPageDummy;
