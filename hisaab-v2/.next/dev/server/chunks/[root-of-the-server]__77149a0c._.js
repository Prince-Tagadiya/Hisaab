module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/hisaab-v2/lib/db.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/hisaab-v2/lib/auth.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/hisaab-v2/models/User.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/hisaab-v2/pages/api/auth/login.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/lib/db.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/lib/auth.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$User$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/models/User.ts [api] (ecmascript)");
;
;
;
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method Not Allowed'
        });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Missing or invalid token'
        });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["verifyIdToken"])(token);
    if (!decoded) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"])();
    try {
        // Sync Firebase User to MongoDB
        // We use findOneAndUpdate with upsert to creating if not exists
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$models$2f$User$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
            firebaseUid: decoded.uid
        }, {
            email: decoded.email,
            displayName: decoded.name || 'User',
            photoURL: decoded.picture || '',
            updatedAt: new Date()
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });
        const isNewUser = !user.username || !user.firstName;
        return res.status(200).json({
            success: true,
            user,
            isNewUser
        });
    } catch (error) {
        console.error("Login API Error:", error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__77149a0c._.js.map