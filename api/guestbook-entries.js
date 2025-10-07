import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get all guest book entries
      const { rows } = await sql`
        SELECT * FROM guestbook_entries
        ORDER BY created_at DESC
        LIMIT 50
      `;
      return res.status(200).json(rows);
    } else if (req.method === 'POST') {
      // Add new guest book entry
      const { name, message } = req.body;

      // Validate input
      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }

      // Sanitize input (basic XSS prevention)
      const sanitizedName = name.toString().slice(0, 50).replace(/[<>]/g, '');
      const sanitizedMessage = message.toString().slice(0, 500).replace(/[<>]/g, '');

      // Insert new entry
      const { rows } = await sql`
        INSERT INTO guestbook_entries (name, message, created_at)
        VALUES (${sanitizedName}, ${sanitizedMessage}, NOW())
        RETURNING *
      `;

      return res.status(201).json(rows[0]);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Database error:', error);

    // Check if table doesn't exist and try to create it
    if (error.message && error.message.includes('does not exist')) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS guestbook_entries (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
          )
        `;

        // Try the operation again
        if (req.method === 'GET') {
          return res.status(200).json([]);
        } else {
          return res.status(201).json({ message: 'Table created, please try again' });
        }
      } catch (createError) {
        console.error('Failed to create table:', createError);
        return res.status(500).json({ error: 'Failed to setup database' });
      }
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}