import { fetchUserPosts } from "@/lib/actions/user.actions"
import ThreadCard from "../cards/ThreadCard"
import { PostTypes } from "@/constants"

interface TabsProps {
    currentuser: string,
    accountId: string,
    accountType: string
    postType: string
}

export default async function ThreadsTab({currentuser, accountId, accountType, postType}: TabsProps) {
    const user = await fetchUserPosts(accountId)
    return (
        <section className="mt-10">
            {user.threads.length > 0 ? user.threads.map((post:any) => {
                return (
                    <div className="mt-8">
                        {postType === PostTypes.threads ? 
                        <ThreadCard key = {post.id} postDetail={
                            {
                            id: post._id,
                            currentuser,
                            parentId: post.parentId,
                            content: post.text,
                            author: accountType === "User" ? {name: user.name, image: user.image, id: user.id} : {name: post.author.name, image: post.author.image, id: post.author.id},
                            community: post.community || null,
                            createdAt: post.createdAt,
                            comments: post.children,
                            isComment: false,
                            }
                        } />
                        : postType === PostTypes.replies ? 
                        null
                        : null
                    }
                    </div>
                )
            }):
            <p className="flex mt-20 justify-center items-center text-primary-500 text-heading4-medium "> No posts found </p>
            }
        </section>
    )
}
