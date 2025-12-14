import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { isAxiosError } from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const data = await login({ username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Save user info
      navigate('/');
    } catch (err: unknown) {
        if (isAxiosError(err)) {
            console.error("Login failed", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Invalid username or password');
        } else {
             console.error("Login failed", err);
             setError('An unexpected error occurred');
        }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
      <div className="w-96 p-8 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-white drop-shadow-md">
          Welcome Back
        </h2>
        
        {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center font-medium" role="alert">
                <span className="font-bold">Error:</span> {error}
            </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-bold text-white drop-shadow-sm">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 leading-tight text-white bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/50 placeholder-white/70 transition-all duration-200 backdrop-blur-md"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-bold text-white drop-shadow-sm">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 leading-tight text-white bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/50 placeholder-white/70 transition-all duration-200 backdrop-blur-md"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-indigo-900 uppercase tracking-wider bg-white/80 hover:bg-white rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-md"
            >
              Sign in
            </button>
          </div>
        </form>
         <div className="text-center mt-4">
            <p className="text-sm text-white/90">
              Don't have an account?{' '}
              <span 
                onClick={() => navigate('/register')}
                className="font-bold text-white hover:text-white/80 cursor-pointer hover:underline transition-colors"
                role="button"
                tabIndex={0}
              >
                Register
              </span>
            </p>
          </div>
      </div>
    </div>
  );
};

export default Login;
