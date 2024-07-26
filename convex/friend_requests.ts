import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserDataById } from "./_utils";


export const get = query({
    args: {
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const cureentUser = await getUserDataById({
            ctx,
            clerkId: identity.subject,
        });
        if (!cureentUser) throw new Error("User not found");
        const friendRequests = await ctx.db.query("friend_requests").withIndex("by_receiver", q => q.eq("receiver", cureentUser._id)).collect();
        const requestWithSender = await Promise.all(friendRequests.map(async (request) => {
            const sender = await ctx.db.get(request.sender);
            if (!sender) {
                throw new ConvexError("Sender not found");
            };
            return { ...request, sender };
        }));

        return requestWithSender;
    }
})