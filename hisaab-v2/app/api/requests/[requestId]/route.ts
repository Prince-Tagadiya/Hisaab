import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Request from '../../../../models/Request';
import GroupMember from '../../../../models/GroupMember';
import { verifyIdToken } from '../../../../lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    const { action } = await req.json(); // 'accept' or 'decline'

    if (!['accept', 'decline'].includes(action)) {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const user = await verifyIdToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const request = await Request.findById(requestId);
    if (!request) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Verify ownership
    const isTarget = (request.toUser.userId === user.uid) || (request.toUser.email === user.email);
    if (!isTarget) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (request.status !== 'pending') {
        return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
    }

    if (action === 'accept') {
        if (request.type === 'group_invite') {
            // Create Group Member
            // Check if already member
            const existing = await GroupMember.findOne({ groupId: request.groupId, userId: user.uid });
            if (!existing) {
                await GroupMember.create({
                    groupId: request.groupId,
                    userId: user.uid,
                    role: 'member'
                });
            }
        }
        request.status = 'accepted';
    } else {
        request.status = 'declined';
    }

    await request.save();

    return NextResponse.json({ success: true, status: request.status });

  } catch (error: any) {
    console.error("Update Request Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
