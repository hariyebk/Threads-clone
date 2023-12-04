import ThreadCard from "@/components/cards/ThreadCard";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchPostById } from "@/lib/actions/threads.actions";
import Comment from "@/components/forms/Comment";
import Link from "next/link";
import Image from "next/image";



export default async function page({params}: {params: {id: string}}) {
    if(!params.id) return null
    const user = await currentUser()
    // if the current user is not onboarded he can't see the replies to apost
    const userInfo  = await fetchUser(user?.id!)
    if(!userInfo?.onboarded) redirect("/onboarding")
    const post = await fetchPostById(params.id)

    return ( 
        <section className="relative overflow-auto">
            <div  className="w-[30px]">
                <Link href="/">
                    <Image src = "/assets/back.png" alt = "left-arrow" width={24} height={24} className="mb-8"/>
                </Link>
            </div>
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
            {/* comment box */}
            <div className="mt-7">
                <Comment postId={params.id} userId={JSON.stringify(userInfo._id)} image={userInfo.image}/>
            </div>
            {/* replies */}
            <div className = "mt-10">
                {post.children.map((comment: any) => {
                    return (
                        <ThreadCard key={post._id} postDetail={{
                            id: comment._id, 
                            currentuser: null, 
                            parentId: comment.parentId,
                            content: comment.text,
                            author: comment.author,
                            community: comment.community,
                            createdAt: comment.createdAt, 
                            comments: comment.children,
                            isComment: true
                        }}  />
                    )
                })}
            </div>
        </section>
    )
}
