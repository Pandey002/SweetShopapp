import { useState, useEffect, useCallback } from 'react';
import { sweetService } from '../services/sweetService';
import type { Sweet, SearchParams } from '../services/sweetService';
import { useDebounce } from './useDebounce';

export const useSweets = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<SearchParams>({
        category: 'All',
        minPrice: undefined,
        maxPrice: undefined,
        name: ''
    });

    const debouncedName = useDebounce(filters.name, 300);

    const fetchSweets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // If we have filters, use search, otherwise get all
            // Note: backend search endpoint might handle empty params too, but logic here is explicit
            if (debouncedName || (filters.category && filters.category !== 'All') || filters.minPrice || filters.maxPrice) {
                const data = await sweetService.search({
                    ...filters,
                    name: debouncedName
                });
                setSweets(data);
            } else {
                const data = await sweetService.getAll();
                setSweets(data);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to fetch sweets');
        } finally {
            setLoading(false);
        }
    }, [debouncedName, filters.category, filters.minPrice, filters.maxPrice]);

    useEffect(() => {
        fetchSweets();
    }, [fetchSweets]);

    const purchaseSweet = async (id: string, quantity: number) => {
        try {
            await sweetService.purchase(id, quantity);
            // Optimistic or re-fetch? Implementing optimistic update for better UX
            setSweets(prev => prev.map(sweet =>
                sweet.id === id
                    ? { ...sweet, quantity: sweet.quantity - quantity }
                    : sweet
            ));
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Purchase failed');
        }
    };

    const addSweet = async (sweetData: Omit<Sweet, 'id'>) => {
        const newSweet = await sweetService.create(sweetData);
        setSweets(prev => [...prev, newSweet]);
        return newSweet;
    };

    const updateSweet = async (id: string, sweetData: Partial<Sweet>) => {
        const updated = await sweetService.update(id, sweetData);
        setSweets(prev => prev.map(s => s.id === id ? updated : s));
        return updated;
    };

    const deleteSweet = async (id: string) => {
        await sweetService.delete(id);
        setSweets(prev => prev.filter(s => s.id !== id));
    };


    return {
        sweets,
        loading,
        error,
        filters,
        setFilters,
        purchaseSweet,
        addSweet,
        updateSweet,
        deleteSweet,
        refreshSweets: fetchSweets
    };
};
