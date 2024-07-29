import { FC } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import Link from "next/link";

type props = {
    type: string;
    content: string[];
}

export const ChatTypeContent: FC<props> = ({
    type, content
}) => {
    return (
        <AspectRatio ratio={1 / 1}>
            {type === 'image' && (
                <Image
                    src={content[0]}
                    alt='file'
                    width={450}
                    height={235}
                    className='rounded-md object-cover'
                />
            )}
            {type === 'audio' && (
                <audio src={content[0]} controls className='w-full h-full' />
            )}
            {type === 'pdf' && (
                <Link
                    href={content[0]}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='bg-purple-500'
                >
                    <p className='underline'>PDF Document</p>
                </Link>
            )}
        </AspectRatio>

    )
}