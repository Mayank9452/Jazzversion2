import {
  Clock,
  Users,
  Zap,
  TrendingUp,
  Target,
  Gem,
  Award,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchBidInfo } from "@/features/bid/bidSlice";

// Mock data for demonstration
const SAMPLE_BIDS = [
  { id: 1, cycle: 1, currentBid: 452, status: "live" },
  { id: 2, cycle: 2, currentBid: 328, status: "live" },
  { id: 3, cycle: 1, currentBid: 567, status: "live" },
  { id: 4, cycle: 3, currentBid: 891, status: "live" },
];

const gradientBackgrounds = [
  "from-violet-600 to-indigo-600",
  "from-fuchsia-600 to-pink-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-purple-600 to-blue-600",
];

// Different icons for visual variety
const bidIcons = [Target, Gem, Award, TrendingUp, DollarSign, Zap];

function BidCard({
  bid,
  background,
  index,
}: {
  bid: any;
  background: string;
  index: number;
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const BidIcon = bidIcons[index % bidIcons.length];

  return (
    <div
      className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-violet-50 to-indigo-50 shadow-md active:scale-95 transition-transform duration-150 border border-gray-300"
      onClick={async () => {
        await dispatch(fetchBidInfo(bid.id)).unwrap(); // wait for API

        navigate(`/biddingPage`, { state: { bidId: bid.id } });; // ✅ navigate after call
          
      }}
    >
      {/* Gradient Header with Icon - Compact for mobile */}
      <div
        className={`relative h-24 bg-gradient-to-br ${background} p-3 flex items-center justify-center overflow-hidden`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl -translate-x-6 -translate-y-6"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white rounded-full blur-xl translate-x-4 translate-y-4"></div>
        </div>

        {/* Main Icon */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30 shadow-lg">
            <BidIcon
              className="w-7 h-7 text-white drop-shadow-lg"
              strokeWidth={2.5}
            />
          </div>

          {/* Live Indicator - Smaller for mobile */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-gray-800">
              {t.bid} {bid.id} • {t.live}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section - Optimized spacing for mobile */}
      <div className="p-1 space-y-2">
        {/* Title */}
        {/* <div className="text-center">
          <h3 className="text-base font-bold text-gray-800">
            {bid.title}
          </h3>
        </div> */}

        {/* Stats Grid - More compact */}
        <div className="space-y-2">
          {/* Cycle Info */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100">
            <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <p className="text-[11px] font-semibold text-gray-700">
              {/* {bid.description} */}
              {/* {t.activeCycle} {bid.cycle} */}
              {bid.name}
            </p>
          </div>

          {/* Bidders Count */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-semibold text-gray-700">
                {t.players}
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-md shadow-sm">
              <Zap className="w-3 h-3 text-yellow-500" fill="currentColor" />
              <span className="font-bold text-sm text-gray-800">
                {bid.currentBid}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button - Touch optimized */}
        <button className="w-3/4 mx-auto bg-gradient-to-r from-pink-500 to-rose-500 active:from-pink-600 active:to-rose-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors duration-150 shadow-md active:shadow-lg flex items-center justify-center gap-2">
          <Target className="w-4 h-4" />
          {t.enterBid}
        </button>
      </div>
    </div>
  );
}

// Demo Component - Mobile viewport
export default function BidCardDemo() {
  const { data: response } = useAppSelector((state) => state.home);

  const liveBids = response?.data?.liveBids || [];

  const formattedBids = liveBids.map((item: any) => ({
    id: item.bid_id,
    name: item.bid_name.replace(/\+/g, " "),
    cycle: item.bid_active_cycle,
    currentBid: item.total_bids_count,
  }));

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile container simulation */}
      <div className="max-w-md mx-auto bg-white">
        {/* Header */}
        {/* <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white">
          <h1 className="text-xl font-bold text-center">Live Auctions</h1>
        </div> */}

        {/* Content with padding */}
        <div className="p-1">
          {/* Grid - 2 columns for mobile */}
          <div className="grid grid-cols-2 gap-3">
            {formattedBids.map((bid, index) => (
              <BidCard
                key={bid.id}
                bid={bid}
                background={
                  gradientBackgrounds[index % gradientBackgrounds.length]
                }
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
