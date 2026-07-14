import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

interface Game {
    id: number;
    name: string;
    image: string;
}

const allGames: Game[] = [
    { id: 1, name: '2 Cars', image: 'http://playtp.igpl.pro/uploads/games/26.jpg' },
    { id: 2, name: '2 Cars Adventure', image: 'http://playtp.igpl.pro/uploads/games/32.jpg' },
    { id: 3, name: '5 Fruit', image: 'http://playtp.igpl.pro/uploads/games/1.jpg' },
    { id: 4, name: 'Air Warfare', image: 'http://playtp.igpl.pro/uploads/games/6.jpg' },
    { id: 5, name: 'Alien Galaxy War', image: 'http://playtp.igpl.pro/uploads/games/7.jpg' },
    { id: 6, name: 'Barbarian Trunk', image: 'http://playtp.igpl.pro/uploads/games/24.jpg' },
    { id: 7, name: 'Chase Racing Cars', image: 'http://playtp.igpl.pro/uploads/games/9.jpg' },
    { id: 8, name: 'Color Up', image: 'http://playtp.igpl.pro/uploads/games/3.jpg' },
    { id: 9, name: 'Gogi Adventure', image: 'http://playtp.igpl.pro/uploads/games/11.jpg' },
    { id: 10, name: 'Fruit Match', image: 'http://playtp.igpl.pro/uploads/games/13.jpg' },
    { id: 11, name: 'Moto Ride', image: 'http://playtp.igpl.pro/uploads/games/14.jpg' },
    { id: 12, name: 'Jump Ball', image: 'http://playtp.igpl.pro/uploads/games/4.jpg' },
    { id: 13, name: 'Zombie War', image: 'http://playtp.igpl.pro/uploads/games/5.jpg' },
    { id: 14, name: 'Sky Jump', image: 'http://playtp.igpl.pro/uploads/games/16.jpg' },
    { id: 15, name: 'Subway Rush', image: 'http://playtp.igpl.pro/uploads/games/28.jpg' },
    { id: 16, name: 'Run Panda Run', image: 'http://playtp.igpl.pro/uploads/games/29.jpg' },
    { id: 17, name: 'Basket Hoops', image: 'http://playtp.igpl.pro/uploads/games/19.jpg' },
    { id: 18, name: 'Fishing King', image: 'http://playtp.igpl.pro/uploads/games/113.jpg' },
];

const CreateTournament: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

    const navigate = useNavigate();

    const filteredGames = allGames.filter(game =>
        game.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container direction-rtl tiny-slider-one-wrapper p-0">
            {/* Header */}
            <div className="bg-info text-white py-2 px-3 rounded-top d-flex align-items-center"
                style={{ background: "linear-gradient(to top, #02a2c1, #00d5ff)", boxShadow: "0 2px 5px 2px rgba(1, 1, 1, 0.4)", height: "60px" }}
            >
                <i className="bi bi-arrow-left me-2" onClick={() => navigate(-1)}></i>
                <h5 className="mb-0 text-white">Create Tournament</h5>
            </div>

            {/* Step 1 */}
            <div className="p-2 border border-top-0 rounded-bottom bg-white">
                <h6 className="fw-bold">Step 1</h6>
                <p>Select game to create tournament</p>

                {/* Search Box */}
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search game for here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Game Grid */}
                <div className="row g-2">
                    {filteredGames.map((game) => (
                        <div className="col-4" key={game.id}>
                            <div
                                className={`border rounded text-center text-muted fw-semibold text-center ${selectedGameId === game.id ? 'border-primary border-2' : ''
                                    }`}
                                onClick={() => setSelectedGameId(game.id)}
                                style={{ cursor: 'pointer', background: '#f8f9fa' }}
                            >
                                <img
                                    src={game.image}
                                    alt={game.name}
                                    className="img-fluid rounded"
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className="mt-1 small">{game.name}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="btn btn-secondary w-100 mt-3"
                    disabled={!selectedGameId}
                    onClick={() => {
                        const selectedGame = allGames.find(g => g.id === selectedGameId);
                        if (selectedGame) {
                            navigate('/final-step', { state: { game: selectedGame } });
                        }
                    }}
                >
                    NEXT
                </button>

            </div>
        </div>
    );
};

export default CreateTournament;
