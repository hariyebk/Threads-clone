import * as z from "zod"

export const postSchema = z.object({
    thread: z.string().nonempty(),
    account_id: z.string()
})

export const commentSchema = z.object({
    thread: z.string().nonempty(),
    account_id: z.string()
})