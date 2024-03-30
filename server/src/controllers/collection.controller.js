import { Collection } from '../models/collection.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { Stash } from '../models/stash.model.js';
import mongoose from 'mongoose';

const createCollection = asyncHandler(async (req, res) => {
    const { title, description, visibility, publiclyEditable, stashid } = req.body;
    let author = req.user;

    // come back to this after deciding whether stash id or stash object is passed
    const stash = await Stash.findById(stashid);
    if (!stash) {
        throw new ApiError(400, "one Stash is required");
    }

    if (!(title.trim())) {
        throw new ApiError(400, "Title is required");
    }

    if (!description) {
        description = "";
    }

    if (!visibility || publiclyEditable === undefined || publiclyEditable === null) {
        throw new ApiError(400, "pass parameters visibility and publiclyEditable in frontend ");
    }

    const collection = await Collection.create({
        title,
        description,
        author,
        visibility,
        publiclyEditable,
        stashes: [stash]
    });

    if (!collection) {
        throw new ApiError(500, "Failed to create collection");
    }

    return res.status(201).json(new ApiResponse(200, collection, "Collection created successfully"));

});

const addStashToCollection = asyncHandler(async (req, res) => {

});

const removeStashFromCollection = asyncHandler(async (req, res) => { });

const updateCollection = asyncHandler(async (req, res) => { });

const deleteCollection = asyncHandler(async (req, res) => { });

const getAllCollections = asyncHandler(async (req, res) => { }); // public collections



export {
    createCollection,
};