import { Card } from "react-bootstrap";
import { FaChartLine, FaUsers, FaCoins } from "react-icons/fa";

const StatsCards = () => {
  return (
    <div className="stats-grid">
      <StatCard icon={<FaChartLine />} label="Active Bids" value="24" />
      <StatCard icon={<FaUsers />} label="Total Users" value="1.2k" />
      <StatCard icon={<FaCoins />} label="Prize Pool" value="₹5,00,000" />
    </div>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <Card className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <small>{label}</small>
  </Card>
);

export default StatsCards;
