import pool from '../config/database';

const migrate = async () => {
    try {
        console.log('Starting migration...');
        await pool.query(`
      ALTER TABLE sweets
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(255) DEFAULT NULL;
    `);
        console.log('Successfully added image_url column to sweets table');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
