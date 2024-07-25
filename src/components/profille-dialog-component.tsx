"use client";
import { useTheme } from 'next-themes';
import React, { useState } from 'react'
import { Card, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Handshake, LaptopMinimal, Pencil, Sun, SunMoon, UserRound, UserRoundSearch } from 'lucide-react';
import { z } from 'zod';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"


const statuses = [
    '👋 Speak Freely',
    '🤐 Encrypted',
    '👍🏻 Free to chat',
    '👨🏼‍💻 Coding',
    '📴 Taking a break',
];

const addFriendFormSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email(),
})

const ProfileDialogContent = () => {

    const [updateStatusDialog, setUpdateStatusDialog] = useState(false);
    const [status, setStatus] = useState("");
    const { setTheme } = useTheme();
    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues: {
            email: '',
        }
    })
    async function onSubmit({ email }: z.infer<typeof addFriendFormSchema>) {
        console.log(email);
    }

    return (
        <div>
            <Card className='border-0 flex  flex-col space-y-4'>
                <CardTitle>
                    Profile
                </CardTitle>
                <div>
                    <Avatar className='h-20 w-20 mx-auto'>
                        <AvatarImage src='https://github.com/shadcn.png' />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                </div>
            </Card>

            <div className='flex flex-col gap-y-6'>
                <div className='flex items-center space-x-2'>
                    <UserRound />
                    <Input placeholder='Name' value={"User Name"} disabled className='border-none outline-none ring-0' />
                </div>
                <Separator />
                <div className='flex items-center justify-center space-x-5'>
                    <p>Manage your account</p>
                    <button>
                        User Button
                    </button>
                </div>
                <Separator />

                <Dialog>
                    <DialogTrigger>
                        <div className='flex items-center space-x-2'>
                            <UserRoundSearch />
                            <p>
                                Send Friend Request
                            </p>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <Form {...form}>
                            <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField control={form.control} name='email' render={({ field }) => <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={true} placeholder='friend@email.com' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your friend's email to send a friend request.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>} />
                                <Button disabled={true} type="submit">
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
                <Separator />

                <Dialog>
                    <DialogTrigger>
                        <div className='flex items-center space-x-2'>
                            <Handshake />
                            <p>View friend requests</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <p className='text-xl text-center font-bold'>
                            No friend request yet
                        </p>
                    </DialogContent>
                </Dialog>
                <Separator />

                <Dialog open={updateStatusDialog} onOpenChange={() => setUpdateStatusDialog(!updateStatusDialog)}>
                    <DialogTrigger>
                        <div className='flex items-center space-x-2'>
                            <Pencil />
                            <p>Display current status</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <Textarea placeholder='Display Current Status' className='resize-none h-48' value={status} onChange={(e) => setStatus(e.target.value)} />
                        <div>
                            {statuses.map((status) => (
                                <p key={status} className='px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer' onClick={() => setStatus(status)}>
                                    {status}
                                </p>
                            ))}
                        </div>
                        <Button className='ml-auto w-fit bg-primary-main' disabled type='button'>
                            Update status
                        </Button>
                    </DialogContent>
                </Dialog>
                <Separator />

                <ToggleGroup type='single' variant={"outline"}>
                    <ToggleGroupItem onClick={() => setTheme("light")} value='light' className='flex space-x-3'>
                        <Sun />
                        <p>
                            Light
                        </p>
                    </ToggleGroupItem>
                    <ToggleGroupItem onClick={() => setTheme("dark")} value='dark' className='flex space-x-3'>
                        <SunMoon />
                        <p>
                            Dark
                        </p>
                    </ToggleGroupItem>
                    <ToggleGroupItem onClick={() => setTheme("system")} value='system' className='flex space-x-3'>
                        <LaptopMinimal />
                        <p>
                            System
                        </p>
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    )
}

export default ProfileDialogContent
