import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  writeBatch,
  increment
} from "firebase/firestore";
import { db } from "../firebase";

export async function addSpend(groupId, spendData) {
  /*
      title, 
      amount, 
      paidBy, 
      shares: [{ uid, amount }, ...], // Explicit shares (calculated on client)
      note 
    }
  */
  
  const batch = writeBatch(db);
  const totalAmount = Number(spendData.amount);
  
  // 1. Create Spend Doc
  const spendRef = doc(collection(db, "spends"));
  
  // Map shares to format { uid, share }
  const formattedShares = spendData.shares.map(s => ({
    uid: s.uid,
    share: Number(s.amount)
  }));

  batch.set(spendRef, {
    spendId: spendRef.id,
    groupId,
    title: spendData.title,
    amount: totalAmount,
    paidBy: spendData.paidBy,
    sharedWith: formattedShares,
    note: spendData.note || "",
    status: "pending",
    type: "expense",
    createdAt: serverTimestamp(),
    createdBy: spendData.paidBy
  });

  // 2. Update Balances (Rolling Balance Engine)
  // Logic: 
  // Payer gets credit for: (Total Amount - Their Own Share)
  // Others get debit for: (Their Share)
  
  // Note: Payer might NOT be in the 'shares' list if they are paying for others entirely.
  // But usually app includes payer in shares if they are part of the split.
  // Let's iterate through formattedShares to deduct.
  // And separately add full amount to Payer.
  
  // Step 2a: Credit Payer FULL Amount (Provisionally)
  const payerRef = doc(db, "balances", `${groupId}_${spendData.paidBy}`);
  batch.set(payerRef, {
    groupId,
    uid: spendData.paidBy,
    netBalance: increment(totalAmount),
    lastUpdatedAt: serverTimestamp()
  }, { merge: true });

  // Step 2b: Debit EACH person (including payer if in list) by their share
  formattedShares.forEach(shareItem => {
    const memberRef = doc(db, "balances", `${groupId}_${shareItem.uid}`);
    batch.set(memberRef, {
      groupId,
      uid: shareItem.uid,
      netBalance: increment(-shareItem.share),
      lastUpdatedAt: serverTimestamp()
    }, { merge: true });
  });

  // 3. Log Activity
  const logRef = doc(collection(db, "activityLogs"));
  batch.set(logRef, {
    groupId,
    action: "ADD_SPEND",
    performedBy: spendData.paidBy,
    targetUid: null,
    metadata: { spendId: spendRef.id, amount: totalAmount, title: spendData.title },
    createdAt: serverTimestamp()
  });

  // 4. Update User Stats
  const userRef = doc(db, "users", spendData.paidBy);
  batch.set(userRef, {
    stats: {
        totalSpendsAdded: increment(1)
    }
  }, { merge: true });

  await batch.commit();
}

export async function getGroupSpends(groupId) {
  const q = query(
    collection(db, "spends"), 
    where("groupId", "==", groupId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data() }));
}

export async function getGroupBalances(groupId) {
  // Query `balances` collection
  const q = query(collection(db, "balances"), where("groupId", "==", groupId));
  const snap = await getDocs(q);
  const balances = {};
  snap.docs.forEach(d => {
    const data = d.data();
    balances[data.uid] = data.netBalance || 0;
  });
  return balances;
}

export async function clearBalance(groupId, fromId, toId, amount) {
  const batch = writeBatch(db);

  // 1. Log Clear Action
  const clearRef = doc(collection(db, "clears"));
  batch.set(clearRef, {
    groupId,
    fromUid: fromId, 
    toUid: toId,
    amount,
    method: "payment",
    note: "Cleared via Hisaab",
    createdAt: serverTimestamp(),
    createdBy: fromId
  });

  // 1b. Create 'Spend' Record for feed visibility
  const spendRef = doc(collection(db, "spends"));
  batch.set(spendRef, {
      spendId: spendRef.id,
      groupId,
      title: "Payment",
      amount: Number(amount),
      paidBy: fromId,
      sharedWith: [{ uid: toId, share: Number(amount) }],
      type: "payment",
      createdAt: serverTimestamp(),
      createdBy: fromId
  });

  // 2. Adjust Balances
  // FromId (Payer of debt) -> NetBalance increases (+) (Debt reduces)
  const fromRef = doc(db, "balances", `${groupId}_${fromId}`);
  batch.set(fromRef, { netBalance: increment(amount) }, { merge: true });

  // ToId (Receiver) -> NetBalance decreases (-) (Because they got paid, they are owed less)
  const toRef = doc(db, "balances", `${groupId}_${toId}`);
  batch.set(toRef, { netBalance: increment(-amount) }, { merge: true });
  
  // 3. Log Activity
  const logRef = doc(collection(db, "activityLogs"));
  batch.set(logRef, {
    groupId,
    action: "CLEAR",
    performedBy: fromId,
    targetUid: toId,
    metadata: { amount, clearId: clearRef.id },
    createdAt: serverTimestamp()
  });

  await batch.commit();
}
