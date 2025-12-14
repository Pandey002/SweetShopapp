import { Request, Response } from 'express';
import * as sweetModel from '../models/sweet.model';

export const getAllSweets = async (req: Request, res: Response) => {
    try {
        const sweets = await sweetModel.findAllSweets();
        res.status(200).json(sweets);
    } catch (error) {
        console.error('Error fetching sweets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createSweet = async (req: Request, res: Response) => {
    try {
        const newSweet = await sweetModel.createSweet(req.body);
        res.status(201).json(newSweet);
    } catch (error) {
        console.error('Error creating sweet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getSweetById = async (req: Request, res: Response) => {
    console.log('--- ENTERING getSweetById ---');
    console.log('Params:', req.params);
    try {
        const id = parseInt(req.params.id);
        const sweet = await sweetModel.findSweetById(id);
        if (!sweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }
        res.status(200).json(sweet);
    } catch (error) {
        console.error('Error fetching sweet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateSweet = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedSweet = await sweetModel.updateSweet(id, req.body);
        if (!updatedSweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }
        res.status(200).json(updatedSweet);
    } catch (error) {
        console.error('Error updating sweet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteSweet = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await sweetModel.deleteSweet(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting sweet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const searchSweets = async (req: Request, res: Response) => {
    console.log('--- ENTERING searchSweets ---');
    console.log('Query:', req.query);
    try {
        console.log('Search Params Received:', req.query);
        const { name, category, minPrice, maxPrice, q } = req.query;

        const filters = {
            name: (name as string) || (q as string),
            category: category as string,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined
        };

        const sweets = await sweetModel.searchSweets(filters);
        res.status(200).json(sweets);
    } catch (error) {
        console.error('Error searching sweets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const purchaseSweet = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Valid quantity required' });
        }

        const sweet = await sweetModel.findSweetById(id);
        if (!sweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }

        if (sweet.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        const updatedSweet = await sweetModel.updateSweetStock(id, -quantity);
        res.status(200).json(updatedSweet);
    } catch (error) {
        console.error('Error purchasing sweet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const restockSweet = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Valid quantity required' });
        }

        const updatedSweet = await sweetModel.updateSweetStock(id, quantity);
        if (!updatedSweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }
        res.status(200).json(updatedSweet);
    } catch (error) {
        console.error('Error restocking sweet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
