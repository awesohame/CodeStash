import { Collection } from '../models/collection.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { Stash } from '../models/stash.model.js';
import mongoose from 'mongoose';

const createCollection = asyncHandler(async (req, res) => {
    const { title, description, visibility, publiclyEditable, stashId } = req.body;
    let author = req.user;

    // come back to this after deciding whether stash id or stash object is passed
    const stash = await Stash.findById(stashId);
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


// controllers below not tested yet
const addStashToCollection = asyncHandler(async (req, res) => {
    const { collectionId, stashId } = req.body;

    const collection = await Collection.findById(collectionId);

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    const stash = await Stash.findById(stashId);
    if (!stash) {
        throw new ApiError(404, "Stash not found");
    }

    collection.stashes.push(stash);
    await collection.save();

    return res.status(200).json(new ApiResponse(200, collection, "Stash added to collection successfully"));
});

const removeStashFromCollection = asyncHandler(async (req, res) => {
    const { collectionId, stashId } = req.body;

    const collection = await Collection.findById(collectionId);

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    const stash = await Stash.findById(stashId);
    if (!stash) {
        throw new ApiError(404, "Stash not found");
    }

    collection.stashes.pull(stash);
    await collection.save();

    return res.status(200).json(new ApiResponse(200, collection, "Stash removed from collection successfully"));

});

const updateCollection = asyncHandler(async (req, res) => { });

const deleteCollection = asyncHandler(async (req, res) => { });

const getAllCollections = asyncHandler(async (req, res) => { }); // public collections



export {
    createCollection,
};