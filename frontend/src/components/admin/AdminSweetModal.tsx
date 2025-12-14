import React, { useState, useEffect } from 'react';
import type { Sweet } from '../../services/sweetService';

interface AdminSweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sweetToEdit?: Sweet | null; // If null, we are adding new
  onSave: (data: Omit<Sweet, 'id'> | Partial<Sweet>) => Promise<void>;
}

const CATEGORIES = ['Chocolates', 'Gummies', 'Hard Candies', 'Lollipops', 'Bars', 'Other'];

const AdminSweetModal: React.FC<AdminSweetModalProps> = ({ isOpen, onClose, sweetToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Chocolates',
    price: '',
    quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (sweetToEdit) {
        setFormData({
          name: sweetToEdit.name,
          category: sweetToEdit.category,
          price: sweetToEdit.price.toString(),
          quantity: sweetToEdit.quantity.toString()
        });
      } else {
        setFormData({
            name: '',
            category: 'Chocolates',
            price: '',
            quantity: ''
        });
      }
    }
  }, [isOpen, sweetToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
      };
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            {sweetToEdit ? 'Edit Sweet' : 'Add New Sweet'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="e.g. Dark Chocolate Delight"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="2.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                min="0"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-5 py-2.5 text-white font-medium bg-primary hover:bg-violet-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? 'Saving...' : 'Save Sweet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSweetModal;
