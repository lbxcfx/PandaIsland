import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, ChevronRight, AlertCircle } from 'lucide-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { useGame } from '../context/GameContext';
import { CURRICULUM } from '../data/curriculum';

const TestMode = () => {
    const navigate = useNavigate();
    const { currentSelection, addXP, addMistake, selectCurriculum } = useGame();
    const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'

    // Get words based on selection
    const unit = CURRICULUM.units.find(u => u.id === currentSelection.unitId);
    const lesson = unit?.lessons.find(l => l.id === currentSelection.lessonId);
    const words = lesson?.words || [];
    const currentWord = words[currentIndex];

    useEffect(() => {
        if (!currentWord) {
            navigate('/dashboard');
        }
    }, [currentWord, navigate]);

    useEffect(() => {
        if (transcript && currentWord) {
            const cleanTranscript = transcript.toLowerCase().trim();
            const targetWord = currentWord.word.toLowerCase();

            if (cleanTranscript.includes(targetWord)) {
                setFeedback('correct');
                addXP(50); // Higher XP for test mode
                const successAudio = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');
                successAudio.play().catch(e => { });

                // Auto flip to show answer if not already flipped
                setIsFlipped(true);

                // Auto advance after short delay
                setTimeout(() => {
                    handleNext(true);
                }, 1500);

            } else {
                setFeedback('incorrect');
            }

            const timer = setTimeout(() => {
                setTranscript('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [transcript, currentWord]);

    const handleNext = (success = false) => {
        setFeedback(null);
        setTranscript('');
        setIsFlipped(false);

        if (!success) {
            // If manually skipping or failed, add to mistakes
            addMistake(currentWord, currentSelection.unitId, currentSelection.lessonId);
        }

        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of test
            alert("Test Complete!");
            navigate('/dashboard');
        }
    };

    if (!currentWord) return null;

    return (
        <div style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                    <ArrowLeft size={32} />
                </button>
                <h1 style={{ marginLeft: '20px', fontSize: '1.5rem', margin: 0 }}>Test: {lesson.name}</h1>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Test Card - Flippable */}
                    <div
                        className="card-tech"
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{
                            width: '300px',
                            height: '400px',
                            position: 'relative',
                            perspective: '1000px',
                            cursor: 'pointer',
                            marginBottom: '40px',
                            border: feedback === 'correct' ? '2px solid var(--color-success)' : feedback === 'incorrect' ? '2px solid var(--color-error)' : '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}>
                            {/* Front - Image + Chinese */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                background: 'rgba(30, 41, 59, 0.9)',
                                borderRadius: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                boxSizing: 'border-box'
                            }}>
                                <div style={{
                                    fontSize: '8rem',
                                    marginBottom: '20px',
                                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                                    textShadow: '0 0 30px rgba(239, 68, 68, 0.5)'
                                }}>
                                    {currentWord.image}
                                </div>
                                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'white', textShadow: '0 0 10px rgba(0,0,0,0.5)', textAlign: 'center', wordBreak: 'break-word' }}>{currentWord.translation}</h2>
                                <p style={{ marginTop: '30px', color: '#94a3b8', fontSize: '1rem', letterSpacing: '1px' }}>(TAP TO REVEAL)</p>
                            </div>

                            {/* Back - English */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                background: 'rgba(30, 41, 59, 0.9)',
                                borderRadius: '24px',
                                transform: 'rotateY(180deg)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                boxSizing: 'border-box'
                            }}>
                                <div style={{
                                    fontSize: '6rem',
                                    marginBottom: '10px',
                                    filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.3))'
                                }}>
                                    {currentWord.image}
                                </div>
                                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'white', fontWeight: 'bold', textAlign: 'center', wordBreak: 'break-word' }}>{currentWord.word}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Controls - Only Mic */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <button
                            onMouseDown={startListening}
                            onMouseUp={stopListening}
                            onTouchStart={startListening}
                            onTouchEnd={stopListening}
                            className={isListening ? 'animate-glow' : ''}
                            style={{
                                borderRadius: '50%',
                                width: '100px',
                                height: '100px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isListening ? 'var(--color-error)' : 'var(--color-accent)',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'white',
                                boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
                            }}
                        >
                            <Mic size={50} />
                        </button>
                    </div>

                    {/* Feedback */}
                    <div style={{ height: '40px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {feedback === 'correct' && (
                            <div style={{ color: 'var(--color-success)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                Correct! Next...
                            </div>
                        )}
                        {feedback === 'incorrect' && (
                            <div style={{ color: 'var(--color-error)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                Try Again
                            </div>
                        )}
                        {transcript && !feedback && (
                            <div style={{ color: '#94a3b8' }}>Listening: "{transcript}"</div>
                        )}
                    </div>
                </div>

                {/* Skip/Next Arrow */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={() => handleNext(false)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.2s'
                        }}
                        title="Skip (Mark as Mistake)"
                    >
                        <ChevronRight size={32} />
                    </button>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SKIP</span>
                </div>

            </div>

            {/* Next Lesson Shortcut */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={() => {
                        const currentUnitIndex = CURRICULUM.units.findIndex(u => u.id === unit.id);
                        const currentLessonIndex = unit.lessons.findIndex(l => l.id === lesson.id);

                        let nextUnitId = unit.id;
                        let nextLessonId = null;

                        if (currentLessonIndex < unit.lessons.length - 1) {
                            nextLessonId = unit.lessons[currentLessonIndex + 1].id;
                        } else if (currentUnitIndex < CURRICULUM.units.length - 1) {
                            const nextUnit = CURRICULUM.units[currentUnitIndex + 1];
                            nextUnitId = nextUnit.id;
                            nextLessonId = nextUnit.lessons[0].id;
                        }

                        if (nextLessonId) {
                            selectCurriculum(nextUnitId, nextLessonId);
                            setCurrentIndex(0);
                            setIsFlipped(false);
                            setFeedback(null);
                            setTranscript('');
                        } else {
                            alert("All missions complete! Return to base.");
                            navigate('/dashboard');
                        }
                    }}
                    className="btn-tech"
                    style={{
                        padding: '10px 20px',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #ef4444',
                        color: '#ef4444'
                    }}
                >
                    NEXT COMBAT <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default TestMode;
