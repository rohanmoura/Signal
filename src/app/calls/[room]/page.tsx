"use client";

import { MeetingRoom } from '@/components/meeting-room';
import { NavigationBar } from '@/components/navigation-bar';
import React, { FC } from 'react'

const Room: FC<{
    params: {
        room: string;
    }
}> = ({ params: { room } }) => {
    return (
        <>
            <NavigationBar trigger={null} />
            <MeetingRoom chatId={room} />
        </>
    )
}

export default Room
