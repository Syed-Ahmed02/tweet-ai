"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { useState } from 'react'
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
import { Input } from "@/components/ui/input"
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


const STYLES = ["AIDA", "BAB", "HSO"] as const;
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    topic: z.string(),
    companyInfo: z.string(),

    style: z.enum(STYLES)
})

const TweetGenerator = () => {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        accept: {
            "application/pdf": [".pdf"],
        },
        maxFiles: 5,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            topic: "",
            companyInfo: "",
            style: "AIDA",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        form.reset();
    }
    return (
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
                            <FormLabel>Upload file about your company</FormLabel>
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
                <Button className='w-full' type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default TweetGenerator