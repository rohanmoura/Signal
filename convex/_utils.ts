import { QueryCtx, MutationCtx } from './_generated/server';

export const getUserDataById = async ({
  ctx,
  clerkId,
}: {
  ctx: QueryCtx | MutationCtx;
  clerkId: string;
}) =>
  ctx.db
    .query('users')
    .withIndex("by_clerk_id", q => q.eq('clerkId', clerkId))
    .unique();