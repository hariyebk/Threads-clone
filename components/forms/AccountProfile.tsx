"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription} from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { onboardSchema } from "@/lib/validations/user"
import { Input } from "../ui/input"
import Image from "next/image"
import { ChangeEvent, useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { isBase64Image } from "@/lib/utils"
import {useUploadThing} from "../../lib/uploadThing"


interface USER_DATA {
    user: {
        id: string | undefined,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string
    },
    btnTitle: string
}
export default function AccountProfile({user, btnTitle}: USER_DATA) {
    const [files, setFiles] = useState<File[]>([])
    const {startUpload} = useUploadThing("media")
    const form = useForm<z.infer<typeof onboardSchema>>({
        resolver: zodResolver(onboardSchema),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user.bio || ""
        },
    })

    function handleImage(e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void){
        e.preventDefault()
        const fileReader = new FileReader()
        if(e.target.files && e.target.files?.length > 0){
            const file = e.target.files[0]
            // set the file state by converting FileList into an array
            setFiles(Array.from(e.target.files))
            if(!file.type.includes("image")) return
            // this event handler runs when the user chooses an image from his computer
            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || ""
                fieldChange(imageDataUrl)
            }
            fileReader.readAsDataURL(file)
        }
    }

    async function onSubmit(values: z.infer<typeof onboardSchema>) {
        const blob = values.profile_photo 
        // check if the user has changed the profile image
        const hasImageChanged = isBase64Image(blob)
        if(hasImageChanged){
            // upload the image to a uploadthing's file hosting server
            const imgRes = await startUpload(files)
            if(imgRes && imgRes[0].fileUrl){
                values.profile_photo = imgRes[0].fileUrl
            }
            // TODO: Update user on the database
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                {/* Profile photo */}
                <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                    <FormLabel className="account-form_image-label">
                        {field.value ? (
                            <Image src={field.value} alt="profile_photo"
                            width={96} height={96} priority className="rounded-full object-contain"/>
                        ): (
                            <Image src="/assets/profile.svg" alt="profile_photo"
                            width={24} height={24} className="object-contain"/>

                        ) }
                    </FormLabel>
                    <FormControl className="flex-1 text-base-semibold text-gray-200">
                        <Input type="file" accept="image/*"
                        placeholder="upload photo" className="account-form_image-input"
                        onChange={(e) => handleImage(e, field.onChange)}
                        />
                    </FormControl>
                    </FormItem>
                )}
                />
                {/* name */}
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col justify-start gap-3 w-full">
                    <FormLabel className='text-base-semibold text-light-2 justify-start'> Name 
                    </FormLabel>
                    <FormControl>
                        <Input type='text' className='account-form_input' placeholder='your name' {...field}/>
                    </FormControl>
                    <FormMessage className='' />
                    </FormItem>
                )}
                />
                {/* username */}
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col justify-start gap-3 w-full">
                    <FormLabel className='text-base-semibold text-light-2 justify-start'> Username
                    </FormLabel>
                    <FormControl>
                        <Input type='text' className='account-form_input' placeholder="@example"  {...field}/>
                    </FormControl>
                    <FormMessage className='' />
                    </FormItem>
                )}
                />
                {/* bio */}
                <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col justify-start gap-3 w-full">
                    <FormLabel className='text-base-semibold text-light-2 justify-start'> Bio 
                    </FormLabel>
                    <FormControl>
                        <Textarea rows={10} className="account-form_input"  {...field}/>
                    </FormControl>
                    <FormMessage className='' />
                    </FormItem>
                )}
                />
                <Button type="submit" className="bg-primary-500"> Submit </Button>
            </form>
        </Form>
    )
}
