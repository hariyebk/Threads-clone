import * as z from "zod"

export const onboardSchema = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(3, {message: "name is too short"}).max(30, {message: "name is too long"}),
    username: z.string().min(3, {
        message: "username is too short"
    }).max(30, {message: "username is too long"}),
    bio: z.string().min(3).max(1000)
})