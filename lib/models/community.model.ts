import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true,
    },
    image: String,
    bio: String,
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: "User"
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            require: "User"

        }
    ],
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Threads"
        }
    ]
})

const Community = mongoose.models.Community || mongoose.model("Community", CommunitySchema)

export default Community