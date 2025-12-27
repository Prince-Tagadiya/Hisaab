import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { verifyIdToken } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const currentUser = await verifyIdToken(token);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    // Search by username or email (case insensitive)
    const users = await User.find({
      $and: [
        { firebaseUid: { $ne: currentUser.uid } }, // Exclude current user
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    })
    .select('firebaseUid username email firstName lastName photoURL')
    .limit(10);

    const formattedUsers = users.map(u => ({
      userId: u.firebaseUid,
      username: u.username,
      email: u.email,
      name: `${u.firstName} ${u.lastName}`.trim(),
      photoURL: u.photoURL
    }));

    return NextResponse.json({ users: formattedUsers });

  } catch (error: any) {
    console.error("Search Users Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
