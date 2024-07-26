'use client';

import { FC, ReactNode } from "react";
import { ClerkProvider, SignInButton, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Authenticated, ConvexReactClient, Unauthenticated } from "convex/react";

const CONVEX_URl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const convex = new ConvexReactClient(CONVEX_URl);

const ConvexClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <Authenticated>
                    {children}
                </Authenticated>
                <Unauthenticated>
                    <SignInButton />
                </Unauthenticated>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
};

export default ConvexClientProvider;