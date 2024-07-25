"use client";

import { usePathname } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import useSidebarWidth from '@/hooks/use-sidebar-width';

type props = {
    children: React.ReactNode;
    SideBarComponent: FC<any>;
    sideBarProps?: any;
}

const SharedLayout: FC<props> = ({
    children, SideBarComponent, sideBarProps
}) => {

    const [isRenderd, setIsRendered] = useState(false);
    const pathName = usePathname();
    const { setSidebarWidth, sidebarWidth } = useSidebarWidth();

    useEffect(() => {
        setIsRendered(true);
    }, []);

    if (!isRenderd) {
        return null;
    }

    return (
        <>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel onResize={width => setSidebarWidth(width)} defaultSize={sidebarWidth} maxSize={40} minSize={20}>
                    <SideBarComponent {...sideBarProps} />
                </ResizablePanel>
                <ResizableHandle className='border-r border-r-gray-400 dark:border-r-gray-800' withHandle />
                <ResizablePanel className='overflow-y-auto my-20' >
                    <div className='h-full hidden md:block'>
                        {children}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            <div className='md:hidden'>
                {children}
            </div>
        </>

    )
}

export default SharedLayout
