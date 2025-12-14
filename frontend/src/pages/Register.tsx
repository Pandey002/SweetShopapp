import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { isAxiosError } from 'axios';


const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    try {
      await api.post('/auth/register', { username, password });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error('Registration failed:', error);
        const msg = error.response?.data?.message || 'Registration failed. Please try again.';
        setMessage(msg);
      } else {
        console.error('Registration failed:', error);
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-96 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-indigo-500/50">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
          Create Account
        </h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
            message.includes('successful') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 leading-tight text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full px-4 py-3 font-bold text-white uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200"
            type="submit"
          >
            Sign Up
          </button>
          
          <div className="text-center mt-4">
             <p className="text-sm text-gray-600">
               Already have an account?{' '}
               <span 
                 onClick={() => navigate('/login')}
                 className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer hover:underline transition-colors"
               >
                 Log In
               </span>
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
