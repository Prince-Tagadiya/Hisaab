import { 
  collection, 
  serverTimestamp, 
  doc, 
  writeBatch 
} from "firebase/firestore";
import { db } from "../firebase";

export async function sendNudge(groupId, fromUid, toUid) {
  const batch = writeBatch(db);

  // 1. Create Nudge Doc
  const nudgeRef = doc(collection(db, "nudges"));
  batch.set(nudgeRef, {
    nudgeId: nudgeRef.id,
    groupId,
    fromUid,
    toUid,
    message: "Gentle reminder to clear pending dues.",
    createdAt: serverTimestamp()
  });

  // 2. Log Activity
  const logRef = doc(collection(db, "activityLogs"));
  batch.set(logRef, {
    groupId,
    action: "NUDGE",
    performedBy: fromUid,
    targetUid: toUid,
    metadata: { nudgeId: nudgeRef.id },
    createdAt: serverTimestamp()
  });

  await batch.commit();
}
