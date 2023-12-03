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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    try{
    connectToDb() 
    // fetch  the posts not the comments. posts have no parentId's
    const skipamount = (pageNumber - 1) * pageSize
    // a post that has comments should display the user who commented it, that's why we need to populate the comments (childrens) with the User model .
    const postQuery =  Threads.find({parentId: {$in: [null, undefined]}}).sort({ createdAt: "desc"}).skip(skipamount).limit(pageSize).populate({path: "author", model: User}).populate({path: "children", populate: {
        path: "author",
        model: User,
        select: "_id name parentId image"
    }}) 
    // counts the posts fecthed
    const totalPostsCount = await Threads.countDocuments({parentId: {$in: [null, undefined]}})
    const posts = await postQuery.exec()
    const isNext = totalPostsCount > skipamount + posts.length
    return {posts, isNext}

    }   
    catch(error: any){
        throw new Error(error.message)
    }
    
}

export async function like(postId: string, userId: string) {
    try{
        connectToDb()
        await Threads.findByIdAndUpdate({_id: postId}, {
            // likes: likes++,
            // likedby.push(userId)
        })

    }
    catch(error: any){
        throw new Error(error.messgae)
    }
    
}

export async function fetchPostById(id: string) {
    try{
        connectToDb()
        //TODO: populate community
        return await Threads.findById(id).populate({path: "author", model: User, select: "_id id name image"}).populate({path: "children", populate: [
            {
            path: "author",
            model: User,
            select: "_id id name image"
            },
            // comments of a post could also have coments for them.
            {
            path: "children",
            model: Threads,
            populate: {
                path: "children",
                model: Threads,
                populate: {
                    path: "author",
                    model: User,
                    select: "_id id name image parentId"
                }
            }
            }
        ]}).exec()
    }
    catch(error: any){
        throw new Error(error.messgae)
    }
}