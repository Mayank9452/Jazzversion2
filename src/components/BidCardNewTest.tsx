import { motion } from "framer-motion";
import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { useLanguage } from "./context/LanguageContext";
import BidCard from "./BidCard";
import BidCardTest from "./BidCardTest";

export default function BidCardDemoNewTest() {
  const { data: response } = useAppSelector((state) => state.home);
  const liveBids = response?.data?.liveBids || [];
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"Daily" | "Weekly">("Daily");

  const formattedBids = liveBids.map((item: any) => ({
    id: item.bid_id,
    name: item.bid_name.replace(/\+/g, " "),
    prize: item.bid_prize_1,
    endTime: item.bid_end_timestamp,
    activeCycle: item.bid_active_cycle,
    currentBid: item.total_bids_count,
  }));

  const DailyBids = formattedBids.filter((b: any) =>
    b.name.includes("Daily")
  );
  const WeeklyBids = formattedBids.filter((b: any) =>
    b.name.includes("Weekly")
  );

  const displayedBids =
    activeTab === "Daily" ? DailyBids.slice(0,3) : WeeklyBids.slice(0,1);

  const isSingle = displayedBids.length === 1;
  const isOdd =
    displayedBids.length > 1 && displayedBids.length % 2 !== 0;
  const isEven =
    displayedBids.length > 1 && displayedBids.length % 2 === 0;

  return (
    <div>
      {/* Tabs */}
      <div className="flex bg-white/20 backdrop-blur-xl border border-white/30 p-1 rounded-xl mb-2">
        {["Daily", "Weekly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg ${
              activeTab === tab ? "bg-white text-black" : "text-white"
            }`}
          >
            {tab === "Daily" ? t.daily : t.weekly}
          </button>
        ))}
      </div>

      {/* Layouts */}
      {isSingle && (
        <BidCardTest bid={displayedBids[0]} index={0} />
      )}

      {isEven && (
        <div className="grid grid-cols-2 gap-2">
          {displayedBids.map((bid: any, i: number) => (
            <BidCardTest key={bid.id} bid={bid} index={i} />
          ))}
        </div>
      )}

      {isOdd && (
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-2 cursor-grab"
            drag="x"
            dragConstraints={{
              left: -((displayedBids.length - 1) * 260),
              right: 0,
            }}
          >
            {displayedBids.map((bid: any, i: number) => (
              <div key={bid.id} className="min-w-[80%]">
                <BidCardTest bid={bid} index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}