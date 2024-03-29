import mongoose, { Schema } from "mongoose";

const stashSchema = new Schema(
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
        content: {
            type: String,
            required: true,
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
    },
    { timestamps: true }
)

export const Stash = mongoose.model("Stash", stashSchema);