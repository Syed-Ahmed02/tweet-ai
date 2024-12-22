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
interface TweetCardProps {
    content: string;
}

const TweetCard: React.FC<TweetCardProps> = ({ content }) => {
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
            <CardHeader>
                <CardTitle>Thread</CardTitle>
                <CardDescription>Here is the generated Thread</CardDescription>
                <Button className='outline' onClick={() => copyToClipboard(content)}>{isCopied ? "Copied!" : "Copy"}</Button>
            </CardHeader>
            <CardContent>
                <p>{content}</p>
            </CardContent>

        </Card>

    )
}

export default TweetCard