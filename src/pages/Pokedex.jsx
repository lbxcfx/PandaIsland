import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { useGame } from '../context/GameContext';

const ALL_CARDS = [
    { id: 'tiger', word: 'Tiger', image: '🐯', color: '#FFB347' },
    { id: 'apple', word: 'Apple', image: '🍎', color: '#FF6B6B' },
    { id: 'banana', word: 'Banana', image: '🍌', color: '#FFE66D' },
    { id: 'monkey', word: 'Monkey', image: '🐵', color: '#8D6E63' },
];

const Pokedex = () => {
    const navigate = useNavigate();
    const { collection, userProgress } = useGame();

    return (
        <div style={{ minHeight: '100vh', padding: '20px', background: '#F0F4F8' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={32} color="#333" />
                </button>
                <h1 style={{ marginLeft: '20px', fontSize: '1.5rem' }}>My Collection</h1>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>COLLECTED</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{collection.length} / {ALL_CARDS.length}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>TOTAL XP</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{userProgress.xp}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
                {ALL_CARDS.map(card => {
                    const isUnlocked = collection.includes(card.id);
                    return (
                        <div
                            key={card.id}
                            className="card"
                            style={{
                                aspectRatio: '3/4',
                                position: 'relative',
                                opacity: isUnlocked ? 1 : 0.7,
                                filter: isUnlocked ? 'none' : 'grayscale(100%)',
                                background: isUnlocked ? card.color : '#ddd',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            {!isUnlocked && (
                                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                    <Lock size={20} color="#666" />
                                </div>
                            )}

                            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>
                                {isUnlocked ? card.image : '?'}
                            </div>
                            <div style={{ fontWeight: 'bold', color: isUnlocked ? 'white' : '#666' }}>
                                {isUnlocked ? card.word : 'Locked'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Pokedex;
