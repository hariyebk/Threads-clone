import { UserButton, currentUser } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/threads.actions";
import ThreadCard from "@/components/cards/ThreadCard";
{/* <UserButton afterSignOutUrl="/"/> */}
export default async function Home() {
  const threads = await fetchPosts(1, 30)
  const user = await currentUser()
  return (
    <div>
      <h1 className="head-text text-left"> Home </h1>
      <section className="mt-9 flex flex-col gap-10">
        {threads.posts.length === 0 ? 
        <p className="no-result"> No posts found</p>:
        threads.posts.map((post) => {
          return (
            <ThreadCard key={post._id} postDetail={{
              id: post._id, 
              currentuser: user?.id!, 
              parentId: post.parentId,
              content: post.text,
              author: post.author,
              community: post.community,
              createdAt: post.createdAt, 
              comments: post.children
            }}  />
          )
        })}
      </section>
    </div>
  )
}