import { Button } from "react-bootstrap";

const HeroSection = () => {
  return (
    <div className="hero-section text-center text-white">
      <h2 className="fw-bold mb-2">Join the Auction, Win Big!</h2>

      <Button className="hero-btn mt-2">
        Start Bidding Now →
      </Button>
    </div>
  );
};

export default HeroSection;
