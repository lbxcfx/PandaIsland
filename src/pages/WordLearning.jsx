import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Mic, Check, X } from 'lucide-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { useGame } from '../context/GameContext';

const WORDS = [
    { id: 'tiger', word: 'Tiger', phonetic: '/ˈtaɪ.ɡər/', image: '🐯', color: '#FFB347' },
    { id: 'apple', word: 'Apple', phonetic: '/ˈæp.əl/', image: '🍎', color: '#FF6B6B' },
    { id: 'banana', word: 'Banana', phonetic: '/bəˈnæn.ə/', image: '🍌', color: '#FFE66D' },
    { id: 'monkey', word: 'Monkey', phonetic: '/ˈmʌŋ.ki/', image: '🐵', color: '#8D6E63' },
];

const WordLearning = () => {
    const navigate = useNavigate();
    const { unlockCard, addXP } = useGame();
    const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', null

    const currentWord = WORDS[currentIndex];

    const playAudio = () => {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (transcript) {
            const cleanTranscript = transcript.toLowerCase().trim();
            const targetWord = currentWord.word.toLowerCase();

            if (cleanTranscript.includes(targetWord)) {
                setFeedback('correct');
                unlockCard(currentWord.id);
                addXP(20);
                const successAudio = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'); // Fallback sound
                successAudio.play().catch(e => console.log("Audio play failed", e));
            } else {
                setFeedback('incorrect');
            }

            // Reset transcript after processing
            const timer = setTimeout(() => {
                setTranscript('');
                if (cleanTranscript.includes(targetWord)) {
                    // Auto advance or wait for user? Let's wait for user to click next or just show success
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [transcript, currentWord]);

    const handleNext = () => {
        setFeedback(null);
        setTranscript('');
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % WORDS.length);
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px', background: '#F0F4F8', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={32} color="#333" />
                </button>
                <h1 style={{ marginLeft: '20px', fontSize: '1.5rem' }}>Magic Cards</h1>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* Flashcard */}
                <div
                    className="card"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{
                        width: '300px',
                        height: '400px',
                        position: 'relative',
                        perspective: '1000px',
                        cursor: 'pointer',
                        marginBottom: '40px'
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
                        {/* Front */}
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            background: currentWord.color,
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '8rem',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}>
                            {currentWord.image}
                        </div>

                        {/* Back */}
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            background: 'white',
                            borderRadius: '24px',
                            transform: 'rotateY(180deg)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ fontSize: '6rem', marginBottom: '10px' }}>{currentWord.image}</div>
                            <h2 style={{ fontSize: '3rem', margin: 0, color: '#333' }}>{currentWord.word}</h2>
                            <p style={{ fontSize: '1.5rem', color: '#888', marginTop: '5px', fontFamily: 'monospace' }}>{currentWord.phonetic}</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); playAudio(); }}
                        style={{
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#FF6B6B',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 4px 0 #D64545',
                            cursor: 'pointer',
                            transition: 'transform 0.1s'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(4px)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
                            background: isListening ? '#FF6B6B' : '#4ECDC4',
                            color: 'white',
                            border: 'none',
                            boxShadow: isListening ? '0 4px 0 #D64545' : '0 4px 0 #2B9E96',
                            cursor: 'pointer',
                            transition: 'transform 0.1s'
                        }}
                    >
                        <Mic size={40} />
                    </button>
                </div>

                {/* Feedback */}
                <div style={{ height: '60px', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {feedback === 'correct' && (
                        <div style={{ color: '#4ECDC4', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Check size={32} /> Excellent!
                        </div>
                    )}
                    {feedback === 'incorrect' && (
                        <div style={{ color: '#FF6B6B', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <X size={32} /> Try Again
                        </div>
                    )}
                    {transcript && !feedback && (
                        <div style={{ color: '#666' }}>Listening: "{transcript}"</div>
                    )}
                </div>

                {feedback === 'correct' && (
                    <button className="btn-primary" onClick={handleNext} style={{ marginTop: '20px' }}>
                        Next Card
                    </button>
                )}

            </div>
        </div>
    );
};

export default WordLearning;
