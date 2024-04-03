import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        visibility: {
            type: String,
            required: true,
            default: "public",
            enum: ["public", "private"],
        },
        publiclyEditable: {
            type: Boolean,
            required: true,
            default: false,
        },
        stashes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Stash",
                required: true,
            },
        ],
        uniqueSlug: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
    },
    {
        timestamps: true
    }
)

export const Collection = mongoose.model("Collection", collectionSchema);