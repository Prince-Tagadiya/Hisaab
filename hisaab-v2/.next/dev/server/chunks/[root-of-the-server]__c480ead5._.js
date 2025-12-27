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
"[project]/hisaab-v2/app/api/requests/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hisaab-v2/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../../../lib/db'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../../models/Request'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '../../../../lib/auth'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
async function GET(req) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = await verifyIdToken(token);
        if (!decoded) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid Token'
            }, {
                status: 401
            });
        }
        await dbConnect();
        // Fetch pending requests for this user (by UID or Email)
        const requests = await Request.find({
            $or: [
                {
                    'toUser.userId': decoded.uid
                },
                {
                    'toUser.email': decoded.email
                }
            ],
            status: 'pending'
        }).sort({
            createdAt: -1
        });
        // Separate them for frontend convenience
        const friendRequests = requests.filter((r)=>r.type === 'friend').map((r)=>({
                id: r._id.toString(),
                fromUid: r.fromUser.userId,
                fromName: r.fromUser.name,
                fromEmail: r.fromUser.email,
                fromPhotoURL: r.fromUser.photoURL
            }));
        const groupInvites = requests.filter((r)=>r.type === 'group_invite').map((r)=>({
                id: r._id.toString(),
                groupId: r.groupId,
                groupName: r.groupName,
                fromName: r.fromUser.name,
                groupDetails: {
                    type: 'Group'
                } // Could fetch actual Group details if needed
            }));
        // SEED DATA FOR DEMO IF EMPTY (To satisfy "make with real data" request immediately for testing)
        // Only if query param seed=true? No, let's strictly serve DB data.
        // If empty, frontend shows empty state.
        return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            friendRequests,
            groupInvites
        });
    } catch (error) {
        console.error("API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        const decoded = await verifyIdToken(token);
        if (!decoded) return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid Token'
        }, {
            status: 401
        });
        const body = await req.json();
        const { requestId, action } = body; // action: 'accepted' | 'declined'
        await dbConnect();
        if (action === 'accepted' || action === 'declined') {
            await Request.findByIdAndUpdate(requestId, {
                status: action
            });
        // Logic to actually Add Friend or Join Group would go here
        // For now, just updating status is enough to remove it from "Pending" list
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$hisaab$2d$v2$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c480ead5._.js.map