import { useMutationHandler } from '@/hooks/use-mutation-handler';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConvexError } from 'convex/values';
import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api } from '../../convex/_generated/api';
import { Form, FormControl, FormField } from './ui/form';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import useSidebarWidth from '@/hooks/use-sidebar-width';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Paperclip, Send, Smile } from 'lucide-react';
import Picker from "@emoji-mart/react";
import { useTheme } from 'next-themes';
import data from "@emoji-mart/data";
import TextAreaAutoSize from 'react-textarea-autosize';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { FilePond, registerPlugin } from "react-filepond";
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { Button } from './ui/button';
import { v4 as uuid } from "uuid";
import { supabaseBrowserClient } from '@/supabase/supabaseClient';
import { AudioRecorder } from "react-audio-voice-recorder";
import Pusher from "pusher-js";
import axios from "axios";

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

    const { resolvedTheme } = useTheme();

    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [imageOrPdf, setImageOrPdf] = useState<Blob | null>(null);
    const [imageOrPdfModalOpen, setImageOrPdfModalOpen] = useState(false);
    const [sendingFile, setSendingFile] = useState(false);

    registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

    const form = useForm<z.infer<typeof ChatMessageSchema>>({
        resolver: zodResolver(ChatMessageSchema),
        defaultValues: {
            content: ''
        }
    })

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusher.subscribe(chatId);

        channel.bind("typing", (
            data: {
                isTyping: boolean,
                userId: string
            }
        ) => {
            if (data.userId !== currentUserId) {
                setIsTyping(data.isTyping);
            }
        });
        return () => {
            pusher.unsubscribe(chatId);
        }
    }, [chatId, currentUserId])

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
        if (!typing) {
            setTyping(true);
            await axios.post('/api/type-indicator', {
                channel: chatId,
                event: "typing",
                data: { isTyping: true, userid: currentUserId },
            });
            setTimeout(() => {
                setTyping(false);
                axios.post('/api/type-indicator', {
                    channel: chatId,
                    event: "typing",
                    data: { isTyping: false, userid: currentUserId },
                });
            }, 2000)
        };
    }

    const handleImageUpload = async () => {
        const uniqueId = uuid();
        if (!imageOrPdf) return;
        setSendingFile(true);
        try {
            let filename;
            if (imageOrPdf.type.startsWith('image/')) {
                filename = `chat/image-${uniqueId}.jpg`
            } else if (imageOrPdf.type.startsWith('application/pdf')) {
                filename = `chat/pdf-${uniqueId}.pdf`
            } else {
                console.log("Unsupported file type");
                setSendingFile(false);
                return;
            }

            const file = new File([imageOrPdf], filename, { type: imageOrPdf.type });

            const { data, error } = await supabaseBrowserClient.storage.from("chat-files").upload(filename, file, {
                cacheControl: '3600',
                upsert: false
            });

            if (error) {
                console.log("Error uploading file: " + filename);
                setSendingFile(false);
                return;
            }

            const { data: {
                publicUrl
            } } = await supabaseBrowserClient.storage.from("chat-files").getPublicUrl(data.path);

            await createMessage({
                conversationId: chatId,
                type: imageOrPdf.type.startsWith('image/') ? 'image' : 'pdf',
                content: [publicUrl],
            })

            setSendingFile(false);
            setImageOrPdfModalOpen(false);

        } catch (error) {
            setSendingFile(false);
            setImageOrPdfModalOpen(false);
            console.log(error);
            toast.error("Error uploading file");
        }
    };


    const addAudioElement = async (blob: Blob) => {
        try {
            const uniqueId = uuid();
            const file = new File([blob], 'adio.webm', { type: blob.type });
            const fileName = `chat/audio-${uniqueId}`;

            const { data, error } = await supabaseBrowserClient.storage
                .from('chat-files')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.log('Error uploading audio: ', error);
                toast.error('Failed to upload audio, please try again');
                return;
            }

            const {
                data: { publicUrl },
            } = await supabaseBrowserClient.storage.from('chat-files').getPublicUrl(data.path);

            await createMessage({
                conversationId: chatId,
                type: 'audio',
                content: [publicUrl],
            });

        } catch (error) {
            console.error("Error uploading audio: ", error);
            toast.error("Error uploading audio");
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
                            {isTyping && <p className='text-xs ml-1'>typing...</p>}
                        </>
                    </FormControl>
                )} />
                <Send className='cursor-pointer' onClick={async () => form.handleSubmit(createMessagehandler)()} />

                <Dialog open={imageOrPdfModalOpen} onOpenChange={() => setImageOrPdfModalOpen(!imageOrPdfModalOpen)} >
                    <DialogTrigger>
                        <Paperclip className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='min-w-80'>
                        <DialogHeader>
                            <DialogTitle>Upload PDF / IMG</DialogTitle>
                            <DialogDescription>📁 Upload</DialogDescription>
                        </DialogHeader>

                        <FilePond className={"cursor-pointer"} files={imageOrPdf ? [imageOrPdf] : []} allowMultiple={false} acceptedFileTypes={['image/*', 'application/pdf']} labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>' onupdatefiles={fileItems => {
                            setImageOrPdf(fileItems[0]?.file ?? null);
                        }} />

                        <DialogFooter>
                            <Button onClick={handleImageUpload} type="button" disabled={sendingFile}>
                                Send
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {isDesktop && <AudioRecorder onRecordingComplete={addAudioElement} audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true
                }}
                    downloadFileExtension="webm"
                />}
            </form>
        </Form>
    )
}

export default ChatFooter
