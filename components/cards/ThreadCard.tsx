import Image from "next/image"
import Link from "next/link"

interface POSTDETAIL {
    id: string,
    currentuser: string | null,
    parentId: string | null,
    content: string,
    author: {name: string, image: string, id: string},
    community: {id: string, name: string, image: string} | null,
    createdAt: string,
    comments: {
        author:{
            // we only want to show the commenters image on the home page not details of the comment.
            image: string,
        }
    }[],
    isComment?: boolean
}
export default function ThreadCard({postDetail}: {postDetail: POSTDETAIL}) {
    const {id, currentuser, parentId, content, author, community, createdAt, comments, isComment} = postDetail

    return (
        <article className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7 mb-10" : "bg-dark-2 p-7"}`}>
            <div className="flex items-center justify-between">
                <div className="flex w-full flex-1 flex-row gap-4 ">
                    {/* user profile */}
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image src={String(author.image)} alt="profile-image"
                            className="cursor-pointer rounded-full" width={25} height={25}/>
                        </Link>
                        <div className="thread-card_bar mr-3 -mt-2" />
                    </div>
                    {/* user's name */}
                    <div className="flex flex-col gap-4 flex-1 -ml-5">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h2 className="relative text-base-semibold text-light-1 cursor-pointer"> {author.name} </h2>
                        </Link>
                        <p className="text-small-regular text-light-2"> {content} </p>
                        <div className="mt-2 flex flex-col gap-3">
                            <div className = "flex gap-3.5">
                                <Image src="/assets/heart-gray.svg" alt="heart" width={24} height={24} className="cursor-pointer object-contain"/>
                                <Link href={`/post/${id}`}>
                                    <Image src="/assets/reply.svg" alt="reply" width={24} height={24} className="cursor-pointer object-contain"/>   
                                </Link>
                                <Image src="/assets/repost.svg" alt="repost" width={24} height={24} className="cursor-pointer object-contain"/>
                                <Image src="/assets/share.svg" alt="share" width={24} height={24} className="cursor-pointer object-contain"/>
                            </div>
                            {/* comments */}
                            {isComment && comments.length > 0 ? <Link href={`/post/${id}`}>
                            <Image src={String(comments[0].author.image)} alt="replies" width={14} height={14} />
                            <p className="mt-1 text-subtle-medium text-gray-1"> {comments.length} replies </p>
                            </Link>: null}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
