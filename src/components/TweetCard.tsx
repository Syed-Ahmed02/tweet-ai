"use client"
import { useState } from 'react';
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button';
import Image from 'next/image';
interface TweetCardProps {
    text: string;
    imageUrl?: string;
}


const TweetCard: React.FC<TweetCardProps> = ({ text, imageUrl }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 1000);
        } catch (err) {
            console.error(err);
        }
    };

    // return (
    //   <button onClick={() => copyToClipboard("Copy")}>
    //     {isCopied ? "Copied!" : "Copy"}
    //   </button>
    // );
    return (
        <Card>
            <CardHeader className='flex flex-row justify-between items-end'>
                <div>
                    <CardTitle>Post</CardTitle>
                    <CardDescription>Here is the generated Post</CardDescription>
                </div>
                <Button variant="outline" className='mt-0' onClick={() => copyToClipboard(text)}>{isCopied ? "Copied!" : "Copy"}</Button>
            </CardHeader>
            <CardContent className='flex flex-col space-y-2'>
                <p className='text-md'>{text}</p>
                {imageUrl && <Image src={imageUrl} height={300} width={300} alt="generated image" />}
            </CardContent>

        </Card>

    )
}

export default TweetCard