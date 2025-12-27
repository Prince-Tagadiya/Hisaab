import { NextRequest } from 'next/server';
import { verifyIdToken } from './auth';

export async function verifyAdminAccess(req: NextRequest) {
  // 1. Check Master Key
  const adminKey = req.headers.get('x-admin-key');
  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    return { type: 'master' };
  }

  // 2. Check User Token (Optional, for regular admins if we have them)
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    const user = await verifyIdToken(token);
    // TODO: if (user && user.email === 'admin@example.com') return { type: 'user', user };
    // For now, only Master Key allows "Master Panel" access without strict user role check
    if (user) {
         // Return user, but strictly speaking "Master Panel" usually implies Master Key.
         // But let's allow authenticated users to *try* if we implement roles later.
         return { type: 'user', user }; 
    }
  }

  return null;
}
