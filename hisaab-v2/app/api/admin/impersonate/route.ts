import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '../../../../lib/auth'; // Ensure init
import { verifyAdminAccess } from '../../../../lib/adminAuth';
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const access = await verifyAdminAccess(req);
    if (!access) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUid } = await req.json();
    if (!targetUid) {
        return NextResponse.json({ error: 'Target UID required' }, { status: 400 });
    }

    // Generate Custom Token
    // 'admin' assumes it has been initialized by the verifyIdToken import side-effect
    // If not, we might need to ensure init. verifyIdToken call usually ensures it.
    // To be safe, we can rely on verifyIdToken's file execution.
    
    // Note: createCustomToken takes the UID.
    const customToken = await admin.auth().createCustomToken(targetUid);

    return NextResponse.json({ customToken });

  } catch (error: any) {
    console.error("Impersonation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
