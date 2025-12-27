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

    // Find pending requests for this user (by ID or Email)
    const requests = await Request.find({
        $or: [
            { 'toUser.userId': user.uid },
            { 'toUser.email': user.email }
        ],
        status: 'pending'
    }).sort({ createdAt: -1 });

    return NextResponse.json({ requests });

  } catch (error: any) {
    console.error("Fetch Requests Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
