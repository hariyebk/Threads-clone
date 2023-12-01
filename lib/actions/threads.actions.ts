"use server"
import { connectToDb } from "../mongoose"
import Threads from "../models/threads.model"
import User from "../models/user.model"
import { revalidatePath } from "next/cache"
import mongoose from "mongoose"

interface Params {
    text: string,
    author: string,
    communityId: mongoose.Schema.Types.ObjectId | null,
    path: string,
}
export async function createThread({text, author, communityId, path}: Params) {
    try{
    connectToDb()
    // create a new post
    const createdThread =  await Threads.create({
        text,
        author,
        communityId: communityId || null
    })
    // update the user
    await User.findByIdAndUpdate(author, {
        // push the created thread's id into the user
        $push: {threads: createdThread._id}
    })
    revalidatePath(path)
    }
    catch(error: any){
        throw new Error(error.message)
    }
}