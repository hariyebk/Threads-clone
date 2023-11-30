"use server"

import { connectToDb } from "../mongoose"
import User from "../models/user.model"
import { revalidatePath } from "next/cache"

interface USER_INFO {
    userId: string | undefined,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}
export default async function updateUser({userId, username, name, bio, image, path}: USER_INFO): Promise<void>{
    // connect to our database
    connectToDb()
    try{
    // update user
    await User.findOneAndUpdate({id: userId}, {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        path
    }, {upsert: true}) 
    // if the element exist, it updates it else it creates a new one. (upsert)
    if(path === "/profile/edit"){
        revalidatePath(path)
    }
    }
    catch(error: any){
        throw new Error(`failed to create/update user: ${error.message}`)
    }
}