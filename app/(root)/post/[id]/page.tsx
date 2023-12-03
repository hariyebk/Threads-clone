import ThreadCard from "@/components/cards/ThreadCard";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchPostById } from "@/lib/actions/threads.actions";
import Comment from "@/components/forms/Comment";


export default async function page({params}: {params: {id: string}}) {
    if(!params.id) return null
    const user = await currentUser()
    // if the current user is not onboarded he can't see the replies to apost
    const userInfo  = await fetchUser(user?.id!)
    if(!userInfo?.onboarded) redirect("/onboarding")
    console.log(userInfo._id)
    const post = await fetchPostById(params.id)

    return ( 
        <section className="relative">
            {/* starting thread */}
            <div>
            <ThreadCard  postDetail={{
                id: post._id, 
                currentuser: user?.id!, 
                parentId: post.parentId,
                content: post.text,
                author: post.author,
                community: post.community,
                createdAt: post.createdAt, 
                comments: post.children
            }}  />
            </div>
            {/* replies */}
            <div className="mt-7">
                <Comment postId={params.id} userId={JSON.stringify(userInfo._id)} image={user?.imageUrl!}/>
            </div>
        </section>
    )
}
