"use client"
import { commentSchema } from "@/lib/validations/threads";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { AddCommentToThread } from "@/lib/actions/threads.actions";
import { usePathname } from "next/navigation";

interface COMMENTPROPS {
    postId: string,
    userId: string,
    image: string
}
export default function Comment({postId, userId, image}: COMMENTPROPS) {
    const pathname = usePathname()
    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            thread: "",
            account_id: userId
        }
    })

    async function onSubmit(values: z.infer<typeof commentSchema>) {
        await AddCommentToThread({threadId: postId, userId: JSON.parse(userId), comment: values.thread, pathname})
        // clear the input.
        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="flex flex-1 justify-between items-center  w-full">
                    <FormLabel>
                        <Image src={image} alt="profile-image" width={48} height={48} className="rounded-full object-cover"/>
                    </FormLabel>
                    <FormControl className="border-none bg-transparent">
                        <Input type='text'
                        className = "no-focus text-light-2 mx-3" placeholder='Add a comment' {...field} />
                    </FormControl>
                    </FormItem>
                )}
                />
                <Button type="submit" className="comment-form_btn"> Reply </Button>
            </form>
        </Form>
    )
}
