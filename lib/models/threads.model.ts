import mongoose from "mongoose";

const threadsSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // The thread can be either a post or a comment
    parentId: {
        type: String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Threads"
        }
    ]
})

const Threads = mongoose.models.Threads || mongoose.model("Threads", threadsSchema)

export default Threads