import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username || username.length < 3) {
       return NextResponse.json({ available: false, error: 'Too short' });
    }

    await dbConnect();
    // Case insensitive check
    const existing = await User.findOne({ 
       username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });

    return NextResponse.json({ available: !existing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
