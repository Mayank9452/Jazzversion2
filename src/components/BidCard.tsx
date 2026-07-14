import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Bid } from "@/types";
import { Clock, Users } from "lucide-react"
import { useLanguage } from "./context/LanguageContext";

import React from "react";

export default React.memo(function BidCard({ bid, background }: { bid: Bid; background: string }) {
  // console.log("BidCard background:", background);
  const { t } = useLanguage();
  return (
    <div className={` w-full min-w-0 rounded-2xl p-4 transition-smooth hover:glow ${background}`}>

      {/* HEADER */}
      <div className="flex justify-center items-center mb-3">
        {/* <h3 className="text-sm font-bold text-gradient-light leading-tight font-extrabold">
          {bid.title}
        </h3> */}

        <span className="text-[10px] px-2 py-1 rounded-full gradient-light text-black font-extrabold">
          {/* {bid.status} */}
          <h3 className="text-sm font-bold  leading-tight font-semibold">
            {bid.title}
          </h3>

        </span>
      </div>

      {/* DESCRIPTION */}
      {/* <p className="text-xs font-extrabold text-white-foreground mb-4 line-clamp-2">
        <Clock className="w-4 h-4 text-orange-400 shrink-0" />
        {bid.description}
      </p> */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4  shrink-0" />
        <p className="text-xs font-extrabold text-white-foreground line-clamp-2">
          {bid.description}
        </p>
      </div>

      {/* BID INFO */}
      {/* <div className="flex justify-between items-center mb-4 font-extrabold">
        <span className="">Bidder </span>
        <span className="font-extrabold text-base text-gradient-green">
          {bid.currentBid}
        </span>
      </div> */}

      <div className="flex justify-between items-center mb-4 font-extrabold">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 " />
          <span>{t.bidder}</span>
        </div>

        <span className="font-extrabold text-base text-gradient-green">
          {bid.currentBid}
        </span>
      </div>

      {/* CTA BUTTON */}
      <button className="pushable w-full">
        {/* <span className="cs-shadow" />
        <span className="edge gradient-light" /> */}
        <span className="front bg-white  py-2 rounded-lg text-sm"
          style={{ color: "deeppink" }}
        >
          {t.enterBid}
        </span>
      </button>

    </div>
  );
}
