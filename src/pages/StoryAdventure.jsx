import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Volume2 } from 'lucide-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { useGame } from '../context/GameContext';

const STORY_SCENES = [
    {
        id: 1,
        npc: 'Monkey',
        npcImage: '🐵',
        text: 'I am lost. I want a banana.',
        translation: '我迷路了。我想要一个香蕉。',
        options: [
            { id: 'opt1', text: 'Here is a banana.', correct: true },
            { id: 'opt2', text: 'Here is an apple.', correct: false }
        ]
    },
    {
        id: 2,
        npc: 'Monkey',
        npcImage: '🐵',
        text: 'Thank you! You are my friend.',
        translation: '谢谢！你是我的朋友。',
        options: [
            { id: 'opt1', text: 'You are welcome.', correct: true },
            { id: 'opt2', text: 'Goodbye.', correct: false }
        ]
    }
];

const StoryAdventure = () => {
    const navigate = useNavigate();
    const { addXP } = useGame();
    const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();

    const [sceneIndex, setSceneIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const currentScene = STORY_SCENES[sceneIndex];

    const playAudio = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        // Auto play NPC dialogue on scene enter
        playAudio(currentScene.text);
    }, [currentScene]);

    useEffect(() => {
        if (transcript && selectedOption) {
            const cleanTranscript = transcript.toLowerCase().trim();
            const targetText = selectedOption.text.toLowerCase().replace('.', ''); // Remove punctuation for easier matching

            // Simple fuzzy match check
            if (cleanTranscript.includes(targetText) || cleanTranscript.length > 3 && targetText.includes(cleanTranscript)) {
                if (selectedOption.correct) {
                    setFeedback('correct');
                    addXP(50);
                    const successAudio = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');
                    successAudio.play().catch(e => { });
                } else {
                    setFeedback('incorrect');
                }
            } else {
                // If speech doesn't match selected option at all
                // Maybe give a hint or just wait?
            }
        }
    }, [transcript, selectedOption]);

    const handleNextScene = () => {
        if (sceneIndex < STORY_SCENES.length - 1) {
            setSceneIndex(prev => prev + 1);
            setSelectedOption(null);
            setFeedback(null);
            setTranscript('');
        } else {
            // End of demo story
            alert("Story Complete! You earned a badge!");
            navigate('/');
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px', background: '#FFF3E0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={32} color="#333" />
                </button>
                <h1 style={{ marginLeft: '20px', fontSize: '1.5rem' }}>Adventure</h1>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* NPC Area */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '6rem', marginBottom: '10px' }} className="animate-float">
                        {currentScene.npcImage}
                    </div>
                    <div className="card" style={{ padding: '20px', maxWidth: '80%', margin: '0 auto', position: 'relative' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>{currentScene.text}</p>
                        <p style={{ color: '#666', margin: 0 }}>{currentScene.translation}</p>
                        <button
                            onClick={() => playAudio(currentScene.text)}
                            style={{ position: 'absolute', right: '-20px', top: '-20px', background: '#4ECDC4', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: 'white' }}
                        >
                            <Volume2 size={20} />
                        </button>
                    </div>
                </div>

                {/* User Interaction Area */}
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <h3 style={{ textAlign: 'center', color: '#666' }}>Choose what to say:</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {currentScene.options.map(option => (
                            <div
                                key={option.id}
                                onClick={() => !feedback && setSelectedOption(option)}
                                style={{
                                    padding: '20px',
                                    background: selectedOption?.id === option.id ? '#E0F7FA' : 'white',
                                    border: selectedOption?.id === option.id ? '2px solid #4ECDC4' : '2px solid transparent',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: feedback && selectedOption?.id !== option.id ? 0.5 : 1
                                }}
                                className="card"
                            >
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{option.text}</div>
                            </div>
                        ))}
                    </div>

                    {/* Speech Controls */}
                    {selectedOption && !feedback && (
                        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p>Hold mic and say: <strong>"{selectedOption.text}"</strong></p>
                            <button
                                onMouseDown={startListening}
                                onMouseUp={stopListening}
                                onTouchStart={startListening}
                                onTouchEnd={stopListening}
                                className={`btn-primary ${isListening ? 'animate-glow' : ''}`}
                                style={{
                                    borderRadius: '50%',
                                    width: '80px',
                                    height: '80px',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isListening ? '#FF6B6B' : '#4ECDC4'
                                }}
                            >
                                <Mic size={40} />
                            </button>
                            {transcript && <p style={{ marginTop: '10px', color: '#666' }}>Listening: "{transcript}"</p>}
                        </div>
                    )}

                    {/* Feedback & Result */}
                    {feedback === 'correct' && (
                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <div style={{ color: '#4ECDC4', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
                                🎉 Great Job!
                            </div>
                            <button className="btn-primary" onClick={handleNextScene}>
                                Continue
                            </button>
                        </div>
                    )}

                    {feedback === 'incorrect' && (
                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <div style={{ color: '#FF6B6B', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
                                🤔 Not quite right. Try again!
                            </div>
                            <button className="btn-primary" onClick={() => { setFeedback(null); setTranscript(''); }} style={{ background: '#666' }}>
                                Retry
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default StoryAdventure;
