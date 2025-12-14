import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: { username: string; role: string } | null;
  onLogout: () => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, searchTerm, onSearchChange }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hover:opacity-80 transition-opacity">
            Sweet Shop 🍬
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="Search for sweets..."
          />
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
               <span className="hidden sm:inline-block text-gray-700 font-medium">
                  Hello, {user.username}
               </span>
               {user.role === 'admin' && (
                   <span className="px-3 py-1 bg-purple-100 text-primary text-xs font-bold uppercase rounded-full tracking-wider">
                       Admin
                   </span>
               )}
               <button
                 onClick={onLogout}
                 className="text-gray-500 hover:text-error transition-colors px-3 py-1 rounded-lg hover:bg-gray-100"
               >
                 Logout
               </button>
            </div>
          ) : (
             <Link to="/login" className="text-primary hover:text-secondary font-medium">Login</Link>
          )}
        </div>
      </div>

       {/* Mobile Search Bar - Shows below header on small screens */}
       <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
               type="text"
               value={searchTerm}
               onChange={onSearchChange}
               className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
               placeholder="Search sweets..."
            />
          </div>
       </div>
    </header>
  );
};

export default Header;
