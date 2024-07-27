"use client";

import MobileChatContent from '@/components/MobileChatContent';
import { NavigationBar } from '@/components/navigation-bar'
import { NewGroup } from '@/components/new-group'
import React from 'react'
import { FaSignalMessenger } from "react-icons/fa6";

const page = () => {
  return (
    <>
      <NavigationBar trigger={<NewGroup />} />
      <div className='hidden md:grid h-full max-w-56 text-center mx-auto place-content-center'>
        <FaSignalMessenger size={200} className='mx-auto text-primary-main' />
        <p className='text-sm mt-5 text-primary-main'>
          Welcome to signal messenger! Start a new chat or select an existing
          one to get started.
        </p>
      </div>
      <div className='md:hidden flex flex-col space-y-2'>
        <MobileChatContent />
      </div>
    </>
  )
}

export default page
