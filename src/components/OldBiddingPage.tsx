import { useState } from "react";
import { Sparkles, Trophy, Shuffle, Trash2, Check, X } from "lucide-react";
import { TopBar } from "./TopBar";
import { BottomNavBar } from "./BottomNavBar";
import { useLanguage } from "./context/LanguageContext";
import { useAppSelector } from "@/app/hooks";
import ActivitySlider from "./ActivitySlider";

export default function OldBiddingPage() {
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: number]: string;
  }>({});
  const [currentTicket, setCurrentTicket] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const { t } = useLanguage();

  const { data: bidResponse } = useAppSelector((state) => state.bid);

  // actual API payload
  const bidData = bidResponse?.data;
  const bidInfo = bidData?.bidInfo;

  // values you need
  const bidName = bidInfo?.bid_name?.replace(/\+/g, " ");
  const latestUsers = bidData?.latest_joined_users || [];

  const tickets = Array(6).fill(null);

  const handleNumberClick = (num: string) => {
    if (currentTicket === null) return;

    const newValue = inputValue + num;
    if (newValue.length <= 4) {
      setInputValue(newValue);
    }
  };

  const handleTicketSelect = (index: number) => {
    setCurrentTicket(index);
    setInputValue(selectedTickets[index] || "");
  };

  const handleConfirm = () => {
    if (currentTicket !== null && inputValue.length > 0) {
      setSelectedTickets({ ...selectedTickets, [currentTicket]: inputValue });
      setInputValue("");
      setCurrentTicket(null);
    }
  };

  const handleDelete = () => {
    setInputValue(inputValue.slice(0, -1));
  };

  const handleCancelInput = () => {
    setInputValue("");
    setCurrentTicket(null);
  };

  const handleAutoPick = () => {
    const newTickets: { [key: number]: string } = {};
    tickets.forEach((_, index) => {
      const digits = Math.floor(Math.random() * 4) + 1; // 1-4 digits
      const maxNum = Math.pow(10, digits) - 1;
      const minNum = Math.pow(10, digits - 1);
      newTickets[index] = Math.floor(
        minNum + Math.random() * (maxNum - minNum + 1),
      ).toString();
    });
    setSelectedTickets(newTickets);
    setCurrentTicket(null);
    setInputValue("");
  };

  const handleClearAll = () => {
    setSelectedTickets({});
    setCurrentTicket(null);
    setInputValue("");
  };

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 p-2">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-700 active:from-purple-700 active:to-rose-700 pt-6 pb-20 px-3 overflow-hidden rounded-2xl">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl" />

          <div className="relative max-w-md mx-auto text-center">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {/* {t.placeYourBid} */}
              {bidName?.includes("Daily") ? `${t.bidDaily} ${bidName?.split(" ")[2]}` : `${t.bidWeekly} ${bidName?.split(" ")[2]}`}
            </h1>
            <p className="text-xs text-white/80 mt-1">
              {/* {t.chooseNumbersWin} */}
              {t.latestUserJoinedBid}
            </p>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="-mt-16 px-2">
          <div className="max-w-md mx-auto space-y-4">
            {/* Set Info Card - Enhanced */}
            <div className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-2xl border-2 border-pink-200">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-300/30 to-pink-300/30 rounded-full blur-3xl"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl blur-lg opacity-50"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <Trophy
                        className="w-7 h-7 text-white"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {t.bid} 2
                    </p>
                    <p className="text-xs font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
                      {/* {t.activeCycle} : 4 */}
                      {bidName || "-"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t.selected}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {Object.keys(selectedTickets).length}
                    </p>
                    <p className="text-xl font-bold text-gray-400">/6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* {bidData?.latest_joined_users?.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-pink-200 py-2 px-2">
                <div className="flex gap-4 animate-slide-right whitespace-nowrap">
                  
                  {[
                    ...bidData.latest_joined_users,
                    ...bidData.latest_joined_users,
                  ].map((user: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 px-3 py-1 rounded-full shadow"
                    >
                      
                      <img
                        src={`https://bidblast.club/assets/frontend/users/${user.user_image}`} // adjust path if needed
                        alt="user"
                        className="w-6 h-6 rounded-full border border-white"
                      />

                     
                      <p className="text-xs font-bold text-gray-700">
                        {user.user_phone} joined
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            <ActivitySlider updatedData={latestUsers} />

            {/* Tickets Grid - Enhanced */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl"></div>

              <div className="relative rounded-3xl bg-white p-4 shadow-2xl border-2 border-pink-200">
                {/* Grid Header */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                    />
                  </div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {t.fillYourTickets}
                  </h2>
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {tickets.map((_, index) => {
                    const isSelected = currentTicket === index;
                    const hasValue = selectedTickets[index];
                    // All start with amber-orange, turn emerald-teal when filled
                    const ticketColor = hasValue
                      ? "from-emerald-400 via-teal-400 to-cyan-500"
                      : "from-amber-400 via-orange-400 to-orange-500";

                    return (
                      <button
                        key={index}
                        onClick={() => handleTicketSelect(index)}
                        className={`relative group active:scale-95 transition-all duration-200 ${isSelected ? "scale-105" : ""}`}
                      >
                        {/* Ticket */}
                        <div
                          className={`relative rounded-2xl overflow-hidden ${isSelected
                            ? "ring-2 ring-pink-500 ring-offset-2 shadow-2xl"
                            : "shadow-xl"
                            }`}
                        >
                          {/* Ticket Background */}
                          <div
                            className={`relative bg-gradient-to-br ${ticketColor} p-4 h-28`}
                          >
                            {/* Animated shimmer for filled tickets */}
                            {hasValue && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            )}

                            {/* Dashed Border */}
                            <div className="absolute inset-0 border-2 border-dashed border-white/60 rounded-2xl m-2"></div>

                            {/* Notches */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-10 bg-white rounded-r-full shadow-md"></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-10 bg-white rounded-l-full shadow-md"></div>

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center">
                              {hasValue ? (
                                <>
                                  <p className="text-3xl font-bold text-white drop-shadow-2xl tracking-wider mb-2">
                                    {hasValue}
                                  </p>
                                  <div className="flex items-center gap-1 px-3 py-1 bg-white/40 backdrop-blur-sm rounded-full">
                                    <Check
                                      className="w-3.5 h-3.5 text-white"
                                      strokeWidth={3}
                                    />
                                    <span className="text-[10px] font-bold text-white">
                                      {t.filled}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm font-bold text-white/80 uppercase tracking-wide">
                                    {t.ticket} {index + 1}
                                  </p>
                                  <p className="text-xs font-bold text-white/90 mt-1">
                                    {t.tapToEnter}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Good Luck Badge */}
                <div className="flex justify-center">
                  <div className="px-8 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-full shadow-xl border-2 border-white">
                    <p className="text-sm font-bold text-white tracking-widest">
                      ✨ {t.goodLuck}! ✨
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Display - Enhanced */}
            {currentTicket !== null && (
              <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border-2 border-purple-200">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl"></div>

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-white">
                          {currentTicket + 1}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-700">
                        {t.enterTicketNumber}
                      </p>
                    </div>
                    <button
                      onClick={handleCancelInput}
                      className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform shadow-md"
                    >
                      <X className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Single Input Display */}
                  <div className="mb-2 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                    <p className="text-center text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wider min-h-[60px] flex items-center justify-center">
                      {inputValue || "____"}
                    </p>
                    {/* <p className="text-center text-xs font-bold text-gray-500 mt-2">
                    {inputValue.length}/4 digits
                  </p> */}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={inputValue.length === 0}
                      className={`flex-1 rounded-xl py-3 font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${inputValue.length > 0
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                        : "bg-gradient-to-r from-orange-200 to-red-200 text-orange-400 cursor-not-allowed"
                        }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {t.delete}
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={inputValue.length === 0}
                      className={`flex-1 rounded-xl py-3 font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-95 ${inputValue.length > 0
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
                        : "bg-gradient-to-r from-green-200 to-emerald-200 text-green-400 cursor-not-allowed"
                        }`}
                    >
                      <Check className="w-4 h-4" />
                      {t.confirm}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Number Pad - Enhanced */}
            <div className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-2xl border-2 border-pink-200">
              <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .animate-shimmer {
              animation: shimmer 3s infinite;
            }
          `}</style>

              {/* <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Keypad
              </h2>
            </div> */}

              <div className="grid grid-cols-5 gap-2 mb-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, idx) => {
                  const colors = [
                    "from-pink-500 to-rose-500",
                    "from-purple-500 to-fuchsia-500",
                    "from-blue-500 to-cyan-500",
                    "from-emerald-500 to-teal-500",
                    "from-orange-500 to-amber-500",
                    "from-red-500 to-pink-500",
                    "from-indigo-500 to-purple-500",
                    "from-teal-500 to-cyan-500",
                    "from-rose-500 to-pink-500",
                    "from-amber-500 to-orange-500",
                  ];
                  const isDisabled = currentTicket === null;

                  return (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num.toString())}
                      disabled={isDisabled}
                      className={`aspect-square rounded-xl text-xl font-bold transition-all shadow-lg border-2 border-orange-500 ${isDisabled
                        ? "bg-gradient-to-br from-pink-200 to-orange-200 text-pink-400 cursor-not-allowed opacity-90"
                        : `bg-gradient-to-br ${colors[idx]} text-white hover:shadow-xl active:scale-90`
                        }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAutoPick}
                  className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Shuffle className="w-5 h-5" strokeWidth={2.5} />
                  <span>{t.autoPick}</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 opacity-80"
                >
                  <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                  <span>{t.clearAll}</span>
                </button>
              </div>
            </div>

            {/* Submit Button - Enhanced */}
            <button
              disabled={Object.keys(selectedTickets).length !== 6}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all ${Object.keys(selectedTickets).length === 6
                ? "bg-gradient-to-r from-pink-600 via-rose-600 to-orange-500 active:from-pink-700 active:to-rose-700 text-white opacity-80"
                : "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white border-orange-300 opacity-80 cursor-not-allowed"
                }`}
            >
              {Object.keys(selectedTickets).length === 6
                ? `🎯 ${t.submitAllTickets}`
                : `📝 ${t.fillAllTickets} (${Object.keys(selectedTickets).length}/6)`}
            </button>
          </div>
        </div>
      </div>
      <BottomNavBar />
    </>
  );
}
