import ThreadCard from "@/components/cards/ThreadCard";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchPostById } from "@/lib/actions/threads.actions";


export default async function page({params}: {params: {id: string}}) {
    if(!params.id) return null
    const user = await currentUser()
    // if the current user is not onboarded he can't see the replies to apost
    const userInfo  = await fetchUser(user?.id!)
    if(!userInfo?.onboarded) redirect("/onboarding")
    const post = await fetchPostById(params.id)
    console.log(post)

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
            <div>
                
            </div>
        </section>
    )
}
