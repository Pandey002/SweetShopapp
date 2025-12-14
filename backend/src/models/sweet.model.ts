import pool from '../config/database';

export interface ISweet {
  id: number;
  name: string;
  price: number | string;
  quantity: number;
  category: string;
}

export const createSweetTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS sweets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      category VARCHAR(50) NOT NULL
    );
  `;
  try {
    await pool.query(query);
    console.log('Sweets table created successfully');
  } catch (error) {
    console.error('Error creating sweets table:', error);
  }
};

export const createSweet = async (sweet: Omit<ISweet, 'id'>): Promise<ISweet> => {
  const { name, price, quantity, category } = sweet;
  const result = await pool.query(
    'INSERT INTO sweets (name, price, quantity, category) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, price, quantity, category]
  );
  return result.rows[0];
};

export const findAllSweets = async (): Promise<ISweet[]> => {
  const result = await pool.query('SELECT * FROM sweets ORDER BY id ASC');
  return result.rows;
};

export const findSweetById = async (id: number): Promise<ISweet | null> => {
  const result = await pool.query('SELECT * FROM sweets WHERE id = $1', [id]);
  return result.rows.length ? result.rows[0] : null;
};

export const updateSweet = async (id: number, sweet: Partial<ISweet>): Promise<ISweet | null> => {
  const fields = Object.keys(sweet).map((key, i) => `${key} = $${i + 2}`).join(', ');
  if (!fields) return null;

  const values = [id, ...Object.values(sweet)];
  const result = await pool.query(
    `UPDATE sweets SET ${fields} WHERE id = $1 RETURNING *`,
    values
  );
  return result.rows.length ? result.rows[0] : null;
};

export const deleteSweet = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM sweets WHERE id = $1', [id]);
};

export interface SearchFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const searchSweets = async (filters: SearchFilters): Promise<ISweet[]> => {
  let query = 'SELECT * FROM sweets WHERE 1=1';
  const values: any[] = [];
  let paramIndex = 1;

  if (filters.name) {
    query += ` AND name ILIKE $${paramIndex}`;
    values.push(`%${filters.name}%`);
    paramIndex++;
  }

  if (filters.category) {
    query += ` AND category ILIKE $${paramIndex}`;
    values.push(`%${filters.category}%`);
    paramIndex++;
  }

  if (filters.minPrice !== undefined) {
    query += ` AND price >= $${paramIndex}`;
    values.push(filters.minPrice);
    paramIndex++;
  }

  if (filters.maxPrice !== undefined) {
    query += ` AND price <= $${paramIndex}`;
    values.push(filters.maxPrice);
    paramIndex++;
  }

  query += ' ORDER BY id ASC';

  const result = await pool.query(query, values);
  return result.rows;
};

export const updateSweetStock = async (id: number, quantityChange: number): Promise<ISweet | null> => {
  const result = await pool.query(
    'UPDATE sweets SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
    [quantityChange, id]
  );
  return result.rows.length ? result.rows[0] : null;
};
