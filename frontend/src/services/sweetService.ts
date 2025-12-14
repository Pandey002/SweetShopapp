import api from './api';

export interface Sweet {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export interface SearchParams {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}

export const sweetService = {
    getAll: async () => {
        const response = await api.get<any[]>('/sweets');
        return response.data.map(s => ({
            ...s,
            price: Number(s.price),
            imageUrl: s.image_url
        })) as Sweet[];
    },

    search: async (params: SearchParams) => {
        // Convert SearchParams to a plain object for axios
        const query: Record<string, string | number> = {};
        if (params.name) query.name = params.name;
        if (params.category && params.category !== 'All') query.category = params.category;
        if (params.minPrice !== undefined) query.minPrice = params.minPrice;
        if (params.maxPrice !== undefined) query.maxPrice = params.maxPrice;

        const response = await api.get<any[]>('/sweets/search', { params: query });
        return response.data.map(s => ({
            ...s,
            price: Number(s.price),
            imageUrl: s.image_url
        })) as Sweet[];
    },

    purchase: async (id: string, quantity: number) => {
        const response = await api.post(`/sweets/${id}/purchase`, { quantity });
        const s = response.data;
        return {
            ...s,
            price: Number(s.price),
            imageUrl: s.image_url
        } as Sweet;
    },

    // Admin endpoints
    create: async (data: Omit<Sweet, 'id'>) => {
        const response = await api.post('/sweets', data);
        const s = response.data;
        return {
            ...s,
            price: Number(s.price),
            imageUrl: s.image_url
        } as Sweet;
    },

    update: async (id: string, data: Partial<Sweet>) => {
        const response = await api.put(`/sweets/${id}`, data);
        const s = response.data;
        return {
            ...s,
            price: Number(s.price),
            imageUrl: s.image_url
        } as Sweet;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/sweets/${id}`);
        return response.data;
    }
};
