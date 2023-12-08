import AccountProfile from "@/components/forms/AccountProfile";
import {currentUser} from "@clerk/nextjs"

interface USERINFO {
    id?: string,
    _id?: string,
    name?: string,
    username?: string,
    bio?: string,
    image?: string,
}

export default async function Page() {
    // user's data from clerk
    const user = await currentUser()
    // user's data from the Mongodb.
    const userInfo: USERINFO = {}

    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: user?.username || userInfo?.username,
        name: user?.firstName || userInfo?.name,
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl
    }

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text"> OnBoarding </h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile now to use Threads
            </p>
            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile user={userData!} btnTitle="continue" />
            </section>
        </main>
    )
}
