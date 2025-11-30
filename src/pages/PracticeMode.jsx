import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Mic, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { useGame } from '../context/GameContext';
import { CURRICULUM } from '../data/curriculum';

const PracticeMode = () => {
    const navigate = useNavigate();
    const { currentSelection, unlockCard, addXP, selectCurriculum } = useGame();
    const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [feedback, setFeedback] = useState(null);

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

    const playAudio = () => {
        if (!currentWord) return;
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (transcript && currentWord) {
            const cleanTranscript = transcript.toLowerCase().trim();
            const targetWord = currentWord.word.toLowerCase();

            if (cleanTranscript.includes(targetWord)) {
                setFeedback('correct');
                unlockCard(currentWord.id);
                addXP(20);
                const successAudio = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');
                successAudio.play().catch(e => { });
            } else {
                setFeedback('incorrect');
            }

            const timer = setTimeout(() => {
                setTranscript('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [transcript, currentWord]);

    const handleNext = () => {
        setFeedback(null);
        setTranscript('');
        setIsFlipped(false);
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        setFeedback(null);
        setTranscript('');
        setIsFlipped(false);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleNextLesson = () => {
        const currentUnitIndex = CURRICULUM.units.findIndex(u => u.id === unit.id);
        const currentLessonIndex = unit.lessons.findIndex(l => l.id === lesson.id);

        let nextUnitId = unit.id;
        let nextLessonId = null;

        if (currentLessonIndex < unit.lessons.length - 1) {
            // Next lesson in same unit
            nextLessonId = unit.lessons[currentLessonIndex + 1].id;
        } else if (currentUnitIndex < CURRICULUM.units.length - 1) {
            // First lesson of next unit
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
    };

    if (!currentWord) return null;

    return (
        <div style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                    <ArrowLeft size={32} />
                </button>
                <h1 style={{ marginLeft: '20px', fontSize: '1.5rem', margin: 0 }}>Practice: {lesson.name}</h1>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>

                {/* Prev Arrow */}
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentIndex === 0 ? 0.3 : 1,
                        color: 'white'
                    }}
                >
                    <ChevronLeft size={32} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Flashcard */}
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
                                    textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
                                }}>
                                    {currentWord.image}
                                </div>
                                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'white', textShadow: '0 0 10px rgba(0,0,0,0.5)', textAlign: 'center', wordBreak: 'break-word' }}>{currentWord.translation}</h2>
                            </div>

                            {/* Back - Image + English + Phonetic */}
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
                                <p style={{ fontSize: '1.5rem', color: '#94a3b8', marginTop: '10px', fontFamily: 'monospace', textAlign: 'center' }}>{currentWord.phonetic}</p>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); playAudio(); }}
                            className="btn-tech"
                            style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary)' }}
                        >
                            <Volume2 size={32} />
                        </button>

                        <button
                            onMouseDown={startListening}
                            onMouseUp={stopListening}
                            onTouchStart={startListening}
                            onTouchEnd={stopListening}
                            className={isListening ? 'animate-glow' : ''}
                            style={{
                                borderRadius: '50%',
                                width: '80px',
                                height: '80px',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isListening ? 'var(--color-error)' : 'var(--color-success)',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                            }}
                        >
                            <Mic size={40} />
                        </button>
                    </div>

                    {/* Feedback */}
                    <div style={{ height: '40px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {feedback === 'correct' && (
                            <div style={{ color: 'var(--color-success)', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Check size={32} /> Excellent!
                            </div>
                        )}
                        {feedback === 'incorrect' && (
                            <div style={{ color: 'var(--color-error)', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <X size={32} /> Try Again
                            </div>
                        )}
                        {transcript && !feedback && (
                            <div style={{ color: '#94a3b8' }}>Listening: "{transcript}"</div>
                        )}
                    </div>
                </div>

                {/* Next Arrow */}
                <button
                    onClick={handleNext}
                    disabled={currentIndex === words.length - 1}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: currentIndex === words.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentIndex === words.length - 1 ? 0.3 : 1,
                        color: 'white'
                    }}
                >
                    <ChevronRight size={32} />
                </button>

            </div>

            {/* Next Lesson Shortcut */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={handleNextLesson}
                    className="btn-tech"
                    style={{
                        padding: '10px 20px',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid #3b82f6',
                        color: '#3b82f6'
                    }}
                >
                    NEXT MISSION <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default PracticeMode;
