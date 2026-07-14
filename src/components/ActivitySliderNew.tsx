// import { Card } from "@/components/ui/card";

// import type { Activity } from "@/types";

// export default function ActivitySlider({
//   activities,
// }: {
//   activities: Activity[];
// }) {
//   return (
//     <div className="flex gap-4 overflow-x-auto pb-2">
//       {activities.map((activity) => (
//         <div
//           key={activity.id}
//           className="glass-card rounded-xl p-4 min-w-[240px] card-shadow"
//         >
//           <p className="text-xs font-medium leading-snug">
//             {activity.message}
//           </p>

//           <span className="text-[10px] text-muted-foreground mt-2 block">
//             {activity.time}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

// import type { Activity } from "@/types"
// import { c } from "node_modules/framer-motion/dist/types.d-Cjd591yU"

// export default function ActivitySlider({
//   activities,
// }: {
//   activities: Activity[]
// }) {
//   // const gradientBackground = ["gradient-pink-yellow","gradient-pink-violet"];
//   // const gradientBackground = ["bg-gradient-to-r from-pink-500 via-yellow-500 to-yellow-300","bg-gradient-to-r from-pink-500 via-violet-500 to-violet-300"];
//   const gradientBackground = ["gradient-purple", "gradient-green", "gradient-pink-dark", "gradient-casino"];

//   return (
//     <div className="relative overflow-hidden">
//       <div className="flex gap-4 animate-slide-right">
//         {[...activities, ...activities].map((activity, index) => (
//           <div
//             key={`${activity.id}-${index}`}
//             className={` rounded-xl p-4 min-w-[240px] card-shadow ${gradientBackground[index % gradientBackground.length]}`}
//           >
//             {/* <p className="text-xs font-medium leading-snug">
//               {activity.message}
//             </p> */}

//             <h3 className="text-sm font-bold ">
//               {activity.message}
//             </h3>

//             <span className="text-[10px] text-white-foreground mt-2 block">
//               {activity.time}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// "use client";

// import React from "react";
// import { Zap, Timer } from "lucide-react";
// import type { Activity } from "@/types";

// interface ActivitySliderProps {
//   activities: Activity[];
// }

// export default function ActivitySlider({ activities }: ActivitySliderProps) {
//   const gradientStyles = [
//     "from-indigo-600 to-purple-600",
//     "from-emerald-500 to-blue-600",
//     "from-rose-500 to-orange-500",
//     "from-violet-600 to-pink-500",
//   ];

//   return (
//     <div className="relative w-full overflow-hidden py-2">
//       {/* Edge Fading Masks */}
//       {/* <div className="absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
//       <div className="absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" /> */}

//       {/* ANIMATION NOTE:
//           We use a standard CSS animation defined in your global CSS
//           or via Tailwind's arbitrary class: animate-[slide-right_30s_linear_infinite]
//       */}
//       <div className="flex gap-4 animate-[slide-right_30s_linear_infinite] whitespace-nowrap px-4 w-max">
//         {[...activities, ...activities].map((activity, index) => {
//           const gradientClass = gradientStyles[index % gradientStyles.length];

//           return (
//             <div
//               key={`${activity.id}-${index}`}
//               className={`relative min-w-[260px] rounded-2xl p-4 shadow-lg border border-white/20 overflow-hidden bg-gradient-to-br ${gradientClass} active:scale-95 transition-transform`}
//             >
//               {/* Background Decorative Icon */}
//               <Zap className="absolute -right-2 -bottom-2 w-16 h-16 text-white/10 -rotate-12" />

//               <div className="relative z-10 flex flex-col justify-between h-full">
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
//                   <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
//                     Live
//                   </span>
//                 </div>

//                 <h3 className="text-sm font-bold text-white leading-tight whitespace-normal line-clamp-2">
//                   {activity.message}
//                 </h3>

//                 <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10">
//                   <Timer className="w-3 h-3 text-white/60" />
//                   <span className="text-[10px] font-bold text-white/80">
//                     {activity.time}
//                   </span>
//                 </div>
//               </div>

//               {/* Shine Layer */}
//               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect } from "react";
import { Zap, Timer } from "lucide-react";
import type { Activity } from "@/types";
import { useLanguage } from "./context/LanguageContext";
import { placeBid } from "@/features/placebid/placeBidSlice";
import { OTHER_API_URL } from "@/config/config";

