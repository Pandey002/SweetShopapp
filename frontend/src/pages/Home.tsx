import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSweets } from '../hooks/useSweets';
import Header from '../components/common/Header';
import FilterSidebar from '../components/sweets/FilterSidebar';
import SweetCard from '../components/sweets/SweetCard';
import PurchaseModal from '../components/sweets/PurchaseModal';
import AdminSweetModal from '../components/admin/AdminSweetModal';
import { ToastProvider, useToast } from '../components/common/Toast';
import type { Sweet } from '../services/sweetService';

// Wrapper component to provide Toast Context
const Home = () => {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
};

const HomeContent = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { 
    sweets, 
    loading, 
    error, 
    filters, 
    setFilters, 
    purchaseSweet,
    addSweet,
    updateSweet,
    deleteSweet,
    refreshSweets 
  } = useSweets();

  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState(filters.name || '');

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, name: searchQuery }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, setFilters]);

  // Sync Search Query if filters change externally (e.g. clear button)
  useEffect(() => {
    if (filters.name !== searchQuery) {
      setSearchQuery(filters.name || '');
    }
  }, [filters.name]);

  // Modal States
  const [purchaseModal, setPurchaseModal] = useState<{ isOpen: boolean; sweet: Sweet | null }>({
    isOpen: false,
    sweet: null
  });
  
  const [adminModal, setAdminModal] = useState<{ isOpen: boolean; sweet: Sweet | null }>({
    isOpen: false,
    sweet: null
  });

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Retrieve user info from login or future /me endpoint
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse user", e);
             // Optionally logout if corrupt
        }
    }
    
    // In a real app we might validate token validity with backend here
  }, [navigate]);

  // Handle Search Input from Header
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Purchase Handlers
  const openPurchaseModal = (sweet: Sweet) => {
    setPurchaseModal({ isOpen: true, sweet });
  };

  const handlePurchaseConfirm = async (id: string, quantity: number) => {
      try {
          await purchaseSweet(id, quantity);
          addToast(`Successfully purchased ${quantity} items!`, 'success');
          // No manual close needed as modal calls it
      } catch (err: any) {
          addToast(err.message || 'Purchase failed', 'error');
          throw err; // Re-throw to let modal know it failed
      }
  };

  // Admin Handlers
  const handleAdminSave = async (data: any) => {
      try {
          if (adminModal.sweet) {
              await updateSweet(adminModal.sweet.id, data);
              addToast('Sweet updated successfully', 'success');
          } else {
              await addSweet(data);
              addToast('Sweet created successfully', 'success');
          }
      } catch (err: any) {
           addToast(err.message || 'Operation failed', 'error');
           throw err;
      }
  };

  const handleDelete = async (id: string) => {
      try {
          await deleteSweet(id);
          addToast('Sweet deleted successfully', 'success');
      } catch (err: any) {
          addToast(err.message || 'Delete failed', 'error');
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header 
        user={user} 
        onLogout={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }}
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className="pt-24 pb-12 container mx-auto px-4 max-w-7xl">
        {error && (
             <div className="mb-6 mx-auto max-w-lg p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg text-center font-medium animate-fadeIn">
                {error}
                <button 
                  onClick={refreshSweets}
                  className="ml-4 underline hover:text-red-800"
                >
                  Retry
                </button>
            </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0 animate-slideIn">
                <FilterSidebar 
                   filters={filters} 
                   setFilters={setFilters} 
                   totalResults={sweets.length}
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Our Collection
                    </h1>
                     {user?.role === 'admin' && (
                        <button
                           onClick={() => setAdminModal({ isOpen: true, sweet: null })}
                           className="px-4 py-2 bg-gradient-to-r from-success to-emerald-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm font-bold flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Sweet
                        </button>
                     )}
                </div>

                {loading && sweets.length === 0 ? (
                    // Initial Loading Skeletons
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-4 h-64 animate-pulse">
                                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                ) : sweets.length === 0 && !loading ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🍪</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No sweets found</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-sm">
                            We couldn't find any sweets matching your current filters. Try adjusting your search or categories.
                        </p>
                        <button 
                           onClick={() => setFilters({ category: 'All', name: '' })}
                           className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    // Sweets Grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
                        {sweets.map(sweet => (
                            <SweetCard 
                                key={sweet.id} 
                                sweet={sweet} 
                                onPurchase={openPurchaseModal}
                                isAdmin={user?.role === 'admin'}
                                onEdit={(s) => setAdminModal({ isOpen: true, sweet: s })}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
      </div>

      {/* Modals */}
      <PurchaseModal 
          isOpen={purchaseModal.isOpen}
          onClose={() => setPurchaseModal({ ...purchaseModal, isOpen: false })}
          sweet={purchaseModal.sweet}
          onConfirm={handlePurchaseConfirm}
      />

      <AdminSweetModal
          isOpen={adminModal.isOpen}
          onClose={() => setAdminModal({ isOpen: false, sweet: null })}
          sweetToEdit={adminModal.sweet}
          onSave={handleAdminSave}
      />
    </div>
  );
};

export default Home;
