import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Group from '../../../../models/Group';
import GroupMember from '../../../../models/GroupMember';
import User from '../../../../models/User';
import Spend from '../../../../models/Spend';
import Balance from '../../../../models/Balance';
import { verifyIdToken } from '../../../../lib/auth';

// Helper to get formatted date
const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> } // Params is a Promise in Next 15+ or App Router async/await context
) {
  try {
    const { groupId } = await params;

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

    // 1. Check if user is member
    const membership = await GroupMember.findOne({ groupId, userId: user.uid });
    if (!membership) {
        return NextResponse.json({ error: 'Forbidden: Not a member' }, { status: 403 });
    }

    // 2. Fetch Group Details
    const group = await Group.findById(groupId);
    if (!group) {
        return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Auto-generate joinCode if missing (Legacy support)
    if (!group.joinCode) {
         group.joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
         await group.save();
    }

    // 3. Fetch Members
    const membersList = await GroupMember.find({ groupId });
    const userIds = membersList.map(m => m.userId);
    const users = await User.find({ firebaseUid: { $in: userIds } });
    
    // Map users for easy lookup
    const userMap: Record<string, any> = {};
    users.forEach(u => userMap[u.firebaseUid] = u);

    const members = membersList.map(m => {
        const u = userMap[m.userId] || {};
        return {
            userId: m.userId,
            name: u.displayName || u.email || 'Unknown',
            photoURL: u.photoURL,
            role: m.role
        };
    });

    // 4. Fetch Expenses
    const recentSpends = await Spend.find({ contextId: groupId, contextType: 'group' })
                                  .sort({ createdAt: -1 })
                                  .limit(20);

    const expenses = recentSpends.map(s => {
        const payer = userMap[s.paidBy] || {};
        // Determine user status in transaction (paid, borrowed, lent)
        let userStatus = 'involved'; // 'lent', 'borrowed', 'not_involved', 'paid'
        // Logic simplified for display
        return {
            _id: s._id,
            title: s.title,
            amount: s.amount,
            date: formatDate(s.createdAt),
            rawDate: s.createdAt,
            paidBy: {
                id: s.paidBy,
                name: payer.displayName || 'Unknown'
            },
            icon: 'restaurant' // Placeholder, would depend on Category
        };
    });

    // 5. Fetch My Balance
    const myBalanceRecord = await Balance.findOne({ userId: user.uid, contextId: groupId });
    const myBalance = (myBalanceRecord?.toReceive || 0) - (myBalanceRecord?.toPay || 0);

    // 6. Fetch All Balances (for sidebar)
    const allBalances = await Balance.find({ contextId: groupId });
    const memberBalances = allBalances.map(b => {
        const bal = (b.toReceive || 0) - (b.toPay || 0);
        return {
            userId: b.userId,
            balance: bal
        };
    });

    // 7. Calculate Total Spend
    const totalSpendResult = await Spend.aggregate([
        { $match: { contextId: groupId, contextType: 'group' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalSpend = totalSpendResult[0]?.total || 0;

    return NextResponse.json({
        group: {
            _id: group._id,
            name: group.name,
            description: group.description,
            joinCode: group.joinCode || '------',
            createdAt: formatDate(group.createdAt),
            currency: group.currency,
            members,
            myBalance,
            memberBalances,
            totalSpend
        },
        expenses
    });

  } catch (error: any) {
    console.error("Get Group Details Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
