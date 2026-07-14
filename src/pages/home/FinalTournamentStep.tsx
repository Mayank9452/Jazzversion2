import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Game {
  id: number;
  name: string;
  image: string;
}

const entryOptions = [50, 100, 200, 500];
const playerOptions = [10, 20, 50, 100];

const FinalTournamentStep: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game } = location.state as { game: Game };

  const [entryFee, setEntryFee] = useState(100);
  const [players, setPlayers] = useState(20);
  const [distribution, setDistribution] = useState<'winner' | 'top3'>('winner');

  return (
    <div className="container p-0">
      {/* Header */}
      <div
        className="d-flex align-items-center px-3"
        style={{
          background: 'linear-gradient(to top, #02a2c1, #00d5ff)',
          color: '#fff',
          height: '60px',
          boxShadow: '0 2px 5px 2px rgba(1, 1, 1, 0.4)',
        }}
      >
        <i
          className="bi bi-arrow-left me-2"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        />
        <h5 className="mb-0 text-white">Create Tournament</h5>
      </div>

      {/* Body */}
      <div className="p-3 bg-white border border-top-0">
        <h6 className="fw-bold text-uppercase mb-3">Final Step</h6>

        {/* Game Preview */}
        <div className="d-flex align-items-center mb-4 border rounded p-2 shadow-sm">
          <img
            src={game.image}
            alt={game.name}
            style={{ height: '50px', width: '50px', objectFit: 'cover' }}
            className="rounded me-3"
          />
          <span className="fw-semibold">{game.name}</span>
        </div>

        {/* Start and End Time */}
        <div className="row text-center mb-4">
          <div className="col border-end">
            <div className="fw-bold text-uppercase">Start Time</div>
            <div className="text-muted">15 July</div>
            <div><i className="bi bi-clock me-1"></i>03:15 PM</div>
          </div>
          <div className="col">
            <div className="fw-bold text-uppercase">End Time</div>
            <div className="text-muted">16 July</div>
            <div><i className="bi bi-clock me-1"></i>03:15 PM</div>
          </div>
        </div>

        {/* Entry Fee & Players */}
        <h6 className="fw-semibold mb-3">Set Tournament Entry Fees</h6>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label fw-semibold">
              🪙 Entry Fee <i className="bi bi-info-circle-fill text-muted" title="Fee per player"></i>
            </label>
            <select
              className="form-select shadow-sm"
              value={entryFee}
              onChange={(e) => setEntryFee(Number(e.target.value))}
            >
              {entryOptions.map((fee) => (
                <option key={fee} value={fee}>{fee}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="form-label fw-semibold">
              👥 Players
            </label>
            <select
              className="form-select shadow-sm"
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
            >
              {playerOptions.map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Prize Distribution Options */}
        <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="winner"
              name="distribution"
              value="winner"
              checked={distribution === 'winner'}
              onChange={() => setDistribution('winner')}
            />
            <label className="form-check-label fw-medium" htmlFor="winner">
              Winner takes all
            </label>
          </div>
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="radio"
              id="top3"
              name="distribution"
              value="top3"
              checked={distribution === 'top3'}
              onChange={() => setDistribution('top3')}
            />
            <label className="form-check-label fw-medium" htmlFor="top3">
              Distribute prize among top 3
            </label>
          </div>
        </div>

        {/* Info note */}
        <p className="small text-muted mb-4">
          Entry fee will be refunded if no one joins this tournament.
        </p>

        {/* Submit Button */}
        <button
          className="btn btn-success w-100 py-2 fw-bold text-uppercase"
          style={{ backgroundColor: '#00d5b6', borderColor: '#00c3a5' }}
        >
          Create Tournament
        </button>
      </div>
    </div>
  );
};

export default FinalTournamentStep;
