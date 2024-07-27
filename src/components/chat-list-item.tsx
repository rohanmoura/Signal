import { cn, getFormattedTimestamp } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

type props = {
    name: string;
    lastMessageContent: string | undefined;
    lastMessageSender: string | undefined;
    timestamp: number | undefined;
    avatarUrl: string;
    isActive: boolean;
    chatId: string;
    unseenMessageContent: number | undefined;
}

const CHatListItem: FC<props> = ({
    name, lastMessageContent, lastMessageSender, timestamp, avatarUrl, isActive, chatId, unseenMessageContent
}) => {
    return (
        <Link href={`/chats/${chatId}`} className={cn("p-3 rounded-2xl flex justify-between", {
            "bg-gray-200 dark:bg-gray-800": isActive
        })}>
            <div className="flex space-x-3">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>
                        {name[0]}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <h2 className="font-bold">{name}</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-400">{lastMessageContent}</p>
                </div>
            </div>
            <div className="flex flex-col items-end justify-between
            ">
                <p className="text-sm">
                    {timestamp && getFormattedTimestamp(timestamp)}
                </p>
                {
                    unseenMessageContent && unseenMessageContent > 0 ? (
                        <Badge className="text-gray-500" variant={"secondary"}>
                            {unseenMessageContent}
                        </Badge>
                    ) : null
                }
            </div>
        </Link>
    )
}

export default CHatListItem;