import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { verifyIdToken } from '../../../../lib/auth';

export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const { username, firstName, lastName, mobile } = body;

    await dbConnect();

    // Check username uniqueness if changing? 
    // Usually valid to re-check
    const existing = await User.findOne({ 
       username: { $regex: new RegExp(`^${username}$`, 'i') },
       firebaseUid: { $ne: user.uid } // Not self
    });
    if (existing) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
        { firebaseUid: user.uid },
        {
            $set: {
                username,
                firstName,
                lastName,
                mobile,
                // Ensure email/photo from firebase are kept or updated if passed?
                // Usually we trust the client or token. 
            }
        },
        { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error: any) {
    console.error("Profile Update Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
