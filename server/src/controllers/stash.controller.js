import { Stash } from "../models/stash.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createStash = asyncHandler(async (req, res) => {
    const { title, description, content, visibility, publiclyEditable, stashSlug } = req.body;

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

    if (!visibility || publiclyEditable === undefined || publiclyEditable === null) {
        throw new ApiError(400, "pass parameters visibility and publiclyEditable in frontend ");
    }

    if (!stashSlug) {
        throw new ApiError(400, "Unique slug is required");
    }

    const isValidSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!isValidSlug.test(stashSlug)) {
        throw new ApiError(400, "Invalid unique slug");
    }

    const existingStash = await Stash.findOne({ uniqueSlug: stashSlug });

    if (existingStash) {
        throw new ApiError(400, "Stash with this unique slug already exists");
    }

    const stash = isGuest
        ? await Stash.create({
            title,
            description,
            content,
            visibility: "public",
            publiclyEditable: true,
            uniqueSlug: stashSlug
        })
        : await Stash.create({
            title,
            description,
            author,
            content,
            visibility,
            publiclyEditable,
            uniqueSlug: stashSlug
        });

    if (!stash) {
        throw new ApiError(500, "Failed to create stash");
    }

    return res.status(201).json(new ApiResponse(200, stash, "Stash created successfully"));

});

// get all public stashes
const getPublicStashes = asyncHandler(async (req, res) => {
    const stashes = await Stash.aggregate([
        {
            $match: {
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
        },
        {
            $unset: ["author.password", "author.refreshToken"]
        }
    ]);

    if (!stashes) {
        throw new ApiError(404, "No public stashes found");
    }
    return res.status(200).json(new ApiResponse(200, stashes, "Public stashes found"));
});

// get all stashes of current user
const getStashesOfCurrentUser = asyncHandler(async (req, res) => {
    const stashes = await Stash.aggregate([
        {
            $match: {
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
        },
        {
            $unset: ["author.password", "author.refreshToken"]
        }
    ]);

    if (!stashes) {
        throw new ApiError(404, "No stashes found");
    }
    return res.status(200).json(new ApiResponse(200, stashes, "Stashes found"));
});


// get stash of a user
const getStashesByUsername = asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
        throw new ApiError(404, "No such user found");
    }

    // const stashes = await Stash.find({ author: user._id }).populate("author", "-password -refreshToken");
    const stashes = await Stash.aggregate([
        {
            $match: {
                author: new mongoose.Types.ObjectId(user._id),
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
            $match: {
                visibility: "public"
            }
        },
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

// get stash sorted by update date
const getStashedSortedByUpdateDate = asyncHandler(async (req, res) => {
    const lim = parseInt(req.body.limit) || 10;

    const stashes = await Stash.aggregate([
        {
            $match: {
                visibility: "public"
            }
        },
        {
            $sort: {
                updatedAt: -1
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
    const { title, description, content, visibility, publiclyEditable, stashSlug } = req.body;
    const slug = req.params.stashSlug;
    const user = req.user;
    const isGuest = req.isGuest;

    if (title === "" && content === "" && description === "" && visibility === "" && publiclyEditable === "") {
        throw new ApiError(400, "All fields are empty");
    }

    const stash = await Stash.findOne({ uniqueSlug: slug });

    if (!stash) {
        throw new ApiError(404, "No stash found");
    }

    // author == user, all fields can be updated
    // author != user && publiclyEditable == false, no fields can be updated
    // author != user && publiclyEditable == true, only content can be updated
    // author == null, only content can be updated

    if (!isGuest) {
        if (stash.author.toString() !== user._id.toString() && stash.publiclyEditable === false) {
            throw new ApiError(403, "You are not authorized to perform this action");
        }

        if (stash.author.toString() === user._id.toString()) {
            stash.title = title ? title : stash.title;
            stash.description = description ? description : stash.description;
            stash.content = content ? content : stash.content;
            stash.visibility = visibility ? visibility : stash.visibility;
            stash.publiclyEditable = publiclyEditable ? publiclyEditable : stash.publiclyEditable;
            stash.uniqueSlug = stashSlug ? stashSlug : stash.uniqueSlug;
        }
    }

    if (stash.publiclyEditable) {
        stash.content = content ? content : stash.content;
    }

    await stash.save();

    if (!stash) {
        throw new ApiError(500, "Failed to update stash");
    }

    return res.status(200).json(new ApiResponse(200, stash, "Stash updated successfully"));
});

const deleteStash = asyncHandler(async (req, res) => {
    const { stashSlug } = req.params;
    const user = req.user;

    if (!stashSlug) {
        throw new ApiError(400, "Unique slug is required");
    }

    const stash = await Stash.findOne({ uniqueSlug: stashSlug });

    if (!stash) {
        throw new ApiError(404, "No stash found");
    }

    if (stash.author.toString() !== user._id.toString()) {
        throw new ApiError(403, "You are not authorized to perform this action");
    }

    try {
        await stash.deleteOne();
    } catch (error) {
        throw new ApiError(500, "Failed to delete stash");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Stash deleted successfully"));
});

const getStashBySlug = asyncHandler(async (req, res) => {
    const { stashSlug } = req.params;

    const stash = await Stash.findOne({ uniqueSlug: stashSlug });

    if (!stash) {
        throw new ApiError(404, "No stash found");
    }

    return res.status(200).json(new ApiResponse(200, stash, "Stash found"));
});



export {
    createStash,
    getPublicStashes,
    getStashesOfCurrentUser,
    getStashesByUsername,
    getStashesSortedByDate,
    getStashedSortedByUpdateDate,
    updateStash,
    deleteStash,
    getStashBySlug
}