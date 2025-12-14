import React, { useState, useEffect } from 'react';
import type { Sweet } from '../../services/sweetService';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  sweet: Sweet | null;
  onConfirm: (id: string, quantity: number) => Promise<void>;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, sweet, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

  if (!isOpen || !sweet) return null;

  const totalPrice = (Number(sweet.price) * quantity).toFixed(2);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(sweet.id, quantity);
      onClose(); // Close on success
    } catch (error) {
      // Error handled by parent toast generally, but we stop loading here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            Confirm Purchase
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
              🍬
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">{sweet.name}</h4>
              <p className="text-sm text-gray-500">{sweet.category}</p>
              <p className="text-primary font-bold mt-1">${Number(sweet.price).toFixed(2)} each</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= sweet.quantity) {
                        setQuantity(val);
                    }
                }}
                className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                min="1"
                max={sweet.quantity}
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                disabled={quantity >= sweet.quantity}
              >
                +
              </button>
            </div>
             <p className="text-xs text-gray-500 mt-2">
                {sweet.quantity} items available in stock
            </p>
          </div>

          <div className="flex justify-between items-center py-4 border-t border-gray-100">
             <span className="text-gray-600 font-medium">Total Price</span>
             <span className="text-2xl font-bold text-gray-900">${totalPrice}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-2.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 px-5 py-2.5 text-white font-medium bg-primary hover:bg-violet-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : 'Confirm Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
