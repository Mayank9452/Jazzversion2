"use client"

import { useAppSelector } from "@/app/hooks"
import { Button } from "@/components/ui/button"
import { Coins, Gem, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function TopBar({
    comingFrom = "spin-the-wheel",
    remainingJackpot = 0,
}: {
    comingFrom?: string
    remainingJackpot?: number
}) {
    const navigate = useNavigate();
    const { data: response } = useAppSelector((state) => state.home);
    const user_play_coins = response?.data?.userInfo?.user_play_coins;
    const { data, status } = useAppSelector((state) => state.profile);
    const userPoints = data?.data?.userPoints ?? 230;
    return (
        <div className="sticky -top-[1px] z-[99] w-full">
            <div
                className="bg-deep-navy px-4 py-2 rounded-b-2xl"
                style={{
                    borderBottom: "1px solid hsl(240 6% 20%)",
                }}
            >
                <div className="flex items-center justify-between">
                    {/* LEFT: LOGO */}
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="flex items-center h-16">
                            <h1 className="text-xl font-bold gradient-bid-blue bg-clip-text text-white">
                                BidBlast
                            </h1>
                        </div>
                    </div>

                    {/* RIGHT: ACTIONS */}
                    <div className="flex items-center gap-3">
                        {/* COINS */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="relative
    bg-card/50 dark:bg-card/10
    backdrop-blur-sm
    hover:bg-card/20
    transition-all

    text-white
    border border-blue-400/60

    before:absolute before:inset-0 before:rounded-md
    before:shadow-[0_0_10px_rgba(59,130,246,0.9)]
    before:opacity-100
    before:animate-pulse
    before:pointer-events-none

    px-3"
                        >
                            <Gem className="h-4 w-4 text-blue-400" />
                            <span className="font-bold text-blue-400 text-[12px]">{userPoints}</span>
                        </Button>



                        {/* REWARD COINS */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-card/50 dark:bg-card/10
    backdrop-blur-sm
    hover:dark:bg-card/20
    transition-all px-1

    text-yellow-400
    border border-border/50 

    before:absolute before:inset-0 before:rounded-md
    before:shadow-[0_0_8px_rgba(250,204,21,0.9)]
    before:opacity-100
    before:animate-pulse
    before:pointer-events-none px-3"
                        >
                            <Coins className="h-4 w-4 text-yellow-400" />
                            <span className="font-bold text-yellow-400 text-[12px]">{user_play_coins}</span>
                        </Button>

                        {/* PROFILE ICON */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/profile")}
                            className="relative
    px-2
    bg-white dark:bg-card/10
    backdrop-blur-sm
    hover:dark:bg-card/20
    transition-all

    
    border border-white/40
    "
                        >
                            <User className="h-4 w-4 text-black" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
