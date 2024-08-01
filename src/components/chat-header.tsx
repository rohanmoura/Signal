'use client';

import { useIsDesktop } from '@/hooks/use-is-desktop';
import useSidebarWidth from '@/hooks/use-sidebar-width';
import { useQuery } from 'convex/react';
import React, { FC } from 'react'
import { api } from '../../convex/_generated/api';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import { ChevronLeft, Phone, Video } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import ProfileSheet from './profile-sheet';
import GroupSheet from './group-sheet';
import { useRouter } from 'next/navigation';

type props = {
    chatAvatar: string,
    username: string,
    isGroup: boolean,
    chatId: string,
    status: string;
}

const ChatHeader: FC<props> = ({
    chatAvatar, username, isGroup, chatId, status
}) => {

    const { sidebarWidth } = useSidebarWidth();
    const isDesktop = useIsDesktop();
    const conversations = useQuery(api.conversations.get);
    const groupInCommon = conversations?.filter(
        ({ conversation }) => conversation.isGroup
    )
    const router = useRouter()
    const videocall = () => {
        router.push(`/calls/${chatId}`);
    }

    return (
        <div className={cn('fixed bg-white dark:bg-gray-800 px-3 md:pr-10 flex items-center justify-between space-x-3 z-30 top-0 w-full h-20')} style={isDesktop ? { width: `calc(100% - ${sidebarWidth + 3}%)` } : {}}>
            <div className='flex space-x-3'>
                <div className='md:hidden'>
                    <Button asChild variant={"outline"} size={"icon"}>
                        <Link href={"/chats"}>
                            <ChevronLeft />
                        </Link>
                    </Button>
                </div>
                <Sheet>
                    <SheetTrigger className='flex items-center cursor-pointer space-x-4'>
                        <Avatar>
                            <AvatarImage src={chatAvatar} />
                            <AvatarFallback>
                                {username[0]}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className='font-bold text-lg'>{username}</h2>
                    </SheetTrigger>
                    <SheetContent className='bg-white dark:bg-black dark:text-white w-80 md:w-96'>
                        <GroupSheet chatId={chatId} groupName={username} /> : <ProfileSheet status={status} username={username} chatId={chatId} groupsInCommon={groupInCommon} chatAvatar={chatAvatar} />
                    </SheetContent>
                </Sheet>
            </div>
            <div className='flex items-center space-x-4'>
                <Video className='cursor-pointer' onClick={videocall} />
                <Phone className='cursor-pointer' onClick={videocall} />
            </div>
        </div>
    )
}

export default ChatHeader;