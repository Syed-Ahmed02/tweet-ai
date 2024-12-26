"use client"
import React, { useState } from 'react'
import { Checkbox } from './ui/checkbox'
import { Button } from "@/components/ui/button"
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
import { Input } from './ui/input';
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

const STYLES = ["Casual", "Academic", "Funny", "Other"] as const;
const TARGETAUDIENCE = ["Beginner", "Knowledgeable", "Academic","Other"] as const;

const formSchema = z.object({
    topic: z.string().min(1, "Please enter what you learned"),
    style: z.enum(STYLES).or(z.string().min(1,"Please set a custom style")),
    target: z.enum(TARGETAUDIENCE).or(z.string().min(1,"Please set a custom Target Audience")),
    generateImage: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

const TweetGenerator = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedTweet, setGeneratedTweet] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [customStyle,setCustomStyle] = useState("")
    const [customTargetAudience, setCustomTargetAudience] = useState("")

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            style: "Casual",
            target: "Beginner",
            generateImage: false,
        },
    });

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
        } catch (error) {
            throw new Error(`An error occurred calling the Dall-E API: ${error}`);
        }
    };

    const generateTweetAndImage = async (values: FormValues) => {
        setLoading(true);
        setGeneratedTweet("");
        setImageUrl("");
        setError('');

        if(values.style === "Other"){
            values.style=customStyle
        }

        if (values.target === "Other"){
            values.style=customTargetAudience
        }

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
            let generatedTweetContent = body.text?.replace(/#[\w]+/g, '');
            setGeneratedTweet(generatedTweetContent);

            if (values.generateImage && generatedTweetContent) {
                await getImageData(generatedTweetContent);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to generate tweet or image');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: FormValues) => {
        await generateTweetAndImage(values);
        form.reset({
            topic: "",
            style: "Casual",
            target: "Beginner",
            generateImage: false
        });
        setCustomStyle("")
        setCustomTargetAudience("")
    };

    return (
        <div className="w-3/4 lg:w-2/4 rounded-md shadow-lg p-4 border border-black space-y-8">
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
                                    Tell me a bit about what you learned today
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Do you want your post to be casual, academic, or funny?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Casual" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {STYLES.map((style) => (
                                            <SelectItem key={style} value={style}>{style}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    {field.value === "Other" && <Input placeholder="enter your own style!" value={customStyle} onChange={(e) => setCustomStyle(e.target.value)} />}

                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="target"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>How knowledgeable is the target audience about the subject?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Beginner" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {TARGETAUDIENCE.map((audience) => (
                                            <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    {field.value === "Other" && 
                                        <Input 
                                            placeholder="enter your own target audience!"
                                            value={customTargetAudience} 
                                            onChange={(e) => setCustomTargetAudience(e.target.value)} 
                                        />}

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
                                <FormControl>
                                    <Checkbox
                                        id="generateImage"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
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
            {error && <p className="text-red-500">An error occurred: {error}</p>}
            {generatedTweet && <TweetCard text={generatedTweet} imageUrl={imageUrl} />}
        </div>
    )
}

export default TweetGenerator

