import { useMutationHandler } from '@/hooks/use-mutation-handler';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConvexError } from 'convex/values';
import React, { ChangeEvent, FC } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api } from '../../convex/_generated/api';
import { Form, FormControl, FormField } from './ui/form';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import useSidebarWidth from '@/hooks/use-sidebar-width';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Send, Smile } from 'lucide-react';
import Picker from "@emoji-mart/react";
import { useTheme } from 'next-themes';
import data from "@emoji-mart/data";
import TextAreaAutoSize from 'react-textarea-autosize';


type props = {
    chatId: string;
    currentUserId: string;
}

const ChatMessageSchema = z.object({
    content: z.string().min(1, {
        message: 'Message must be at least 1 character long',
    })
})

const ChatFooter: FC<props> = ({
    chatId, currentUserId
}) => {

    const { mutate: createMessage, state: createMessageState } = useMutationHandler(api.message.create);

    const isDesktop = useIsDesktop();
    const { sidebarWidth } = useSidebarWidth();

    const { resolvedTheme } = useTheme()

    const form = useForm<z.infer<typeof ChatMessageSchema>>({
        resolver: zodResolver(ChatMessageSchema),
        defaultValues: {
            content: ''
        }
    })

    const createMessagehandler = async ({
        content,
    }: z.infer<typeof ChatMessageSchema>) => {
        if (!content || content.length < 1) return;
        try {
            await createMessage({
                conversationId: chatId,
                type: 'text',
                content: [content],
            });
        } catch (error) {
            console.log(error);
            toast.error(
                error instanceof ConvexError ? error.data : 'An error occurred'
            );
        }
    };

    const handleInputChange = async (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value, selectionStart } = event.target;
        if (selectionStart !== null) {
            form.setValue("content", value)
        }
    }

    return (
        <Form {...form}>
            <form style={isDesktop ? { width: `calc(100% - ${sidebarWidth + 3}%)` } : {}} className='fixed px-3 md:pr-10 flex items-center justify-between space-x-3 z-30 bottom-0 w-full bg-white dark:bg-gray-800 h-20' onSubmit={form.handleSubmit(createMessagehandler)}>
                <Popover>
                    <PopoverTrigger>
                        <button type="button">
                            <Smile size={20} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className='w-fit p-0'>
                        <Picker theme={resolvedTheme} data={data} onEmojiSelect={(emoji: any) => form.setValue("content", `${form.getValues("content")}${emoji.native}`)} />
                    </PopoverContent>
                </Popover>

                <FormField control={form.control} name='content' render={({ field }) => (
                    <FormControl>
                        <>
                            <TextAreaAutoSize onKeyDown={async (e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    await form.handleSubmit(createMessagehandler)();
                                }
                            }} rows={1} maxRows={2} {...field} disabled={createMessageState === "loading"} placeholder='Type a message' onChange={handleInputChange} className='flex-grow bg-gray-200 dark:bg-gray-600 rounded-2xl resize-none px-4 p-2 ring-0 focus:ring-0 focus:outline-none outline-none'
                            />
                            <>typing...</>
                        </>
                    </FormControl>
                )} />
                <Send className='cursor-pointer' onClick={async () => form.handleSubmit(createMessagehandler)()} />
            </form>
        </Form>
    )
}

export default ChatFooter
