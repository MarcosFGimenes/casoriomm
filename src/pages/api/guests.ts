import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Firebase initialization
const firebaseConfig = {
  apiKey: "AIzaSyB8WfeV7d_SpMv90NltwlvABMnNWNryaqI",
  authDomain: "casoriomm.firebaseapp.com",
  projectId: "casoriomm",
  storageBucket: "casoriomm.firebasestorage.app",
  messagingSenderId: "574204452974",
  appId: "1:574204452974:web:bd30f9eb1e1fbd6da4067f"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

interface Guest {
  name: string;
  value: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { owner, guest, guests }: { owner: 'Marcos' | 'Millena'; guest?: Guest; guests?: Guest[] } = req.body;

      const docRef = doc(db, 'guests', owner.toLowerCase());

      if (guests) {
        // Replace the entire list for the owner
        await setDoc(docRef, { guests });
      } else if (guest) {
        // Add a single guest
        const docSnap = await getDoc(docRef);
        const existingGuests = docSnap.exists() ? docSnap.data()?.guests || [] : [];
        await updateDoc(docRef, { guests: arrayUnion(guest) });
      }

      res.status(200).json({ message: 'Guest list updated' });
    } catch (error) {
      console.error('Error updating guest list:', error);
      res.status(500).json({ error: 'Failed to update guest list' });
    }
  } else if (req.method === 'GET') {
    try {
      const marcosDoc = await getDoc(doc(db, 'guests', 'marcos'));
      const millenaDoc = await getDoc(doc(db, 'guests', 'millena'));

      res.status(200).json({
        marcos: marcosDoc.exists() ? marcosDoc.data()?.guests || [] : [],
        millena: millenaDoc.exists() ? millenaDoc.data()?.guests || [] : [],
      });
    } catch (error) {
      console.error('Error fetching guest list:', error);
      res.status(500).json({ error: 'Failed to fetch guest list' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}