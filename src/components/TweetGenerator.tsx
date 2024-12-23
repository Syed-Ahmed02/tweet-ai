"use client"
import React from 'react'
import { Checkbox } from './ui/checkbox'
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { Skeleton } from './ui/skeleton';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea";

import TweetCard from './TweetCard';

const STYLES = ["Casual", "Academic", "Funny"] as const;
const TARGETAUDIENCE = ["Beginner", "Knowledagble", "Academic"] as const
const formSchema = z.object({
    topic: z.string(),
    style: z.enum(STYLES),
    target: z.enum(TARGETAUDIENCE),
    generateImage: z.boolean().default(false)
})

const TweetGenerator = () => {
    // const [files, setFiles] = useState<File[] | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedTweet, setGeneratedTweet] = useState("");
    const [generateImage, setGenerateImage] = useState(false);
    const [imageUrl, setImageUrl] = useState("")
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            style: "Casual",
            target: "Beginner",
            generateImage: false,
        },
    })

    const getImageData = async (prompt: string) => {
        try {
            const res = await fetch('/api/openai/dall-e', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const { imageUrl } = await res.json();
            setImageUrl(imageUrl);
            setError('');
        } catch (error) {
            setError(`An error occurred calling the Dall-E API: ${error}`);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        //ADd error
        setGeneratedTweet("");
        setImageUrl("")
        setLoading(true)
        setError('');
        console.log("Generate Image:", values.generateImage)
        setGenerateImage(values.generateImage)
        try {
            const res = await fetch("/api/gemini/text", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const body = await res.json();
            let generatedTweetContent = body.text;
            generatedTweetContent = generatedTweetContent?.replace(/#[\w]+/g, '');
            setGeneratedTweet(generatedTweetContent);

            if (generateImage && generatedTweetContent) {
                getImageData(generatedTweetContent).then();
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to generate tweet');
        } finally {
            form.reset({
                topic: "",
                style: "Casual",
                target: "Beginner"
            });
        }

    }
    return (
        <div className="w-96 rounded-md shadow-lg p-4 border border-black space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What did you learn</FormLabel>
                                <FormControl>
                                    <Textarea className="w-full" placeholder="Today I learnt the importance of knowledge" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Tell me a bit about what you learnt today
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem className=''>
                                <FormLabel>Do you want your post to be casual, academic, or funny?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Casual" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Casual" >Casual</SelectItem>
                                        <SelectItem value="Academic">Academic</SelectItem>
                                        <SelectItem value="Funny">Funny</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="target"
                        render={({ field }) => (
                            <FormItem className=''>
                                <FormLabel>How Knowledagble is the target audience about the subject?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Beginner" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Beginner" >Beginner</SelectItem>
                                        <SelectItem value="Knowledagble">Knowledagble</SelectItem>
                                        <SelectItem value="Academic">Academic</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="generateImage"
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-center space-x-2 space-y-0'>
                                <FormControl className="">
                                    <Checkbox id="generateImage" checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel
                                    htmlFor="generateImage"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Generate Image
                                </FormLabel>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            </Form>
            {loading && <Skeleton className='w-full h-64' />}
            {error && <p>ann error occured {error}</p>}
            {generatedTweet && <TweetCard text={generatedTweet} imageUrl={imageUrl} />}
        </div>

    )
}

export default TweetGenerator