import { Stash } from "../models/stash.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createStash = asyncHandler(async (req, res) => {
    const { title, description, content, visibility, publiclyEditable } = req.body;

    let author = req.user;
    const isGuest = req.isGuest;
    if (isGuest) {
        author = null;
    }

    if (!description) {
        description = "";
    }

    if ([title, content].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const stash = isGuest
        ? await Stash.create({
            title,
            description,
            content,
            visibility: "public",
            publiclyEditable: true,
        })
        : await Stash.create({
            title,
            description,
            author,
            content,
            visibility,
            publiclyEditable,
        });

    if (!stash) {
        throw new ApiError(500, "Failed to create stash");
    }

    return res.status(201).json(new ApiResponse(200, stash, "Stash created successfully"));

});

// get all public stashes
const getPublicStashes = asyncHandler(async (req, res) => {
    const stashes = await Stash.find({ visibility: "public" }).populate("author", "-password -refreshToken");
    if (!stashes) {
        throw new ApiError(404, "No public stashes found");
    }
    return res.status(200).json(new ApiResponse(200, stashes, "Public stashes found"));
});

// get all stashes of current user
const getStashesOfCurrentUser = asyncHandler(async (req, res) => {
    const stashes = await Stash.find({ author: req.user._id }).populate("author", "-password -refreshToken");
    if (!stashes) {
        throw new ApiError(404, "No stashes found");
    }
    return res.status(200).json(new ApiResponse(200, stashes, "Stashes found"));
});


// get stash of a user
const getStashByUsername = asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
        throw new ApiError(404, "No such user found");
    }

    // const stashes = await Stash.find({ author: user._id }).populate("author", "-password -refreshToken");
    const stashes = await Stash.aggregate([
        {
            $match: {
                author: mongoose.Types.ObjectId(user._id),
                visibility: "public"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        }
    ]);

    if (!stashes) {
        throw new ApiError(404, "No stashes found");
    }

    return res.status(200).json(new ApiResponse(200, stashes, "Stashes found"));

});

// get stashes sorted by date using aggregation pipelines
const getStashesSortedByDate = asyncHandler(async (req, res) => {
    const lim = parseInt(req.body.limit) || 10;
    // const userIdToExclude = req.user._id;
    const stashes = await Stash.aggregate([
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $limit: lim
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author"
            }
        }
    ]);



    if (!stashes) {
        throw new ApiError(404, "No stashes found");
    }

    return res.status(200).json(new ApiResponse(200, stashes, "Stashes found"));
});

const updateStash = asyncHandler(async (req, res) => {
    const { title, description, content, visibility, publiclyEditable } = req.body;

    if (title === "" && content === "" && description === "" && visibility === "" && publiclyEditable === "") {
        throw new ApiError(400, "All fields are empty");
    }
    const stash = await Stash.findById(req.params.id);

    stash.title = title ? title : stash.title;
    stash.description = description ? description : stash.description;
    stash.content = content ? content : stash.content;
    stash.visibility = visibility ? visibility : stash.visibility;
    stash.publiclyEditable = publiclyEditable ? publiclyEditable : stash.publiclyEditable;

    await stash.save();

    if (!stash) {
        throw new ApiError(500, "Failed to update stash");
    }

    return res.status(200).json(new ApiResponse(200, stash, "Stash updated successfully"));
});

const deleteStash = asyncHandler(async (req, res) => {
    try {
        await Stash.findByIdAndDelete(req.params.id);
    } catch (error) {
        throw new ApiError(500, "Failed to delete stash");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Stash deleted successfully"));
});


export {
    createStash,
    getPublicStashes,
    getStashesOfCurrentUser,
    getStashByUsername,
    getStashesSortedByDate,
    updateStash,
    deleteStash
}