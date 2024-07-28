import React from 'react'
import { Id } from '../../convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useMutationHandler } from '@/hooks/use-mutation-handler'
import { useUser } from '@clerk/clerk-react'
import ChatHeader from './chat-header'

const ChatContent = ({ chatId }: { chatId: Id<"conversations"> }) => {

    const conversation = useQuery(api.conversation.get, { id: chatId });

    const messages = useQuery(api.messages.get, {
        id: chatId as Id<"conversations">
    });

    const members = conversation?.isGroup ? conversation?.otherMembers ?? [] : conversation?.otherMember ? [conversation.otherMember] : [];

    const { mutate: markAsRead, state: _ } = useMutationHandler(api.conversation.markAsRead);

    const { user } = useUser();

    if(!conversation){
        return null;
    }

    const chatAvatar = conversation?.otherMember?.imageUrl || '';

    const name = conversation?.isGroup ? conversation.name : conversation?.otherMember?.username || '';

    const status = conversation?.otherMember?.status || '';

    return (
        <div className='h-full flex'>
            <ChatHeader chatAvatar={chatAvatar} username={name!} isGroup={conversation?.isGroup} chatId={chatId} status={status} />
        </div>
    )
}

export default ChatContent
