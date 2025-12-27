import { NextRequest, NextResponse } from 'next/server';
import Request from '../../../models/Request';
import dbConnect from '../../../lib/db';
import { verifyIdToken } from '../../../lib/auth';
import Group from '../../../models/Group';
import GroupMember from '../../../models/GroupMember';
import User from '../../../models/User';
import Balance from '../../../models/Balance';

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

    // 1. Find all groups user is part of
    const memberships = await GroupMember.find({ userId: user.uid });
    const groupIds = memberships.map(m => m.groupId);

    // 2. Fetch Group Details
    const groups = await Group.find({ _id: { $in: groupIds } }).sort({ updatedAt: -1 });

    // 3. Fetch Balances for these groups
    const balances = await Balance.find({
        userId: user.uid,
        contextType: 'group',
        contextId: { $in: groupIds }
    });

    const balanceMap: Record<string, number> = {};
    balances.forEach(b => {
        balanceMap[b.contextId.toString()] = (b.toReceive || 0) - (b.toPay || 0);
    });

    // 4. Fetch Member Counts
    const memberCounts = await GroupMember.aggregate([
        { $match: { groupId: { $in: groupIds } } },
        { $group: { _id: "$groupId", count: { $sum: 1 } } }
    ]);
    const countMap: Record<string, number> = {};
    memberCounts.forEach(c => {
        countMap[c._id.toString()] = c.count;
    });

    // 5. Construct Response
    const groupData = groups.map(g => {
        const bal = balanceMap[g._id.toString()] || 0;
        return {
            _id: g._id,
            name: g.name,
            icon: g.icon,
            currency: g.currency,
            memberCount: countMap[g._id.toString()] || 0,
            myBalance: bal,
            status: Math.abs(bal) < 0.01 ? 'settled' : (bal > 0 ? 'owed' : 'owe')
        };
    });

    return NextResponse.json({ groups: groupData });

  } catch (error: any) {
    console.error("Fetch Groups Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Auth Check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const user = await verifyIdToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, currency, members } = await req.json();

    if (!name) {
       return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    // Generate a simple 6-char join code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 1. Create Group
    const newGroup = await Group.create({
      name,
      currency: currency || 'USD',
      createdBy: user.uid,
      icon: null, // handled by upload separately if needed
      joinCode
    });

    // 2. Add Creator as Admin
    await GroupMember.create({
      groupId: newGroup._id,
      userId: user.uid,
      role: 'admin'
    });

    // 3. Invite Members (Create Requests)
    if (members && Array.isArray(members) && members.length > 0) {
       const foundUsers = await User.find({ email: { $in: members } });
       const foundUserMap: Record<string, any> = {};
       foundUsers.forEach(u => foundUserMap[u.email] = u);

       const invitePromises = members.map(async (email: string) => {
          if (email === user.email) return;

          const invitedUser = foundUserMap[email];
          
          await Request.create({
              type: 'group_invite',
              fromUser: {
                  userId: user.uid,
                  name: user.name || user.email,
                  email: user.email,
                  photoURL: user.picture
              },
              toUser: {
                  userId: invitedUser?.firebaseUid,
                  email: email
              },
              groupId: newGroup._id,
              groupName: newGroup.name,
              status: 'pending'
          });
       });

       await Promise.all(invitePromises);
    }

    return NextResponse.json({ 
       success: true, 
       group: newGroup 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Create Group Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
