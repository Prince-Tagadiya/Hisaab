import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Group from '../../../../models/Group';
import GroupMember from '../../../../models/GroupMember';
import User from '../../../../models/User';
import { verifyIdToken } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await verifyIdToken(token);
        if (!decodedToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = decodedToken.uid;
        
        const { joinCode } = await req.json();
        if(!joinCode) return NextResponse.json({ error: 'Code required' }, { status: 400 });

        const group = await Group.findOne({ joinCode: joinCode.toUpperCase() });
        if (!group) return NextResponse.json({ error: 'Invalid join code' }, { status: 404 });

        // Check if already member
        const existing = await GroupMember.findOne({ groupId: group._id, userId });
        if (existing) return NextResponse.json({ error: 'You are already a member of this group' }, { status: 400 });

        await GroupMember.create({
            groupId: group._id,
            userId,
            role: 'member',
            joinedAt: new Date()
        });

        // Update member count
        // (Optional if computed dynamically, but good to have)
        
        return NextResponse.json({ success: true, groupId: group._id });

    } catch(e: any) {
        console.error("Join Group Error:", e);
        return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
    }
}
