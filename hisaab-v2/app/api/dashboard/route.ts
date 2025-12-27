import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import { verifyIdToken } from '../../../lib/auth';
import Balance from '../../../models/Balance';
import GroupMember from '../../../models/GroupMember';
import Group from '../../../models/Group';
import User from '../../../models/User'; // Ensure models are registered

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Extract token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    
    const user = await verifyIdToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.uid;

    // 1. Calculate Totals
    // We can use aggregation or simple find. Aggregation is faster for sums.
    const balances = await Balance.find({ userId });
    
    let totalToPay = 0;
    let totalToReceive = 0;

    balances.forEach(b => {
      totalToPay += (b.toPay || 0);
      totalToReceive += (b.toReceive || 0);
    });

    // 2. Fetch Groups
    // Find GroupMembers for this user
    const memberships = await GroupMember.find({ userId })
      .sort({ joinedAt: -1 })
      .limit(10);

    // Manually fetch groups
    const groupIds = memberships.map(m => m.groupId);
    const groupDocs = await Group.find({ _id: { $in: groupIds } });
    
    // Create a map for quick lookup
    const groupMap = new Map(groupDocs.map(g => [g._id.toString(), g]));

    // Transform memberships to group view models
    const groups = memberships.map(m => {
      const g = groupMap.get(m.groupId.toString());
      if (!g) return null;
      
      // Calculate specific balance for THIS group (contextId = group._id)
      const groupBalance = balances.find(b => 
        b.contextType === 'group' && b.contextId === g._id.toString()
      );

      return {
        _id: g._id,
        name: g.name,
        currency: g.currency || '$',
        imageUrl: g.icon || null,
        memberCount: 0,
        myBalance: {
          toPay: groupBalance?.toPay || 0,
          toReceive: groupBalance?.toReceive || 0
        },
        lastUpdated: g.updatedAt || m.joinedAt
      };
    }).filter(g => g !== null);

    return NextResponse.json({
      totals: {
        toPay: totalToPay,
        toReceive: totalToReceive
      },
      groups
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