interface ActivitySliderProps {
  activities: Activity[];
}

// const maskPhone = (phone: string) => {
//   if (!phone) return "";
//   return `+${phone.slice(0, 3)}****${phone.slice(-2)}`;
// };

const maskMSISDN = (phone: string) => {
  if (!phone || phone.length < 12) return phone;

  // Remove first 2 digits (country code like 95)
  const trimmed = phone.slice(2);

  // Ensure it's 10 digits after trimming
  if (trimmed.length !== 10) return phone;

  const start = trimmed.slice(0, 3);
  const end = trimmed.slice(-3);

  return `${start}xxxx${end}`;
};

export default function ActivitySliderNew({ updatedData }) {
  const [activityList, setActivityList] = React.useState<any[]>([]);
  const { t } = useLanguage();
  // console.log("updatedData", updatedData);
  useEffect(() => {
    if (!Array.isArray(updatedData)) return;

    const formatted: Activity[] = updatedData.map((item: any, index: number) => ({
      id: index + 1,
      user: maskMSISDN(item.user_phone),
      message: `${maskMSISDN(item.user_phone)} ${t.placedBid}`,
      user_phone: maskMSISDN(item.user_phone),
      newMessage: `${Math.floor(Math.random() * 10) + 1 % 2 === 0 ? `placed a bid` : `Player won the Bid`}`,
      time: t.justNow,
      avatar: item.user_image, // ✅ from API
    }));

    setActivityList(formatted);
  }, [updatedData, t]);
  const gradientStyles = [
    "from-indigo-600 to-purple-600",
    "from-emerald-500 to-blue-600",
    "from-rose-500 to-orange-500",
    "from-violet-600 to-pink-500",
  ];

  // Generate consistent avatar for each activity
  const getAvatarSeed = (activityId: number) => {
    const seeds = ["alex", "sarah", "mike", "emma", "john", "lisa", "david", "sophie", "chris", "anna"];
    return seeds[activityId % seeds.length];
  };

  return (
    <div className="relative w-full overflow-hidden py-2 ">
      {/* Edge Fading Masks */}
      {/* <div className="absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" /> */}

      {/* ANIMATION NOTE: 
          We use a standard CSS animation defined in your global CSS 
          or via Tailwind's arbitrary class: animate-[slide-right_30s_linear_infinite]
      */}
      <div className="flex gap-4 animate-[slide-right_30s_linear_infinite] whitespace-nowrap px-4 w-max will-change-transform">
        {[...activityList, ...activityList].map((activity, index) => {
          const gradientClass = gradientStyles[index % gradientStyles.length];
          const avatarSeed = getAvatarSeed(activity.id);

          return (
            <div
              key={`${activity.id}-${index}`}
              className={`relative min-w-[240px] rounded-2xl p-3 shadow-lg border border-white/20 overflow-hidden bg-gradient-to-br ${gradientClass} active:scale-95 transition-transform`}
            >
              {/* Background Decorative Icon */}
              <Zap className="absolute -right-2 -bottom-2 w-16 h-16 text-white/10 -rotate-12" />

              <div className="relative z-10 flex flex-col justify-between h-full">


                {/* Avatar + Message Section */}
                <div className="flex items-center justify-between gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm p-0.5 border-2 border-white/30 shadow-lg">
                      <div className="w-full h-full rounded-lg overflow-hidden bg-white">
                        <img
                          src={`${OTHER_API_URL}assets/frontend/users/${activity.avatar}`}
                          alt="User avatar"
                          className="w-full h-full"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    {/* Message */}
                    <h3 className="text-sm font-bold text-white leading-tight whitespace-normal">
                      {activity.user_phone}
                    </h3>
                    <p className="text-[10px] font-semibold text-white  italic">
                      {activity.newMessage}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                      {t.live}
                    </span>
                  </div>

                </div>

                {/* <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10">
                  <Timer className="w-3 h-3 text-white/60" />
                  <span className="text-[10px] font-bold text-white/80">
                    {activity.time}
                  </span>
                </div> */}
              </div>

              {/* Shine Layer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
}