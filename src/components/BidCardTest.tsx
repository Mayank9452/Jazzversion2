import {
  Users,
  TrendingUp,
  Target,
  Gem,
  Award,
  DollarSign,
  Trophy,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";
import { useAppDispatch } from "@/app/hooks";
import { fetchBidInfo } from "@/features/bid/bidSlice";
import { useEffect, useState } from "react";
import MyanmarClock from "./MynammarClock";

const themes = [
  {
    gradient: "from-violet-600 to-indigo-600",
    accentText: "text-violet-700",
  },
  {
    gradient: "from-fuchsia-600 to-pink-600",
    accentText: "text-fuchsia-700",
  },
  {
    gradient: "from-cyan-500 to-blue-600",
    accentText: "text-cyan-700",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    accentText: "text-emerald-700",
  },
];

const bidIcons = [Target, Gem, Award, TrendingUp, DollarSign];

const getMMTTime = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 6.5 * 60 * 60 * 1000);
};

const getTimeLeft = (endTime: string) => {
  const now = getMMTTime().getTime();
  const diff = new Date(endTime).getTime() - now;
  if (diff <= 0) return "00 : 00 : 00 : 00";

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return `${String(d).padStart(2, "0")} : ${String(h).padStart(
    2,
    "0"
  )} : ${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
};

const formatPrize = (val: number) =>
  val >= 1024 ? `${val / 1024} GB` : `${val} MB`;

export default function BidCardTest({ bid, index }: any) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  const theme = themes[index % themes.length];
  const BidIcon = bidIcons[index % bidIcons.length];

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(bid.endTime));

  // console.log("bid info", bid);

  useEffect(() => {
    const id = setInterval(
      () => setTimeLeft(getTimeLeft(bid.endTime)),
      1000
    );
    return () => clearInterval(id);
  }, [bid.endTime]);

  return (
    <div
      onClick={async () => {
        await dispatch(fetchBidInfo(bid.id)).unwrap();
        navigate(`/biddingPage`, { state: { bidId: bid.id } });
      }}
      className="relative w-full rounded-2xl overflow-hidden bg-white/90 backdrop-blur-md border border-white/30 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.97]"
    >
      {/* Banner */}
      <div
        className={`relative h-24 bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center gap-1.5`}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

        <div className="relative z-10 w-9 h-9 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center">
          <MyanmarClock />
        </div>

        <p className="relative z-10 text-[11px] font-bold text-white text-center px-2 truncate">
          {bid.name}
        </p>

        <div className="relative z-10 flex items-center gap-1 text-white text-[10px] font-bold">
          <Trophy className="w-3 h-3" />
          Win {formatPrize(Number(bid.prize))}
        </div>
      </div>

      {/* Body */}
      <div className="p-2 flex flex-col gap-2 bg-white/40 backdrop-blur-md">
        {/* Timer */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl px-3 py-1 text-center">
          <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-gray-600">
            <Clock className="w-3 h-3" />
            Ends In
          </div>
          <div className="text-[11px] font-bold text-red-500 animate-pulse">
            {timeLeft}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/70 border border-white/40 rounded-xl p-2 text-center">
            <Users className="w-4 h-4 mx-auto text-gray-700" />
            <p className="text-[9px]">Players</p>
            <p className="text-sm font-bold text-gray-700">{bid.currentBid}</p>
          </div>

          <div className="bg-white/70 border border-white/40 rounded-xl p-2 text-center">
            <p className="text-[9px]">Cycle</p>
            <p className="text-sm font-bold">{bid.activeCycle}</p>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full py-2 rounded-xl bg-gradient-to-r from-[#0a0f7a] to-pink-600 text-white text-xs font-bold shadow-lg">
          <div className="flex items-center justify-center gap-1">
            <Target className="w-3.5 h-3.5" />
            {t.enterBid}
          </div>
        </button>
      </div>
    </div>
  );
}