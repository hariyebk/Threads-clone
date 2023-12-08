import { fetchUser, getUserComments } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Link from "next/link"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function page() {
    const user = await currentUser()
    const userInfo = await fetchUser(user?.id!)
    if(!userInfo.onboarded) redirect("/onboarding")
    const comments = await getUserComments(userInfo._id)

    return (
        <div className="">
            <h1 className='head-text'> Activities </h1>
            <section className="mt-10 flex flex-col gap-5">
                {comments.length === 0 ? (
                    <p className="!text-base-regular text-light-3"> No activities found </p>
                ): 
                comments.map((comment) => {
                    return (
                        <Link key = {comment._id} href = {`/post/${comment.parentId}`}>
                            <article className="activity-card">
                                <Image src={comment.author.image} alt="profile- picture" className="rounded-full object-contain" width={20} height={20} />
                                <p className="!text-small-regular text-light-1">
                                    <span className="mr-2 text-primary-500">
                                        {comment.author.name}
                                    </span>
                                    replied to your post
                                </p>
                            </article>
                        </Link>
                    )
                })
                }
            </section>
        </div>
    )
}
