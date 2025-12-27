
# 📦 Hisaab Database Schema Design (MongoDB)

This document outlines the complete MongoDB schema for the **Hisab** expense tracking application. It is designed for free-tier scalability, minimal reads, and robust audit trails.

**Core Principles:**
- **Single Source of Truth**: MongoDB (No Firestore).
- **Pre-computed Balances**: Avoid expensive aggregations on read-heavy dashboards.
- **Immutable History**: Logic is append-only for transactions/audits.
- **Transactional Writes**: Critical monetary updates use MongoDB transactions.

---

## 1. Users Collection (`users`)
Stores user identity and global profile.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | MongoDB ID |
| `firebaseUid` | String | Ext auth ID (Indexed, Unique) |
| `firstName` | String | User's first name |
| `lastName` | String | User's last name |
| `username` | String | Unique handle (Indexed) |
| `email` | String | Contact email (Indexed, Unique) |
| `photoURL` | String | Profile picture URL |
| `mobile` | String | Optional phone number |
| `createdAt` | Date | Signup timestamp |
| `lastActiveAt` | Date | Last login |

**Indexes:**
- `{ firebaseUid: 1 }` (Auth lookup)
- `{ username: 1 }` (Friend search)
- `{ email: 1 }` (Invites)

---

## 2. Groups Collection (`groups`)
Represents a space for shared expenses (e.g., Trip, Apartment).

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Group name |
| `type` | String | `trip` \| `normal` |
| `createdBy` | String | Creator UID |
| `isClosed` | Boolean | Read-only flag |
| `closedAt` | Date | Closure timestamp |

---

## 3. Group Members (`groupMembers`)
Mapping of Users to Groups. Separated from `groups` to allow unlimited members without hitting document size limits (though unlikely for this app, it's cleaner).

| Field | Type | Description |
| :--- | :--- | :--- |
| `groupId` | ObjectId | Ref to Group |
| `userId` | String | Ref to User |
| `role` | String | `admin` \| `member` |
| `familyLabel` | String | e.g. "Patel Family" |
| `isCleared` | Boolean | True if user has settled debts |

**Indexes:**
- `{ groupId: 1, userId: 1 }` (Unique Compound - Is Member?)

---

## 4. Spends (`spends`)
The core ledger. Records every expense event.

| Field | Type | Description |
| :--- | :--- | :--- |
| `contextType` | String | `group` \| `direct` |
| `contextId` | String | ID of the Group or DirectSplit |
| `title` | String | Description |
| `amount` | Number | Total Amount |
| `paidBy` | String | UID of payer |
| `participants` | Array<String> | UIDs of splitters |
| `splitType` | String | `equal`, `percentage`, etc. |
| `status` | String | `pending` \| `cleared` |
| `lockedAt` | Date | If set, prevents edits |

**Indexes:**
- `{ contextId: 1, createdAt: -1 }` (Feed View)
- `{ paidBy: 1 }` (My Spend History)

---

## 5. Balances (`balances`)
**CRITICAL**: Stores pre-computed net balances.
Instead of summing all `spends` on every view, we update this document whenever a spend is created/edited.

| Field | Type | Description |
| :--- | :--- | :--- |
| `contextId` | String | Group/Direct Context |
| `userId` | String | User ID |
| `toPay` | Number | Amount user owes others |
| `toReceive` | Number | Amount user is owed |

**Rules:**
- `toPay` and `toReceive` should technically be net, but storing both allows detailed UI ("You owe 500, but are owed 200").
- Updated via Backend Transactions ONLY.

**Indexes:**
- `{ contextId: 1, userId: 1 }` (Unique)

---

## 6. Activity Logs (`activityLogs`)
Immutable audit trail.

| Field | Type | Description |
| :--- | :--- | :--- |
| `actionType` | String | `SPEND_ADDED`, `GROUP_CREATED`, etc. |
| `performedBy` | String | Actor UID |
| `metadata` | Object | Snapshot of change (e.g. old vs new amount) |

**Indexes:**
- `{ contextId: 1, createdAt: -1 }` (Timeline)

---

## Backend Usage Notes
1.  **Transactions**: When adding a Spend, use a MongoDB Session to:
    -   Insert `Spend`.
    -   Update `Balance` for all participants.
    -   Insert `ActivityLog`.
    -   (Atomic Commit).
2.  **Free Tier Safety**:
    -   Indexes ensure queries only scan relevant documents.
    -   Archived/Closed groups should eventually be moved to cold storage if scaling beyond free tier, but this schema supports 1000s of active docs easily.
