import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'guests.json');

interface Guest {
  name: string;
  value: number;
}

interface GuestsFile {
  marcos: Guest[];
  millena: Guest[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { owner, guest, guests }: { owner: 'Marcos' | 'Millena'; guest?: Guest; guests?: Guest[] } = req.body;

      // Read existing file or create new
      let data: GuestsFile = { marcos: [], millena: [] };
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        data = JSON.parse(fileContent);
      } catch {
        // File doesn't exist, will create new
      }

      // Update the list based on the request
      if (guests) {
        // Replace the entire list for the owner
        if (owner === 'Marcos') {
          data.marcos = guests;
        } else if (owner === 'Millena') {
          data.millena = guests;
        }
      } else if (guest) {
        // Add a single guest
        if (owner === 'Marcos') {
          data.marcos.push(guest);
        } else if (owner === 'Millena') {
          data.millena.push(guest);
        }
      }

      // Write back to file
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: 'Guest list updated' });
    } catch {
      res.status(500).json({ error: 'Failed to update guest list' });
    }
  } else if (req.method === 'GET') {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data: GuestsFile = JSON.parse(fileContent);
      res.status(200).json(data);
    } catch {
      res.status(200).json({ marcos: [], millena: [] }); // Return empty lists if file doesn't exist
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}