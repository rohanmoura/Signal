"use client";

import React, { FC } from 'react'
import SharedLayout from './shared-layout'
import ChatSidebar from './chat-sidebar';

type props = {
    children: React.ReactNode
}

const ChatLayout: FC<props> = ({ children }) => {
    return (
        <SharedLayout SideBarComponent={() => <ChatSidebar />}>
            {children}
        </SharedLayout>
    )
}

export default ChatLayout
