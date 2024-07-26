import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        status: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
    })
        .index("by_email", ['email'])
        .index("by_clerk_id", ['clerkId']),
})