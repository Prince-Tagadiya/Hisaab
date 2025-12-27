import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Request from '../../../models/Request';
import { verifyIdToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const user = await verifyIdToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find accepted friend requests involving this user
    const acceptedRequests = await Request.find({
        type: 'friend',
        status: 'accepted',
        $or: [
            { 'fromUser.userId': user.uid },
            { 'toUser.userId': user.uid }
        ]
    });

    const friends = acceptedRequests.map(req => {
        const isFromMe = req.fromUser.userId === user.uid;
        const friendData = isFromMe ? req.toUser : req.fromUser;
        return {
            id: friendData.userId,
            name: friendData.name || friendData.email,
            email: friendData.email,
            photoURL: friendData.photoURL,
            category: 'Friend', // Placeholder category
            date: new Date(req.createdAt).toLocaleDateString(),
            status: 'Active',
            amount: 0, // Placeholder for balance calculation
            type: 'settled' // Placeholder
        };
    });

    return NextResponse.json({ friends });

  } catch (error: any) {
    console.error("Fetch Friends Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
