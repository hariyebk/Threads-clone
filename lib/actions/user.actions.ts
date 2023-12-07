"use server"

import { connectToDb } from "../mongoose"
import User from "../models/user.model"
import { revalidatePath } from "next/cache"
import Threads from "../models/threads.model"
import { FilterQuery, SortOrder } from "mongoose"

interface USER_INFO {
    userId: string | undefined,
    username: string,
    name: string,
    bio: string,
    image: string,
    onboarded: boolean,
    path: string
}
export async function updateUser({userId, username, name, bio, image, onboarded, path}: USER_INFO): Promise<void>{
    // connect to our database
    connectToDb()
    try{
    // update user
    await User.findOneAndUpdate({id: userId}, {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded
    }, {upsert: true}) 
    // if the element exist, it updates it else it creates a new one. (upsert)
    if(path === "/profile/edit"){
        // update the page with the new data. just like invalidate query of the react query
        revalidatePath(path)
    }
    }
    catch(error: any){
        throw new Error(`failed to create/update user: ${error.message}`)
    }
}
export async function fetchUser(userId: string) {
    try{
    connectToDb()
    return  await User.findOne({id: userId})
    }
    catch(error: any){
        throw new Error(error.message)
    }
    
}
export async function fetchUserPosts(userId: string) {
    try{
        connectToDb()
        // TODO: populate community
        const user = await User.findOne({id: userId}).populate({
            path: "threads",
            model: Threads,
            populate: {
                path: "children", 
                model: Threads,
                populate: {
                    path: "author",
                    model: User,
                    select: "id name image username"
                }
            }
        })

        return user
    }
    catch(error: any){
        throw new Error(error.message)
    }
    
}
export async function fetchAllUsers({
    userId, 
    pagenumber = 1,
    pageSize = 20, 
    searchString = "", 
    sortBy = "desc" 
}: {
    userId: string,
    pagenumber?: number,
    pageSize?: number,
    searchString?: string,
    sortBy?: SortOrder
}) {
    try{
    connectToDb()
    const skipAmount = (pagenumber - 1 ) * pageSize
    // allow for case-insensitive searching
    const regex = new RegExp(searchString, "i")
    // query all users except the current user
    const query:FilterQuery<typeof User> = {
        id: {$ne: userId}
    }
    // filtering
    if(searchString.trim() !== ""){
        query.$or = [
            {username: {$regex: regex}},
            {name: {$regex: regex}}
        ]
    }
    // sorting
    const sortOptions = {createdAt: sortBy}

    const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize)

    // total number of documents that satisfy the query.
    const totalUsersCount = await User.countDocuments(query)
    
    // excute the query
    const users = await usersQuery.exec()

    // check if the nextpage exists
    const isNext = totalUsersCount > skipAmount + users.length
    
    return {users, isNext}
    }
    catch(error: any){
        throw new Error(error.message)
}
}