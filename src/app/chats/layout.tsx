import ChatLayout from '@/components/chat-layout'
import React, { FC } from 'react'

const layout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <div className='hidden md:flex md:ml-24 px-2 md:px-0 h-dvh'>
                <ChatLayout>
                    {children}
                </ChatLayout>
            </div>
            <div className='md:hidden my-20 md:px-2'>
                {children}
            </div>
        </>
    )
}

export default layout
