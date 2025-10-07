// Simpler implementation using Vercel Edge Config or fallback to in-memory storage
// This will work without any database setup

// In-memory storage (resets on redeploy, but works for demo)
let guestbookEntries = [
  { id: 1, name: "xXx_Gamer_xXx", message: "Cool site bro! Add me on MSN!", created_at: "2008-03-15T10:30:00Z" },
  { id: 2, name: "Sk8erBoi2008", message: "FIRST!!1! Nice games section 🎮", created_at: "2008-03-14T15:45:00Z" },
  { id: 3, name: "Anonymous", message: "Anyone know how to beat level 3??", created_at: "2008-03-13T20:15:00Z" }
];

let nextId = 4;

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
      // Return all guest book entries (most recent first)
      const sortedEntries = [...guestbookEntries].sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );
      return res.status(200).json(sortedEntries);
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

      // Create new entry
      const newEntry = {
        id: nextId++,
        name: sanitizedName,
        message: sanitizedMessage,
        created_at: new Date().toISOString()
      };

      // Add to storage
      guestbookEntries.unshift(newEntry);

      // Limit to 100 entries to prevent memory issues
      if (guestbookEntries.length > 100) {
        guestbookEntries = guestbookEntries.slice(0, 100);
      }

      return res.status(201).json(newEntry);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}