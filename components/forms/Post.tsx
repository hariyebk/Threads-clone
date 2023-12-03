"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { postSchema } from "@/lib/validations/threads"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { usePathname, useRouter } from "next/navigation"
import { createThread } from "@/lib/actions/threads.actions"

export default function Post({userId}: {userId:  string}) {
    const pathname = usePathname()
    const router = useRouter() 
    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            thread: "",
            account_id: userId
        }
    })

    async function onSubmit(values: z.infer<typeof postSchema>) {
        await createThread({
            text: values.thread, 
            author: userId,
            communityId: null,
            path: pathname
        })
        router.push("/")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10 mt-10">
                {/* name */}
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col justify-start gap-3 w-full">
                    <FormLabel className='text-base-semibold text-light-2 justify-start'> Content 
                    </FormLabel>
                    <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 p-6">
                        <Textarea rows={15}  className='account-form_input' {...field}/>
                    </FormControl>
                    <FormMessage className='text-light-1 text-base-regular' />
                    </FormItem>
                )}
                />
                <Button type="submit" className="bg-primary-500 w-28 font-semibold text-light-2"> Post </Button>
            </form>
        </Form>

    )
}