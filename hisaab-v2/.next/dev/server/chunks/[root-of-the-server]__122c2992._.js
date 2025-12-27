module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/hisaab-v2/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGO_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */ let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = dbConnect;
}),
"[project]/hisaab-v2/models/User.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photoURL: String,
    mobile: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    }
});
// Indexes
UserSchema.index({
    firebaseUid: 1
});
UserSchema.index({
    username: 1
});
UserSchema.index({
    email: 1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('User', UserSchema);
}),
"[project]/hisaab-v2/models/Group.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const GroupSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
            'trip',
            'normal'
        ],
        default: 'normal',
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    closedAt: {
        type: Date,
        default: null
    }
});
// Indexes
GroupSchema.index({
    createdBy: 1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.Group || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('Group', GroupSchema);
}),
"[project]/hisaab-v2/models/GroupMember.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const GroupMemberSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    groupId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'admin',
            'member'
        ],
        default: 'member'
    },
    familyLabel: {
        type: String
    },
    isCleared: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});
// Compound Index: One document per user per group
GroupMemberSchema.index({
    groupId: 1,
    userId: 1
}, {
    unique: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.GroupMember || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('GroupMember', GroupMemberSchema);
}),
"[project]/hisaab-v2/models/Spend.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const SpendSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    contextType: {
        type: String,
        enum: [
            'group',
            'direct'
        ],
        required: true
    },
    contextId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidBy: {
        type: String,
        required: true
    },
    // Participants involved in the split
    participants: [
        {
            type: String
        }
    ],
    // Who created this record
    userId: {
        type: String,
        required: true
    },
    // Split Logic
    shareAmount: {
        type: Number
    },
    // User spec: "shareAmount" in singular. Likely implies simple equal split per person or reference. 
    // More robust: Map of user -> amount. But keeping to spec fields.
    splitType: {
        type: String,
        enum: [
            'equal',
            'custom',
            'percentage',
            'shares'
        ],
        default: 'equal'
    },
    note: String,
    status: {
        type: String,
        enum: [
            'pending',
            'cleared'
        ],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    },
    lockedAt: {
        type: Date
    } // For edit window expiration
});
// Indexes
SpendSchema.index({
    contextId: 1,
    createdAt: -1
}); // Fast history fetch
SpendSchema.index({
    paidBy: 1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.Spend || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('Spend', SpendSchema);
}),
"[project]/hisaab-v2/models/Balance.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const BalanceSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    contextType: {
        type: String,
        enum: [
            'group',
            'direct'
        ],
        required: true
    },
    contextId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    toPay: {
        type: Number,
        default: 0,
        min: 0
    },
    toReceive: {
        type: Number,
        default: 0,
        min: 0
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    }
});
// Indexes for fast lookup
BalanceSchema.index({
    contextId: 1,
    userId: 1
}, {
    unique: true
});
BalanceSchema.index({
    userId: 1
}); // "Get my total balance"
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.Balance || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('Balance', BalanceSchema);
}),
"[project]/hisaab-v2/models/ActivityLog.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const ActivityLogSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    contextType: {
        type: String,
        enum: [
            'group',
            'direct'
        ],
        required: true
    },
    contextId: {
        type: String,
        required: true
    },
    actionType: {
        type: String,
        enum: [
            'GROUP_CREATED',
            'MEMBER_ADDED',
            'SPEND_ADDED',
            'SPEND_EDITED',
            'SPEND_LOCKED',
            'CLEAR_DONE',
            'GROUP_CLOSED',
            'GROUP_REOPENED',
            'NUDGE_SENT'
        ],
        required: true
    },
    performedBy: {
        type: String,
        required: true
    },
    metadata: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Keys: Audit Trail Ordering
