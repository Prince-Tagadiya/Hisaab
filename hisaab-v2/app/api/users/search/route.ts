import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { verifyIdToken } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return NextResponse.json({ users: [] });
    }

    await dbConnect();
    
    // Optional: Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
       // Allow public search? Probably better to require auth.
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // const token = authHeader.split('Bearer ')[1];
    // await verifyIdToken(token); // Verify if strict

    const regex = new RegExp(query, 'i');

    const users = await User.find({
      $or: [
        { email: regex },
        { username: regex },
        { firstName: regex },
        { lastName: regex }
      ]
    })
    .select('firstName lastName username email photoURL firebaseUid')
    .limit(5);

    // Map to include displayName for frontend compatibility
    const usersMapped = users.map(u => ({
        ...u.toObject(),
        displayName: `${u.firstName} ${u.lastName}`.trim() || u.username
    }));

    return NextResponse.json({ users: usersMapped });

  } catch (error: any) {
    console.error('Search Users Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
