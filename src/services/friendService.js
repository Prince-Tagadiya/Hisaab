import { 
  collection, 
  doc, 
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

// Search user by exact email
export async function searchUserByEmail(email) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snap = await getDocs(q);
  
  if (snap.empty) return null;
  
  // Return the first match (emails should be unique)
  const userDoc = snap.docs[0];
  return { uid: userDoc.id, ...userDoc.data() };
}

// Internal helper to establish bi-directional friendship
async function addFriendship(userA, userB) {
  // Add B to A's friends
  await setDoc(doc(db, "users", userA.uid, "friends", userB.uid), {
    uid: userB.uid,
    name: userB.name || "Unknown",
    email: userB.email,
    photoURL: userB.photoURL || null,
    addedAt: serverTimestamp()
  });

  // Add A to B's friends
  await setDoc(doc(db, "users", userB.uid, "friends", userA.uid), {
    uid: userA.uid,
    name: userA.name || "Unknown",
    email: userA.email,
    photoURL: userA.photoURL || null,
    addedAt: serverTimestamp()
  });
}

// Send Friend Request
export async function sendFriendRequest(fromUser, toUser) {
  // Prevent self-request
  if (fromUser.uid === toUser.uid) throw new Error("Cannot add yourself");

  // Check if already friends
  const friendCheck = await getDoc(doc(db, "users", fromUser.uid, "friends", toUser.uid));
  if (friendCheck.exists()) throw new Error("Already friends");

  // Check if request already exists (prevent duplicates)
  const reqId = [fromUser.uid, toUser.uid].sort().join("_");
  const reqRef = doc(db, "friendRequests", reqId);
  const reqSnap = await getDoc(reqRef);

  if (reqSnap.exists()) {
    const data = reqSnap.data();
    if (data.status === 'pending') throw new Error("Request already pending");
    if (data.status === 'accepted') throw new Error("Already friends");
  }

  // Create Request
  await setDoc(reqRef, {
    id: reqId,
    fromUid: fromUser.uid,
    fromName: fromUser.displayName || fromUser.firstName || "Unknown",
    fromEmail: fromUser.email,
    fromPhotoURL: fromUser.photoURL || null,
    toUid: toUser.uid,
    toName: toUser.name || "Unknown",
    toEmail: toUser.email,
    status: 'pending',
    createdAt: serverTimestamp()
  });
}

// Get Pending Requests (Incoming)
export async function getIncomingFriendRequests(uid) {
  const q = query(
    collection(db, "friendRequests"), 
    where("toUid", "==", uid), 
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

// Get Pending Requests (Outgoing) - Optional for UI
export async function getOutgoingFriendRequests(uid) {
  const q = query(
    collection(db, "friendRequests"), 
    where("fromUid", "==", uid), 
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

// Respond to Request
export async function respondToFriendRequest(request, action) {
  // action: 'accepted' | 'declined'
  const reqRef = doc(db, "friendRequests", request.id);

  if (action === 'accepted') {
    // 1. Create Friendship
    const userA = { 
        uid: request.fromUid, 
        name: request.fromName, 
        email: request.fromEmail, 
        photoURL: request.fromPhotoURL 
    };
    const userB = { 
        uid: request.toUid, 
        name: request.toName, 
        email: request.toEmail 
        // Note: We might want B's photo here but we don't have it in the request doc usually if B didn't initiate.
        // Actually, we do! acceptance happens by B (currentUser). 
        // We can pass currentUser as argument to this function to be safe?
        // For MVP, we use what's in request or fetch? 
        // If B accepts, B is 'toUser'. We need B's profile for A's list.
        // We put 'fromPhotoURL' in doc. We didn't put 'toPhotoURL' maybe?
        // Let's assume we update the request doc to just status 'accepted' and create friends.
    };
    
    // We need current user (B)'s details to add to A's friend list.
    // Ideally, we pass it in. But to keep signature simple...
    // Let's rely on 'addFriendship' being robust. 
    // We'll fetch B's latest profile to be sure? Or pass it in?
    // Let's pass 'currentUser' as 3rd arg if needed.
    // For now, let's just use what we have. If B accepts, we are B.
    // We'll fetch B's full profile to be safe.
    const userBSnap = await getDoc(doc(db, "users", request.toUid));
    const fullUserB = { uid: request.toUid, ...userBSnap.data() };

    await addFriendship(userA, fullUserB);
    
    // 2. Update Request Status
    await updateDoc(reqRef, { status: 'accepted' });
  } else {
    // Declined
    await updateDoc(reqRef, { status: 'declined' });
    // Or delete it? keeping record is fine.
    await deleteDoc(reqRef); // Actually delete to allow re-request later easily
  }
}

// Get my friends (Existing)
export async function getUserFriends(uid) {
  if (!uid) return [];
  const friendsRef = collection(db, "users", uid, "friends");
  const snap = await getDocs(friendsRef);
  return snap.docs.map(doc => doc.data());
}

// Backward compatibility if needed (but we should prefer request flow)
export const addFriend = addFriendship; 
