import React from 'react'
import SidebarContainer from './sidebar-container'
import { ChatList } from './chat-list'

const ChatSidebar = () => {
  return (
    <div>
      <SidebarContainer title='chats' trigger={<></>}>
        <ChatList />
      </SidebarContainer>
    </div>
  )
}

export default ChatSidebar
