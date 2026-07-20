"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Ticket from "./ui/Ticket";
import TicketCombo from "./ui/TicketCombo";
import RupeeCombo from "./ui/RupeeCombo";
import { ArrowLeft, ArrowRight, Copy, Tag, X, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Swal from "sweetalert2";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { claimReward } from "@/features/spinnerRewards/spinnerRewardsSlice";
import GiftCombo from "./ui/GiftCombo";

function ProductPopUpPageDemo({
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

  const [rewardsList, setRewardsList] = useState<any[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  React.useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (!active) return;
      setIsClaiming(true);
      try {
        const res: any = await dispatch(claimReward(spinId) as any);
        const payload = res?.payload;

        const isSuccess =
          payload?.success === true ||
          payload?.status === "succeeded" ||
          payload?.status === "success" ||
          payload?.message === "Reward claimed successfully!" ||
          payload?.message === "Voucher assigned to user" ||
          payload?.voucher_code ||
          payload?.voucher_details?.voucher_code;

        if (isSuccess) {
          if (active) {
            setIsClaimed(true);
          }
        } else {
          // If not successfully claimed, navigate to rewards page with status
          if (active) {
            if (payload?.message?.includes("subscribed")) {
              navigate("/rewards", { state: { subscriptionRequired: true } });
            } else if (
              payload?.message === "Atom API reward processing failed." ||
              payload?.message === "Reward already claimed." ||
              payload?.message === "Internal Server Error."
            ) {
              navigate("/rewards", { state: { claimError: true } });
            } else {
              navigate("/rewards", { state: { claimSuccess: true } });
            }
          }
        }
      } catch (error) {
        if (active) {
          navigate("/rewards", { state: { claimError: true } });
        }
      } finally {
        if (active) {
          setIsClaiming(false);
        }
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [spinId, dispatch, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0.9, bottom: 0 }}
      animate={{ opacity: 0.9 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="fixed w-full max-w-[480px] h-[100vh] flex items-center justify-center z-[1100] bottom-0 start-[50%] -translate-x-[50%] overflow-hidden"
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
                src={"/assets/images/dashboard_banner_new1.jpeg"}
                className="w-full aspect-square rounded-sm"
                alt=""
                loading="lazy"
              />
            </div>
            <div className="border-t-4 border-dashed border-gray-400 rounded-t-lg bg-white w-full min-h-20 flex flex-col align-center justify-center p-4 text-start gap-3">
              <div className="flex flex-col align-center justify-center text-start gap-1">
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
              className={`border-dashed border-b-[6px] w-full min-h-12 flex flex-col justify-center items-center p-4 text-center ${
                isClaimed
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold"
                  : "bg-slate-800 text-gray-300"
              }`}
            >
              <div className="text-white tracking-wide text-lg font-extrabold flex justify-center items-center gap-2">
                {isClaiming ? (
                  <>
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>
                      {language === "my" ? "ခေတ္တစောင့်ဆိုင်းပါ..." : "Processing..."}
                    </span>
                  </>
                ) : isClaimed ? (
                  <>
                    <Check size={20} className="text-emerald-400 font-extrabold" />
                    <span>
                      {language === "my" ? "အောင်မြင်စွာ ရယူပြီးပါပြီ" : "Successfully Claimed !"}
                    </span>
                  </>
                ) : (
                  <span>
                    {language === "my" ? "လုပ်ဆောင်နေပါသည်..." : "Preparing..."}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default ProductPopUpPageDemo;
