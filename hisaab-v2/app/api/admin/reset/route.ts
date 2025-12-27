import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import Group from '../../../../models/Group';
import GroupMember from '../../../../models/GroupMember';
import Spend from '../../../../models/Spend';
import Balance from '../../../../models/Balance';
import ActivityLog from '../../../../models/ActivityLog';
import RequestModel from '../../../../models/Request';
import Clear from '../../../../models/Clear';
import DirectSplit from '../../../../models/DirectSplit';
import Favor from '../../../../models/Favor';
import Nudge from '../../../../models/Nudge';
import { verifyAdminAccess } from '../../../../lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const access = await verifyAdminAccess(req);
    if (!access) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scope } = await req.json(); // 'all', 'data', 'expenses'

    await dbConnect();

    const stats = {
        users: 0,
        groups: 0,
        expenses: 0
    };

    if (scope === 'transactions' || scope === 'data' || scope === 'all') {
        const d1 = await Spend.deleteMany({});
        const d2 = await Balance.deleteMany({});
        const d3 = await ActivityLog.deleteMany({});
        const d4 = await RequestModel.deleteMany({});
        const d5 = await Clear.deleteMany({});
        const d6 = await DirectSplit.deleteMany({});
        const d7 = await Favor.deleteMany({});
        const d8 = await Nudge.deleteMany({});
        stats.expenses = d1.deletedCount + d2.deletedCount + d3.deletedCount; // approximate
    }

    if (scope === 'data' || scope === 'all') {
        const g = await Group.deleteMany({});
        const gm = await GroupMember.deleteMany({});
        stats.groups = g.deletedCount + gm.deletedCount;
    }

    if (scope === 'all') {
        const u = await User.deleteMany({});
        stats.users = u.deletedCount;
        
        // Also wipe Firebase Users? 
        // Dangerous, but requested "reset who data base includeing user".
        // To verify: User probably means MongoDB data. 
        // Wiping Firebase Auth users requires listing them and deleting.
        // I will skip Firebase deletion to avoid locking myself out of the dev account unless explicitly handled.
    }

    return NextResponse.json({ success: true, stats });

  } catch (error: any) {
    console.error("Reset Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
