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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-96 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-indigo-500/50">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
          Welcome Back
        </h2>
        
        {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm text-center font-medium" role="alert">
                <span className="font-bold">Error:</span> {error}
            </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-bold text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign in
            </button>
          </div>
        </form>
         <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <span 
                onClick={() => navigate('/register')}
                className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer hover:underline transition-colors"
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
