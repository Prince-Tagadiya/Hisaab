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
"[project]/hisaab-v2/app/api/requests/[requestId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Request$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/Request.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$GroupMember$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/GroupMember.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/lib/auth.ts [app-route] (ecmascript)");
;
;
;
;
;
async function PATCH(req, { params }) {
    try {
        const { requestId } = await params;
        const { action } = await req.json(); // 'accept' or 'decline'
        if (![
            'accept',
            'decline'
        ].includes(action)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid action'
            }, {
                status: 400
            });
        }
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const token = authHeader.split('Bearer ')[1];
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyIdToken"])(token);
        if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const request = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$Request$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(requestId);
        if (!request) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Request not found'
            }, {
                status: 404
            });
        }
        // Verify ownership
        const isTarget = request.toUser.userId === user.uid || request.toUser.email === user.email;
        if (!isTarget) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Forbidden'
            }, {
                status: 403
            });
        }
        if (request.status !== 'pending') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Request already processed'
            }, {
                status: 400
            });
        }
        if (action === 'accept') {
            if (request.type === 'group_invite') {
                // Create Group Member
                // Check if already member
                const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$GroupMember$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
                    groupId: request.groupId,
                    userId: user.uid
                });
                if (!existing) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$GroupMember$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                        groupId: request.groupId,
                        userId: user.uid,
                        role: 'member'
                    });
                }
            }
            request.status = 'accepted';
        } else {
            request.status = 'declined';
        }
        await request.save();
        return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            status: request.status
        });
    } catch (error) {
        console.error("Update Request Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__594357fd._.js.map