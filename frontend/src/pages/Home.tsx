import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none"></div> 
      {/* Note: bg-pattern is a placeholder, strictly relying on gradients as per request for now */}
      
      <div className="z-10 p-12 text-center bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-w-2xl mx-4 transform transition-all hover:scale-105 duration-500">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
          Welcome to the <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Sweet Shop
          </span>
        </h1>
        
        <p className="mb-10 text-xl text-indigo-100 leading-relaxed font-light">
          Your premium dashboard for managing the most delicious treats in town. 
          <br/>Explore, manage, and enjoy!
        </p>

        <button
          onClick={handleLogout}
          className="px-8 py-3 text-lg font-bold text-indigo-600 bg-white rounded-full shadow-lg hover:bg-indigo-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Logout
        </button>
      </div>
      
      <div className="mt-8 text-indigo-200 text-sm opacity-80">
        © 2025 Sweet Shop Management System
      </div>
    </div>
  );
};

export default Home;
