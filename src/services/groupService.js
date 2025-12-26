import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
  increment,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";

export async function deleteGroup(groupId) {
  const batch = writeBatch(db);
  const groupRef = doc(db, "groups", groupId);
  batch.delete(groupRef);

  const q = query(collection(db, "groupMembers"), where("groupId", "==", groupId));
  const snap = await getDocs(q);
  snap.docs.forEach(d => batch.delete(d.ref));
  
  const bQ = query(collection(db, "balances"), where("groupId", "==", groupId));
  const bSnap = await getDocs(bQ);
  bSnap.docs.forEach(d => batch.delete(d.ref));

  await batch.commit();
}

export async function createGroup(name, user) {
  const batch = writeBatch(db);
  const groupRef = doc(collection(db, "groups"));
  
  batch.set(groupRef, {
    groupId: groupRef.id,
    name,
    type: "ongoing",
    createdBy: user.uid,
    createdAt: serverTimestamp(),
    inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    adminId: user.uid,
    memberCount: 1,
    status: "active"
  });

  const memberId = `${groupRef.id}_${user.uid}`;
  const memberRef = doc(db, "groupMembers", memberId);
  batch.set(memberRef, {
    groupId: groupRef.id,
    uid: user.uid,
    role: 'admin',
    joinedAt: serverTimestamp(),
    removedAt: null,
    balance: { toPay: 0, toReceive: 0 },
    isCleared: true
  });
  
  const logRef = doc(collection(db, "activityLogs"));
  batch.set(logRef, {
    groupId: groupRef.id,
    action: "CREATE_GROUP",
    performedBy: user.uid,
    targetUid: user.uid,
    metadata: { name },
    createdAt: serverTimestamp()
  });

  await batch.commit();
  return groupRef.id;
}

export async function getUserGroups(userId) {
  const q = query(collection(db, "groupMembers"), where("uid", "==", userId));
  const snapshot = await getDocs(q);
  
  const groups = [];
  const groupPromises = snapshot.docs.map(async (docSnap) => {
    const membership = docSnap.data();
    const groupDoc = await getDoc(doc(db, "groups", membership.groupId));
    if (groupDoc.exists()) {
      groups.push({ id: groupDoc.id, ...groupDoc.data() });
    }
  });
  await Promise.all(groupPromises);
  return groups; 
}

// Join Logic Steps
async function  executeJoin(groupId, user) {
    const memberId = `${groupId}_${user.uid}`;
    const memberRef = doc(db, "groupMembers", memberId);
    const memberSnap = await getDoc(memberRef);
  
    if (memberSnap.exists()) return groupId; // Already member
    
    const batch = writeBatch(db);
    batch.set(memberRef, {
      groupId,
      uid: user.uid,
      role: 'member',
      joinedAt: serverTimestamp(),
      removedAt: null,
      balance: { toPay: 0, toReceive: 0 },
      isCleared: true
    });
    
    const grouRef = doc(db, "groups", groupId);
    batch.update(grouRef, { memberCount: increment(1) });
    
    const logRef = doc(collection(db, "activityLogs"));
    batch.set(logRef, {
      groupId,
      action: "JOIN",
      performedBy: user.uid,
      targetUid: user.uid,
      metadata: {},
      createdAt: serverTimestamp()
    });
  
    await batch.commit();
    return groupId;
}

export async function joinGroup(inviteCode, user) {
  const q = query(collection(db, "groups"), where("inviteCode", "==", inviteCode));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("Invalid invite code");
  const groupId = snapshot.docs[0].id;
  return executeJoin(groupId, user);
}

// Join by ID (for Invites)
export async function joinGroupById(groupId, user) {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    if (!groupDoc.exists()) throw new Error("Group not found");
    return executeJoin(groupId, user);
}

/* --- Group Invites System --- */

export async function sendGroupInvite(groupId, fromUser, toEmail, groupName) {
    // Check if already member? -> We skip that check for now, UI can handle or we check here.
    // We'll create an invite doc.
    
    const inviteRef = doc(collection(db, "groupInvites"));
    await setDoc(inviteRef, {
        id: inviteRef.id,
        groupId,
        groupName: groupName || "Unknown Group",
        fromUid: fromUser.uid,
        fromName: fromUser.displayName || fromUser.firstName || "Unknown",
        toEmail,
        status: 'pending',
        createdAt: serverTimestamp()
    });
}

export async function getUserGroupInvites(userEmail) {
    const q = query(
        collection(db, "groupInvites"), 
        where("toEmail", "==", userEmail),
        where("status", "==", "pending")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
}

export async function respondToGroupInvite(invite, action, user) {
    // action: 'accepted' | 'declined'
    const ref = doc(db, "groupInvites", invite.id);
    
    if (action === 'accepted') {
        await executeJoin(invite.groupId, user);
        await updateDoc(ref, { status: 'accepted' });
    } else {
        await deleteDoc(ref); // Remove declined invite
    }
}
