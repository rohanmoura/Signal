import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { api } from "../../convex/_generated/api";
import CHatListItem from "./chat-list-item";

type props = {

}

export const ChatList: FC<props> = () => {
    const pathname = usePathname();
    const chatId = pathname.split('/').pop();

    const conversations = useQuery(api.conversations.get);

    console.log(conversations);


    const groupMessages = conversations?.filter(msg => msg.conversation.isGroup);

    const directMessages = conversations?.filter(msg => !msg.conversation.isGroup);

    const hasConversations =
        (groupMessages && groupMessages.length > 0) ||
        (directMessages && directMessages.length > 0);

    return (
        <div className="flex flex-col space-y-2">
            {!hasConversations ? <div className="text-center text-gray-500">
                No conversations found
            </div> : (
                <>
                    {directMessages && directMessages.length > 0 ? (
                        directMessages.map(({conversation, otherMember, unseenCount, lastMessage}) => <CHatListItem key={conversation._id} name={otherMember?.username || ''} lastMessageContent={lastMessage?.lastMessageContent || ''} avatarUrl={otherMember?.imageUrl || ''} chatId={conversation._id} isActive={chatId === conversation._id} lastMessageSender={lastMessage?.lastMessageSender} timestamp={lastMessage?.lastMessageTimestamp} unseenMessageContent={unseenCount}/>)
                    ) : (
                        null
                    )}
                    {groupMessages && groupMessages.length > 0 ? (
                        groupMessages.map(({conversation, otherMember, unseenCount, lastMessage}) => <CHatListItem key={conversation._id} name={conversation.name || ''} lastMessageContent={lastMessage?.lastMessageContent || ''} avatarUrl={''} chatId={conversation._id} isActive={chatId === conversation._id} lastMessageSender={lastMessage?.lastMessageSender} timestamp={lastMessage?.lastMessageTimestamp} unseenMessageContent={unseenCount}/>)
                    ) : (
                        null
                    )}
                </>
            )}
        </div>
    )
}