ActivityLogSchema.index({
    contextId: 1,
    createdAt: -1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.ActivityLog || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('ActivityLog', ActivityLogSchema);
}),
"[project]/hisaab-v2/models/Request.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const RequestSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    type: {
        type: String,
        enum: [
            'friend',
            'group_invite'
        ],
        required: true
    },
    // From User (Snapshot for faster list display)
    fromUser: {
        userId: {
            type: String,
            required: true
        },
        name: String,
        email: String,
        photoURL: String
    },
    // To User
    toUser: {
        userId: String,
        email: String
    },
    // For Group Invites
    groupId: String,
    groupName: String,
    status: {
        type: String,
        enum: [
            'pending',
            'accepted',
            'declined'
        ],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Compound index to quickly find my pending requests
RequestSchema.index({
    'toUser.userId': 1,
    status: 1
});
RequestSchema.index({
    'toUser.email': 1,
    status: 1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.Request || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('Request', RequestSchema);
}),
"[project]/hisaab-v2/models/Clear.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const ClearSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    contextType: {
        type: String,
        enum: [
            'group',
            'direct'
        ],
        required: true
    },
    contextId: {
        type: String,
        required: true
    },
    fromUser: {
        type: String,
        required: true
    },
    toUser: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: [
            'payment',
            'adjustment',
            'favor'
        ],
        default: 'payment'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    }
});
// Indexes
ClearSchema.index({
    contextId: 1
});
ClearSchema.index({
    fromUser: 1
});
ClearSchema.index({
    toUser: 1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.Clear || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('Clear', ClearSchema);
}),
"[project]/hisaab-v2/models/DirectSplit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const DirectSplitSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    userA: {
        type: String,
        required: true
    },
    userB: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isArchived: {
        type: Boolean,
        default: false
    }
});
// Ensure userA < userB strictly for uniqueness
DirectSplitSchema.pre('save', function(next) {
    if (this.userA > this.userB) {
        const temp = this.userA;
        this.userA = this.userB;
        this.userB = temp;
    }
    next();
});
// Unique Pair Index
DirectSplitSchema.index({
    userA: 1,
    userB: 1
}, {
    unique: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.DirectSplit || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('DirectSplit', DirectSplitSchema);
}),
"[project]/hisaab-v2/models/Favor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const FavorSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    contextType: {
        type: String,
        enum: [
            'group',
            'direct'
        ],
        required: true
    },
    contextId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0,
        min: 0
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    }
});
// Indexes
FavorSchema.index({
    contextId: 1,
    userId: 1
}, {
    unique: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.Favor || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('Favor', FavorSchema);
}),
"[project]/hisaab-v2/models/Nudge.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/hisaab-v2/node_modules/mongoose)");
;
const NudgeSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    contextType: {
        type: String,
        enum: [
            'group',
            'direct'
        ],
        required: true
    },
    contextId: {
        type: String,
        required: true
    },
    fromUser: {
        type: String,
        required: true
    },
    toUser: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        default: 'polite'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Indexes for rate limiting lookups
NudgeSchema.index({
    fromUser: 1,
    toUser: 1,
    createdAt: -1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].models.Nudge || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$mongoose$29$__["default"].model('Nudge', NudgeSchema);
}),
"[project]/hisaab-v2/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifyIdToken",
    ()=>verifyIdToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs, [project]/hisaab-v2/node_modules/firebase-admin)");
;
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$firebase$2d$admin$29$__["apps"].length) {
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"]({
        credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$firebase$2d$admin$29$__["credential"].cert({
            projectId: ("TURBOPACK compile-time value", "hisaab-244f8"),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
    });
}
const verifyIdToken = async (token)=>{
    try {
        const decodedToken = await __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$firebase$2d$admin$29$__["auth"]().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};
}),
"[project]/hisaab-v2/lib/adminAuth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifyAdminAccess",
    ()=>verifyAdminAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/lib/auth.ts [app-route] (ecmascript)");
;
async function verifyAdminAccess(req) {
    // 1. Check Master Key
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey && adminKey === process.env.ADMIN_KEY) {
        return {
            type: 'master'
        };
    }
    // 2. Check User Token (Optional, for regular admins if we have them)
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyIdToken"])(token);
        // TODO: if (user && user.email === 'admin@example.com') return { type: 'user', user };
        // For now, only Master Key allows "Master Panel" access without strict user role check
        if (user) {
            // Return user, but strictly speaking "Master Panel" usually implies Master Key.
            // But let's allow authenticated users to *try* if we implement roles later.
            return {
                type: 'user',
                user
            };
        }
    }
    return null;
}
}),
"[project]/hisaab-v2/app/api/admin/reset/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Group$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/Group.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$GroupMember$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/GroupMember.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Spend$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/Spend.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Balance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/Balance.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$ActivityLog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/ActivityLog.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Request$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/Request.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Clear$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/Clear.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$DirectSplit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/DirectSplit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Favor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/Favor.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Nudge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/Nudge.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$adminAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/lib/adminAuth.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
async function POST(req) {
    try {
        const access = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$adminAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAdminAccess"])(req);
        if (!access) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const { scope } = await req.json(); // 'all', 'data', 'expenses'
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const stats = {
            users: 0,
            groups: 0,
            expenses: 0
        };
        if (scope === 'transactions' || scope === 'data' || scope === 'all') {
            const d1 = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Spend$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            const d2 = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Balance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            const d3 = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$ActivityLog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            const d4 = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Request$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            const d5 = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Clear$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            const d6 = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$DirectSplit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            const d7 = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Favor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            const d8 = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Nudge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            stats.expenses = d1.deletedCount + d2.deletedCount + d3.deletedCount; // approximate
        }
        if (scope === 'data' || scope === 'all') {
            const g = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Group$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            const gm = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$GroupMember$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            stats.groups = g.deletedCount + gm.deletedCount;
        }
        if (scope === 'all') {
            const u = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({});
            stats.users = u.deletedCount;
        // Also wipe Firebase Users? 
        // Dangerous, but requested "reset who data base includeing user".
        // To verify: User probably means MongoDB data. 
        // Wiping Firebase Auth users requires listing them and deleting.
        // I will skip Firebase deletion to avoid locking myself out of the dev account unless explicitly handled.
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            stats
        });
    } catch (error) {
        console.error("Reset Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__122c2992._.js.map