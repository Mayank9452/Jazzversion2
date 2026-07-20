"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Card } from "./ui/card";
import { ArrowRight, Copy, X, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { claimReward } from "@/features/spinnerRewards/spinnerRewardsSlice";
import GiftCombo from "./ui/GiftCombo";

function ProductPopUpPageVoucher({
  result = {
    id: 1,
    name: "Grab 5000 Ks",
    description: "Grab 5000 Ks Voucher",
    value: 5000,
    bgColor: "#10b981",
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
  const [isClaiming, setIsClaiming] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [hasScratched, setHasScratched] = useState(false);
  const copyTimeoutRef = React.useRef<any>(null);

  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Parse application name and voucher amount from name (e.g., "Grab 5000 Ks" -> "Grab", "5000 Ks")
  const getVoucherDetails = () => {
    const fullName = result?.name || "Voucher";
    const parts = fullName.split(" ");
    const appName = parts[0] || "Voucher";
    let amount = parts.slice(1).join(" ");

    if (!amount) {
      amount = result?.description || "1000 Ks";
    }

    // Append Ks if the amount is just numeric and it is not an MLBB/diamonds reward
    if (/^\d+$/.test(amount.replace(/[,.]/g, "")) && !appName.toLowerCase().includes("mlb")) {
      amount = `${amount} Ks`;
    }

    return { appName, amount };
  };

  const { appName, amount } = getVoucherDetails();

  const handleCopy = () => {
    const codeToCopy = couponCode || `SPZ-${appName.toUpperCase().slice(0, 3)}${amount.replace(/[^0-9]/g, "") || "5"}-K9X2`;
    navigator.clipboard.writeText(codeToCopy);
    setIsCopied(true);

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 4000);
  };

  const handleRedeemRedirect = () => {
    // const urls: Record<string, string> = {
    //   grab: "https://www.grab.com/",
    //   foodpanda: "https://www.foodpanda.com.mm/",
    //   lpa: "https://www.facebook.com/LuckyPlatformApp/",
    //   mlbb: "https://m.mobilelegends.com/",
    //   mllb: "https://m.mobilelegends.com/",
    // };

    // const key = appName.toLowerCase();
    // const targetUrl = urls[key] || "https://google.com";
    // window.open(targetUrl, "_blank");
    navigate("/rewards");
  };

  const handleScratch = async () => {
    if (isClaiming || hasScratched) return;
    setHasScratched(true);
    setIsApiLoading(true);
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
        setCouponCode(payload?.voucher_code || payload?.voucher_details?.voucher_code || "");
        setIsApiLoading(false);
      } else {
        // If not successfully claimed as voucher, navigate to rewards page with status
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
      style={{
        marginTop: "0px",
        background:
          "linear-gradient(180deg, rgba(10, 17, 40, 1) 0%, rgba(10, 17, 40, 1) 60%, rgba(20, 35, 75, 1) 100%)",
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
          y: 200,
          originX: 0.5,
          originY: 1,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          originX: 0.5,
          originY: 0.5,
        }}
        exit={{
          scale: 0,
          y: "0%",
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
          className="absolute top-[10%] end-[10%] z-[99999] text-white"
          onClick={() => {
            resetResults({ status: "idle", isResultNull: true, time: 0 });
          }}
        >
          <X />
        </button>
        <Card className="p-8 sm:px-10 text-center w-full border-0 bg-transparent flex flex-col gap-2 items-center justify-center relative">

          {/* 🎁 Gift Pill (Header) */}
          <div className="flex flex-col gap-6 items-center justify-center w-full relative">
            <GiftCombo
              size={120}
              textClassName="text-base"
              tickets={
                language == "my" && result?.burmeseName !== ""
                  ? result?.burmeseName
                  : (result?.name ?? "Grab 5000 Ks")
              }
            />
          </div>

          <div className="w-full relative">
            {/* Banner card displaying API image and overlaying the amount */}
            <div className="border-[8px] border-gray-300 rounded-t-lg bg-gray-300 relative overflow-hidden aspect-square flex flex-col items-center justify-center">
              {result?.name?.toLowerCase().includes("mllb") || result?.name?.toLowerCase().includes("mlbb") ? (
                <img
                  src="/assets/images/mllb.jpeg"
                  className="w-full h-full object-cover"
                  alt={result.name}
                  loading="lazy"
                />
              ) : result?.image ? (
                <img
                  src={result.image}
                  className="w-full h-full object-cover"
                  alt={result.name}
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-extrabold text-3xl"
                  style={{ backgroundColor: result?.bgColor || "#10b981" }}
                >
                  {appName}
                </div>
              )}
              {/* Overlay Amount text on the banner */}
            </div>

            {/* Inject scratching/shimmer style */}
            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes scratchShimmer {
                0% { transform: translateX(-150%); }
                50% { transform: translateX(150%); }
                100% { transform: translateX(150%); }
              }
              .scratch-card-overlay {
                background: linear-gradient(135deg, #cbd5e1 25%, #94a3b8 25%, #94a3b8 50%, #cbd5e1 50%, #cbd5e1 75%, #94a3b8 75%, #94a3b8 100%);
                background-size: 20px 20px;
                position: relative;
                overflow: hidden;
              }
            `}} />

            {/* Coupon Box Card Section */}
            <div className="border-t-4 border-dashed border-gray-400 bg-white w-full flex flex-col p-5 text-start gap-4 rounded-b-lg">
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                  {language === "my" ? "သင့်ကူပွန်ကုဒ်" : "Your Coupon Code"}
                </span>

                {/* Dashed Border Code input with Copy Button */}
                <div className="border border-dashed border-gray-300 rounded-lg p-1 bg-gray-50 flex items-center justify-between w-full mt-1 min-h-[50px] relative overflow-hidden">
                  {!hasScratched ? (
                    <div 
                      onClick={handleScratch}
                      className="w-full h-10 rounded-md scratch-card-overlay flex items-center justify-center cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        style={{
                          animation: 'scratchShimmer 2s infinite linear',
                          width: '100%',
                          height: '100%',
                        }}
                      />
                      <span className="text-[12px] text-slate-800 font-extrabold uppercase tracking-widest relative z-10 select-none animate-pulse">
                        {language === "my" ? "ကူပွန်ခြစ်ရန် နှိပ်ပါ" : "Scratch Now"}
                      </span>
                    </div>
                  ) : isApiLoading ? (
                    <div className="w-full h-10 rounded-md scratch-card-overlay flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        style={{
                          animation: 'scratchShimmer 1.5s infinite linear',
                          width: '100%',
                          height: '100%',
                        }}
                      />
                      <span className="text-[11px] text-slate-800 font-extrabold uppercase tracking-widest relative z-10 select-none animate-pulse">
                        {language === "my" ? "ခြစ်နေသည်..." : "Scratching..."}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="font-mono text-md sm:text-lg font-bold tracking-wider text-black pl-3 select-all">
                        {couponCode}
                      </span>

                      <button
                        onClick={handleCopy}
                        disabled={isApiLoading}
                        className="bg-[#0a1128] hover:bg-[#14234b] text-white p-2.5 rounded-md flex items-center justify-center active:scale-95 transition-all aspect-square mr-1"
                      >
                        {isCopied ? (
                          <Check size={16} className="text-emerald-400 animate-in fade-in zoom-in duration-200" />
                        ) : (
                          <Copy size={16} className="text-white" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Instructions text */}
              <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed">
                {language === "my"
                  ? `ရွေးယူရန် ဤကုဒ်ကို ${appName} app ရှိ Rewards အောက်တွင် ထည့်သွင်းပါ။`
                  : `Enter this code in the ${appName} app under Rewards to redeem.`}
              </p>
            </div>

            {/* Bottom Redeem/Claim Button */}
            <div
              className={`mt-4 rounded-xl py-3.5 px-6 flex items-center justify-between shadow-lg transition-all ${
                (!couponCode || isApiLoading)
                  ? "opacity-50 pointer-events-none cursor-not-allowed bg-gray-600"
                  : "cursor-pointer active:scale-95 gradient-green-light"
              }`}
              style={{
                background: (!couponCode || isApiLoading)
                  ? "#4b5563"
                  : "linear-gradient(90deg, #59e3a6 0%, #2eb4ec 100%)",
              }}
              onClick={() => {
                if (couponCode && !isApiLoading) {
                  handleCopy();
                  handleRedeemRedirect();
                }
              }}
            >
              <span className="text-slate-950 font-extrabold text-base tracking-wide">
                {isApiLoading
                  ? (language === "my" ? "ကုဒ်ရယူနေသည်..." : "Fetching code...")
                  : !couponCode
                  ? (language === "my" ? "ကူပွန်ကုဒ်ကို အရင်ခြစ်ပါ" : "Scratch Card to Reveal Code")
                  : (language === "my" ? `${appName} app တွင် ရယူရန်` : `Redeem in ${appName} app`)}
              </span>
              {couponCode && !isApiLoading && <ArrowRight className="text-slate-950 stroke-[3px]" size={20} />}
            </div>

          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default ProductPopUpPageVoucher;
