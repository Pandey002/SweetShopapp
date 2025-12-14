import pool from '../config/database';

const sweets = [
    { name: 'Dark Chocolate Truffle', price: 2.50, quantity: 50, category: 'Chocolate' },
    { name: 'Gummy Bears', price: 1.20, quantity: 100, category: 'Gummies' },
    { name: 'Sour Worms', price: 1.50, quantity: 75, category: 'Gummies' },
    { name: 'Mint Hard Candy', price: 0.80, quantity: 200, category: 'Hard Candy' },
    { name: 'Caramel Fudge', price: 3.00, quantity: 40, category: 'Fudge' },
    { name: 'Lollipop Swirl', price: 0.50, quantity: 150, category: 'Hard Candy' },
    { name: 'Peanut Butter Cup', price: 1.80, quantity: 60, category: 'Chocolate' },
    { name: 'Licorice Twists', price: 2.00, quantity: 80, category: 'Licorice' }
];

const seedDatabase = async () => {
    try {
        console.log('Seeding sweets...');

        // Clear existing to avoid duplicates if run multiple times (optional, maybe safe to just insert)
        // await pool.query('DELETE FROM sweets'); 

        for (const sweet of sweets) {
            await pool.query(
                'INSERT INTO sweets (name, price, quantity, category) VALUES ($1, $2, $3, $4)',
                [sweet.name, sweet.price, sweet.quantity, sweet.category]
            );
        }

        console.log('Successfully added sample sweets!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
