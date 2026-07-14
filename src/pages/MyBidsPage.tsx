import BidCard from "@/components/BidCard";
import { BIDS_DATA } from "@/utils/mockData";

// import BidCard from "@/components/BidCard";
// import { BIDS_DATA } from "@/utils/mockData";

export default function MyBidsPage() {
  return (
    <div className="mobile-container px-4 py-6 space-y-6">
      <h1 className="text-xl font-extrabold text-gradient-casino">
        My Bids
      </h1>

      {/* TWO PER ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {BIDS_DATA.map((bid) => (
          <BidCard key={bid.id} bid={bid} />
        ))}
      </div>
    </div>
  );
}

