import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { User, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useGame();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username && password) {
            login(username);
            navigate('/dashboard');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
            padding: '20px'
        }}>
            <div className="card-tech" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
            }}>
                {/* Logo Area */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                    marginBottom: '10px'
                }}>
                    🐼
                </div>

                <h1 style={{
                    margin: 0,
                    fontSize: '2rem',
                    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '800'
                }}>
                    PandaWord
                </h1>
                <h2 style={{ margin: '-10px 0 20px 0', fontSize: '1.2rem', color: '#94a3b8', letterSpacing: '2px' }}>ISLAND</h2>

                <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={20} color="#94a3b8" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            className="input-tech"
                            placeholder="Username"
                            style={{ paddingLeft: '45px' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} color="#94a3b8" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="password"
                            className="input-tech"
                            placeholder="Password"
                            style={{ paddingLeft: '45px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-tech" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        Enter World <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
