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

    const stashes = await Stash.find({ author: user._id }).populate("author", "-password -refreshToken");

    if (!stashes) {
        throw new ApiError(404, "No stashes found");
    }

    return res.status(200).json(new ApiResponse(200, stashes, "Stashes found"));

});

// get stash by id



export {
    createStash,
    getPublicStashes,
    getStashesOfCurrentUser,
    getStashByUsername,
}