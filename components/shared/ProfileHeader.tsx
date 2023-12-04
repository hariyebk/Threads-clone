import Image from "next/image";

interface ProHeader {
    accountId: string,
    currentUser: string,
    name: string,
    username: string,
    imageUrl: string,
    bio: string,
}
export default function ProfileHeader({accountId, currentUser, name, username, imageUrl, bio}: ProHeader) {

    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20">
                        <Image src={imageUrl} alt="profile-image" fill className="rounded-full object-cover sgadow-2xl"  />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-light-1 text-left text-heading3-bold">{name}</h2>
                        <p className="text-base-medium text-gray-1 mt-2">@{username}</p>
                    </div>
                </div>
            </div>
            {/* TODO: community */}
            <p className="mt-6 max-w-lg text-base-regular text-light-2">
                {bio}
            </p>
            {/* line */}
            <div className="mt-12 h-0.5 w-full bg-dark-3"/>
        </div>
    )
}
