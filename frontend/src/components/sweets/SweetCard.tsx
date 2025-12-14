import React from 'react';
import type { Sweet } from '../../services/sweetService';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweet: Sweet) => void;
  isAdmin: boolean;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, onPurchase, isAdmin, onEdit, onDelete }) => {
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity < 10;

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      
      {/* Decorative Top Banner / Gradient */}
      <div className="h-32 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center relative">
         {/* Simple icon based on category or name fallback */}
         <span className="text-4xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">🍬</span>
         
         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm">
             {sweet.category}
         </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">
                {sweet.name}
            </h3>
            <span className="text-lg font-bold text-primary">
                ${Number(sweet.price).toFixed(2)}
            </span>
        </div>

        <div className="mb-4">
             <div className="flex items-center gap-2 text-sm">
                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${isOutOfStock ? 'bg-red-50 text-red-700 border-red-200' : 
                      isLowStock ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                      'bg-green-50 text-green-700 border-green-200'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                    {isOutOfStock ? 'Out of Stock' : isLowStock ? `${sweet.quantity} left` : 'In Stock'}
                 </span>
             </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
            <button
                onClick={() => onPurchase(sweet)}
                disabled={isOutOfStock}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${isOutOfStock 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-violet-700 shadow-md hover:shadow-lg active:scale-95 focus:ring-primary'
                    }`}
            >
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
            
            {/* View Details / Quick look placeholder */}
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                 </svg>
            </button>
        </div>

        {/* Admin Actions Overlay (Only visible on hover if admin) */}
        {isAdmin && (
            <div className="absolute top-2 left-2 flex flex-col gap-2 transition-opacity duration-200">
                <button 
                  onClick={() => onEdit && onEdit(sweet)}
                  className="p-2 bg-white/90 backdrop-blur text-blue-600 rounded-full shadow-lg hover:bg-blue-50 transition-colors" title="Edit">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button 
                  onClick={() => onDelete && onDelete(sweet.id)}
                  className="p-2 bg-white/90 backdrop-blur text-red-600 rounded-full shadow-lg hover:bg-red-50 transition-colors" title="Delete">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SweetCard;
