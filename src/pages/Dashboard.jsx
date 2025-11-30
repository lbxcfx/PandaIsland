import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { CURRICULUM } from '../data/curriculum';
import { BookOpen, Crosshair, AlertTriangle, ChevronRight, LogOut, Hexagon } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout, selectCurriculum, currentSelection } = useGame();

    // Default to current selection or first unit/lesson
    const [selectedUnitId, setSelectedUnitId] = useState(currentSelection.unitId || CURRICULUM.units[0].id);
    const [selectedLessonId, setSelectedLessonId] = useState(currentSelection.lessonId || CURRICULUM.units[0].lessons[0].id);

    const currentUnit = CURRICULUM.units.find(u => u.id === selectedUnitId);

    // Update lesson selection when unit changes
    useEffect(() => {
        if (currentUnit) {
            setSelectedLessonId(currentUnit.lessons[0].id);
        }
    }, [selectedUnitId, currentUnit]);

    const handleStartMode = (mode) => {
        selectCurriculum(selectedUnitId, selectedLessonId);
        navigate(mode);
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(59, 130, 246, 0.3)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        width: '50px', height: '50px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                        boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
                    }}>🐼</div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '1px' }}>COMMANDER</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>{user?.username || 'Explorer'}</div>
                    </div>
                </div>
                <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <LogOut size={20} /> <span style={{ fontSize: '0.8rem' }}>ABORT</span>
                </button>
            </div>

            {/* Mission Control - Selection Area */}
            <div style={{ marginBottom: '40px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                {/* Unit Selection (Formerly Grade) */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h2 style={{ color: '#3b82f6', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Hexagon size={16} fill="#3b82f6" /> Unit Sector
                    </h2>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={selectedUnitId}
                            onChange={(e) => setSelectedUnitId(e.target.value)}
                            className="input-tech"
                            style={{
                                width: '100%',
                                padding: '15px',
                                appearance: 'none',
                                cursor: 'pointer',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid #3b82f6',
                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            {CURRICULUM.units.map(unit => (
                                <option key={unit.id} value={unit.id} style={{ background: '#0f172a' }}>
                                    {unit.name}
                                </option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#3b82f6' }}>
                            ▼
                        </div>
                    </div>
                </div>

                {/* Lesson Selection (Formerly Unit) */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h2 style={{ color: '#8b5cf6', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Hexagon size={16} fill="#8b5cf6" /> Lesson Module
                    </h2>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={selectedLessonId}
                            onChange={(e) => setSelectedLessonId(e.target.value)}
                            className="input-tech"
                            style={{
                                width: '100%',
                                padding: '15px',
                                appearance: 'none',
                                cursor: 'pointer',
                                background: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid #8b5cf6',
                                boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            {currentUnit?.lessons.map(lesson => (
                                <option key={lesson.id} value={lesson.id} style={{ background: '#0f172a' }}>
                                    {lesson.name}
                                </option>
                            ))}
                        </select>
                        <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8b5cf6' }}>
                            ▼
                        </div>
                    </div>
                </div>

            </div>

            {/* Mode Selection */}
            <div style={{ flex: 1 }}>
                <h2 style={{ color: '#10b981', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Hexagon size={16} fill="#10b981" /> Initiate Protocol
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

                    {/* Practice Mode */}
                    <div className="card-tech" onClick={() => handleStartMode('/practice')} style={{ padding: '25px', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderLeft: '4px solid var(--color-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: 'white' }}>TRAINING</h3>
                                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Acquire new data.</p>
                            </div>
                            <BookOpen size={32} color="var(--color-primary)" />
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>
                            START SIMULATION <ChevronRight size={16} />
                        </div>
                    </div>

                    {/* Test Mode */}
                    <div className="card-tech" onClick={() => handleStartMode('/test')} style={{ padding: '25px', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderLeft: '4px solid var(--color-accent)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: 'white' }}>COMBAT</h3>
                                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Test your skills.</p>
                            </div>
                            <Crosshair size={32} color="var(--color-accent)" />
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>
                            ENGAGE TARGETS <ChevronRight size={16} />
                        </div>
                    </div>

                    {/* Mistakes Book */}
                    <div className="card-tech" onClick={() => handleStartMode('/mistakes')} style={{ padding: '25px', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderLeft: '4px solid var(--color-error)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: 'white' }}>ARCHIVES</h3>
                                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Review system errors.</p>
                            </div>
                            <AlertTriangle size={32} color="var(--color-error)" />
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', color: 'var(--color-error)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>
                            ACCESS LOGS <ChevronRight size={16} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
