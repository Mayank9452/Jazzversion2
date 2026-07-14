import Leaderboard from "@/components/Leaderboard";
import { LEADERBOARD_DATA } from "@/utils/mockData";

// export default function LeaderboardPage() {
//   return (
//     <div className="max-w-5xl mx-auto">
//       <h1 className="text-xl font-bold mb-6">Leaderboard</h1>
//       <Leaderboard users={LEADERBOARD_DATA} />
//     </div>
//   );
// }
export default function LeaderboardPage() {
  return (
    <div className="mobile-container px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Leaderboard</h1>
      <Leaderboard weeklyUsers={LEADERBOARD_DATA} monthlyUsers={LEADERBOARD_DATA} />
    </div>
  );
}

