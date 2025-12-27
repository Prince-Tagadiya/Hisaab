import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Request from '../../../models/Request';
import Group from '../../../models/Group';
import User from '../../../models/User';
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

    // Populate Group Info (Icon)
    const requestsWithIcons = await Promise.all(requests.map(async (req) => {
        const r = req.toObject();
        if (r.groupId) {
             const g = await Group.findById(r.groupId).select('icon');
             if (g) r.groupIcon = g.icon;
        }
        return r;
    }));

    return NextResponse.json({ requests: requestsWithIcons });

  } catch (error: any) {
    console.error("Fetch Requests Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
    const { toEmail, type } = await req.json();

    if (type === 'friend') {
        if (!toEmail) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        const targetUser = await User.findOne({ email: toEmail });
        if (!targetUser) return NextResponse.json({ error: 'User not found with this email' }, { status: 404 });

        if (targetUser.firebaseUid === user.uid) {
            return NextResponse.json({ error: 'Cannot send request to yourself' }, { status: 400 });
        }

        // Check availability
        const existing = await Request.findOne({
            'fromUser.userId': user.uid,
            'toUser.userId': targetUser.firebaseUid,
            type: 'friend',
            status: 'pending'
        });
        if (existing) return NextResponse.json({ error: 'Request already sent' }, { status: 400 });

        // Get Sender Details
        const sender = await User.findOne({ firebaseUid: user.uid });

        await Request.create({
            type: 'friend',
            fromUser: {
                userId: user.uid,
                name: sender?.name || user.name,
                email: sender?.email || user.email,
                photoURL: sender?.photoURL || user.picture
            },
            toUser: {
                userId: targetUser.firebaseUid,
                name: targetUser.name,
                email: targetUser.email,
                photoURL: targetUser.photoURL
            },
            status: 'pending',
            createdAt: new Date()
        });

        return NextResponse.json({ success: true, message: 'Friend request sent' });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });

  } catch (error: any) {
    console.error("Create Request Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
