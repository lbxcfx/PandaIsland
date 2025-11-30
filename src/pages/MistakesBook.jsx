import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CURRICULUM } from '../data/curriculum';

const MistakesBook = () => {
    const navigate = useNavigate();
    const { mistakes, removeMistake } = useGame();

    return (
        <div style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                    <ArrowLeft size={32} />
                </button>
                <h1 style={{ marginLeft: '20px', fontSize: '1.5rem', margin: 0 }}>Error Log</h1>
            </div>

            {mistakes.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#94a3b8' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✨</div>
                    <h2>No errors recorded. Perfect operation!</h2>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {mistakes.map((mistake, index) => {
                        const unit = CURRICULUM.units.find(u => u.id === mistake.unitId);
                        const lesson = unit?.lessons.find(l => l.id === mistake.lessonId);

                        return (
                            <div key={`${mistake.id}-${index}`} className="card-tech" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ fontSize: '3rem' }}>{mistake.image}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-error)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                        {unit?.name} • {lesson?.name}
                                    </div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{mistake.word}</div>
                                    <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{mistake.phonetic}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button
                                        onClick={() => removeMistake(mistake.id)}
                                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '10px', color: '#94a3b8', cursor: 'pointer' }}
                                        title="Mark as Resolved"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MistakesBook;
