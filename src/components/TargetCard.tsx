import { Play, Target } from "lucide-react";
import { motion } from "framer-motion";

interface TargetCardProps {
    game: {
        id: string;
        name: string;
        image: string;
        target: string;
        prize: string;
    };
    isCenter: boolean;
    onClick: () => void;
}

export default function TargetCard({
    game,
    isCenter,
    onClick,
}: TargetCardProps) {
    return (
        <motion.div
            whileTap={{ scale: 0.97 }}
            className="relative cursor-pointer select-none"
            onClick={onClick}
        >
            <div
                className={`
                    relative
                    overflow-hidden
                    rounded-[30px]
                    bg-neutral-900
                    transition-all
                    duration-500
                    ${isCenter
                        ? "w-[220px] h-[310px]"
                        : "w-[180px] h-[255px]"
                    }
                `}
                style={{
                    boxShadow:
                        "0 20px 60px rgba(0,0,0,.45),0 10px 25px rgba(0,0,0,.25)",
                }}
            >
                <img
                    src={game.image}
                    alt={game.name}
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                {isCenter && (
                    <>
                        <button
                            className="absolute right-3 bottom-16 h-11 w-11 rounded-full bg-brand-gradient flex items-center justify-center shadow-xl"
                        >
                            <Play className="h-5 w-5 fill-current text-brand-black-100 ml-0.5" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-xl px-4 py-2 text-xs font-semibold text-white">
                            <Target className="w-4 h-4" />
                            Target {game.target}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}