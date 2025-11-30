import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Map, BookOpen, User } from 'lucide-react';

const IslandHome = () => {
    const navigate = useNavigate();
    const { pet, userProgress } = useGame();

    return (
        <div className="island-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #87CEEB 0%, #E0F7FA 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px'
        }}>
            {/* Header / HUD */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 20px',
                zIndex: 10
            }}>
                <div className="card" style={{ padding: '10px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {userProgress.level}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>LEVEL</div>
                        <div style={{ fontWeight: 'bold' }}>Explorer</div>
                    </div>
                </div>

                <div className="card" style={{ padding: '10px 20px' }}>
                    <span role="img" aria-label="coin">🪙</span> {userProgress.coins}
                </div>
            </div>

            {/* Main Content - The Island & Pet */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '600px' }}>

                {/* Pet Display */}
                <div className="animate-float" style={{ marginBottom: '40px', textAlign: 'center' }}>
                    {/* Placeholder for Pet Image */}
                    <div style={{
                        width: '200px',
                        height: '200px',
                        background: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 50px rgba(255,255,255,0.5)',
                        border: '5px solid white'
                    }}>
                        <span style={{ fontSize: '5rem' }}>🐼</span>
                    </div>
                    <h2 style={{ marginTop: '20px', color: '#333', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                        {pet.name}
                    </h2>
                </div>

                {/* Navigation Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/learn')}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '30px' }}
                    >
                        <BookOpen size={40} />
                        Magic Cards
                    </button>

                    <button
                        className="btn-primary"
                        onClick={() => navigate('/story')}
                        style={{ background: '#4ECDC4', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '30px' }}
                    >
                        <Map size={40} />
                        Adventure
                    </button>
                </div>

                <button
                    className="card"
                    onClick={() => navigate('/pokedex')}
                    style={{ marginTop: '20px', width: '100%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: 'none', cursor: 'pointer' }}
                >
                    <User size={24} />
                    My Collection
                </button>

            </div>
        </div>
    );
};

export default IslandHome;
