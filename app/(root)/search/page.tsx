
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { fetchAllUsers } from "@/lib/actions/user.actions"
import UserCard from "@/components/cards/UserCard"

export default async function page() {
    const user = await currentUser()
    const userInfo = await fetchUser(user?.id!)
    // check if the current user has onboarded
    if(!userInfo.onboarded) redirect("/onboarding")
    // fetch all users
    const results = await fetchAllUsers({
        userId: user?.id!,
        searchString: "",
        pagenumber: 1,
        pageSize: 20,
        sortBy: "desc"

    })
    return (
        <section className="">
            <h1 className='head-text mb-10'> Search </h1>
            {/* Search Bar TODO: SEARCH INPUT*/}
            <div className="mt-14 flex flex-col gap-9">
                {results.users.length === 0 ? (
                    <p className="no-result"> No users found</p>

                ): results.users.map((user) => {
                    return (
                        <UserCard key = {user.id} id = {user.id} name = {user.name} username = {user.username} imgUrl = {user.image} userType = "User" />
                    )
                })}

            </div>
        </section>
    )
}
