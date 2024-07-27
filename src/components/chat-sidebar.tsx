import React from 'react'
import SidebarContainer from './sidebar-container'
import { ChatList } from './chat-list'
import { NewGroup } from './new-group'

const ChatSidebar = () => {
  return (
    <div>
      <SidebarContainer title='chats' trigger={<NewGroup />}>
        <ChatList />
      </SidebarContainer>
    </div>
  )
}

export default ChatSidebar;
