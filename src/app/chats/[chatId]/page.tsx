"use client";
import { NavigationBar } from '@/components/navigation-bar';
import { NewGroup } from '@/components/new-group';
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';
import ChatContent from '@/components/chat-content';

const page = ({
    params: { chatId }
}: { params: { chatId: Id<"conversations"> } }) => {
    return (
        <>
            <div className='hidden md:block'>
                <NavigationBar trigger={<NewGroup />} />
            </div>
            <ChatContent chatId={chatId} />
        </>
    )
}

export default page
