"use client";
import { NavigationBar } from '@/components/navigation-bar';
import { NewGroup } from '@/components/new-group';
import React from 'react'

const page = () => {
    return (
        <>
            <div className='hidden md:block'>
                <NavigationBar trigger={<NewGroup />} />
            </div>
        </>
    )
}

export default page
