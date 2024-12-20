"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { useChat } from 'ai/react';
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
import Link from "next/link";
import {
    CloudUpload,
    Paperclip
} from "lucide-react"
import {
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem
} from "@/components/ui/file-upload"
import TweetCard from './TweetCard';

const STYLES = ["AIDA", "BAB", "HSO"] as const;
const formSchema = z.object({
    topic: z.string(),
    companyInfo: z.string(),
    style: z.enum(STYLES)
})

const TweetGenerator = () => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedTweet, setGeneratedTweet] = useState("");

    const dropZoneConfig = {
        accept: {
            "application/pdf": [".pdf"],
        },
        maxFiles: 3,
        maxSize: 1024 * 1024 * 4, multiple: true,
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            companyInfo: "",
            style: "AIDA",
        },
    })





    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        //ADd error
        setLoading(true)
        setError('');
        const submissionData = {
            ...values,
            files: files
        };
        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                body: JSON.stringify(submissionData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const body = await res.json();
            console.log(body);
            let generatedTweetContent = body.text;
            generatedTweetContent = generatedTweetContent?.replace(/#[\w]+/g, '');
            setGeneratedTweet(generatedTweetContent);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to generate tweet');
        } finally {
            form.reset({
                topic: "",
                companyInfo: "",
                style: "AIDA",
            });
            setLoading(false);
            setFiles(null);
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
                                <FormLabel>Topic</FormLabel>
                                <FormControl>
                                    <Textarea className="w-full" placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    What do you want to write about?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="companyInfo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select File</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={files}
                                        onValueChange={setFiles}
                                        dropzoneOptions={dropZoneConfig}
                                        className="relative bg-background rounded-lg p-2"
                                    >
                                        <FileInput
                                            id="fileInput"
                                            className="outline-dashed outline-1 outline-slate-500"
                                        >
                                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                <CloudUpload className='text-gray-500 w-10 h-10' />
                                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">Click to upload</span>
                                                    &nbsp; or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    SVG, PNG, JPG or GIF
                                                </p>
                                            </div>
                                        </FileInput>
                                        <FileUploaderContent>
                                            {files &&
                                                files.length > 0 &&
                                                files.map((file, i) => (
                                                    <FileUploaderItem key={i} index={i}>
                                                        <Paperclip className="h-4 w-4 stroke-current" />
                                                        <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                        </FileUploaderContent>
                                    </FileUploader>
                                </FormControl>
                                <FormDescription>Select a file to upload.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem className=''>
                                <FormLabel>Copy Writing Styles, view them <Link href="https://drive.google.com/file/d/1rbKlglpUQBlCWDq7YGpwY64u4VhZsqHs/view" target="_blank">here</Link></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="AIDA" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="AIDA" >AIDA</SelectItem>
                                        <SelectItem value="BAB">BAB</SelectItem>
                                        <SelectItem value="HSO">HSO</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Copywriting style!
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            </Form>
            {loading ? <h2>true</h2> : <h2>false</h2>}
            {generatedTweet && <TweetCard content={generatedTweet} />}
        </div>

    )
}

export default TweetGenerator