"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button"
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
const STYLES = ["AIDA", "BAB", "HSO"] as const;
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  topic: z.string(),
  companyInfo: z.string().max(2000, {
    message: "Max character limit of 2000 characters"
  }),
  style: z.enum(STYLES)
})
export default function Home() {
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
    <div className="grid grid-rows-3 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" w-96 space-y-4">
           
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
                  <FormLabel>Company Info / Target Market</FormLabel>
                  <FormControl>
                    <Textarea className="w-full" placeholder="A bit about your company" {...field} />
                  </FormControl>
                  <FormDescription>
                    A bit about your company / Target Market
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
                  <FormLabel>Copy Writing Styles, view them <Link href="https://drive.google.com/file/d/1rbKlglpUQBlCWDq7YGpwY64u4VhZsqHs/view" target="_blank">here</Link></FormLabel>
                  <Select  onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </main>
    </div >
  );
}
