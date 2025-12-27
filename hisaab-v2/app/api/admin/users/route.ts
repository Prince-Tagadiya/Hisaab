import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { verifyAdminAccess } from '../../../../lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const access = await verifyAdminAccess(req);
    if (!access) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
