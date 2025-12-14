import api from './api';

export interface Sweet {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

export interface SearchParams {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}

export const sweetService = {
    getAll: async () => {
        const response = await api.get<Sweet[]>('/sweets');
        return response.data.map(s => ({ ...s, price: Number(s.price) }));
    },

    search: async (params: SearchParams) => {
        // Convert SearchParams to a plain object for axios
        const query: Record<string, string | number> = {};
        if (params.name) query.name = params.name;
        if (params.category && params.category !== 'All') query.category = params.category;
        if (params.minPrice !== undefined) query.minPrice = params.minPrice;
        if (params.maxPrice !== undefined) query.maxPrice = params.maxPrice;

        const response = await api.get<Sweet[]>('/sweets/search', { params: query });
        return response.data.map(s => ({ ...s, price: Number(s.price) }));
    },

    purchase: async (id: string, quantity: number) => {
        const response = await api.post(`/sweets/${id}/purchase`, { quantity });
        return { ...response.data, price: Number(response.data.price) };
    },

    // Admin endpoints
    create: async (data: Omit<Sweet, 'id'>) => {
        const response = await api.post('/sweets', data);
        return { ...response.data, price: Number(response.data.price) };
    },

    update: async (id: string, data: Partial<Sweet>) => {
        const response = await api.put(`/sweets/${id}`, data);
        return { ...response.data, price: Number(response.data.price) };
    },

    delete: async (id: string) => {
        const response = await api.delete(`/sweets/${id}`);
        return response.data;
    }
};
