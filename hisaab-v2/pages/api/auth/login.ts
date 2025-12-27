import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import { verifyIdToken } from '../../../lib/auth';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = await verifyIdToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  await dbConnect();

  try {
    // Sync Firebase User to MongoDB
    // We use findOneAndUpdate with upsert to creating if not exists
    const user = await User.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        email: decoded.email,
        displayName: decoded.name || 'User',
        photoURL: decoded.picture || '',
        updatedAt: new Date(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const isNewUser = !user.username || !user.firstName;

    return res.status(200).json({ success: true, user, isNewUser });
  } catch (error) {
    console.error("Login API Error:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
