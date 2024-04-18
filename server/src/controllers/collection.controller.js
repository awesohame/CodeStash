import { Collection } from '../models/collection.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { Stash } from '../models/stash.model.js';
import mongoose from 'mongoose';

const createCollection = asyncHandler(async (req, res) => {
    const { title, description, visibility, publiclyEditable, uniqueSlug, stashId } = req.body;
    let author = req.user;

    // come back to this after deciding whether stash id or stash object is passed
    const stash = await Stash.findById(stashId);
    if (!stash) {
        throw new ApiError(400, "one Stash is required");
    }

    if (!(title.trim())) {
        throw new ApiError(400, "Title is required");
    }

    if (!uniqueSlug) {
        throw new ApiError(400, "Unique slug is required");
    }

    const isValidSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!isValidSlug.test(uniqueSlug)) {
        throw new ApiError(400, "Invalid unique slug");
    }

    const existingCollection = await Collection.findOne({ uniqueSlug });

    if (existingCollection) {
        throw new ApiError(400, "Collection with this unique slug already exists");
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
        stashes: [stash],
        uniqueSlug
    });

    if (!collection) {
        throw new ApiError(500, "Failed to create collection");
    }

    return res.status(201).json(new ApiResponse(200, collection, "Collection created successfully"));

});


const addStashToCollection = asyncHandler(async (req, res) => {
    const { collectionSlug } = req.params;
    const { stashId } = req.body;

    const collection = await Collection.findOne({ uniqueSlug: collectionSlug });

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
    const { collectionSlug } = req.params;
    const { stashId } = req.body;
    const user = req.user;

    const collection = await Collection.findOne({ uniqueSlug: collectionSlug })

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    if (collection.author.toString() !== user._id.toString()) {
        throw new ApiError(403, "You are not authorized to perform this action");
    }

    const stash = await Stash.findById(stashId);
    if (!stash) {
        throw new ApiError(404, "Stash not found");
    }

    collection.stashes.pull(stash);
    await collection.save();

    return res.status(200).json(new ApiResponse(200, collection, "Stash removed from collection successfully"));

});

const updateCollectionDetails = asyncHandler(async (req, res) => {
    const { title, description, visibility, publiclyEditable, collectionSlug, stashesId } = req.body;
    const slug = req.params.collectionSlug;
    const user = req.user;
    console.log(slug)
    const collection = await Collection.findOne({ uniqueSlug: slug });

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    if (collection.author.toString() !== user._id.toString() && !collection.publiclyEditable) {
        throw new ApiError(403, "You are not authorized to perform this action");
    }

    if (!title && !description && !visibility && publiclyEditable === undefined && !collectionSlug && !stashesId) {
        throw new ApiError(400, "No data to update");
    }

    let stashes = [];
    if (stashesId && Array.isArray(stashesId)) {
        stashes = await Stash.find({ _id: { $in: stashesId } });
    }

    if (collection.author.toString() === user._id.toString()) {
        collection.title = title ? title : collection.title;
        collection.description = description ? description : collection.description;
        collection.visibility = visibility ? visibility : collection.visibility;
        collection.publiclyEditable = publiclyEditable !== undefined ? publiclyEditable : collection.publiclyEditable;
        collection.uniqueSlug = collectionSlug ? collectionSlug : collection.uniqueSlug;
        collection.stashes = stashes ? stashes : collection.stashes;
    }

    if (collection.publiclyEditable) {
        collection.stashes = stashes ? stashes : collection.stashes;
    }

    await collection.save();

    return res.status(200).json(new ApiResponse(200, collection, "Collection updated successfully"));
});

const deleteCollection = asyncHandler(async (req, res) => {
    const { collectionSlug } = req.params;
    const user = req.user;

    const collection = await Collection.findOne({ uniqueSlug: collectionSlug });

    if (!collection) {
        throw new ApiError(404, "Collection not found");
    }

    if (collection.author.toString() !== user._id.toString()) {
        throw new ApiError(403, "You are not authorized to perform this action");
    }

    try {
        await collection.deleteOne();
    }
    catch (error) {
        throw new ApiError(500, "Failed to delete collection");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Collection deleted successfully"));
});

const getAllCollections = asyncHandler(async (req, res) => { }); // public collections

const getCollectionsByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const collections = await Collection.aggregate([
        {
            $match: {
                // author: new mongoose.Types.ObjectId(user._id),
                author: user._id,
                visibility: "public"
            }
        },
    ])

    return res.status(200).json(new ApiResponse(200, collections, "Collections found"));
});

const getCollectionOfCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const collections = await Collection.aggregate([
        {
            $match: {
                // author: new mongoose.Types.ObjectId(user._id),
                author: user._id,
            }
        },
    ])

    return res.status(200).json(new ApiResponse(200, collections, "Collections found"));
});

const getCollectionByTitle = asyncHandler(async (req, res) => { });

export {
    createCollection,
    addStashToCollection,
    removeStashFromCollection,
    updateCollectionDetails,
    deleteCollection,
    getCollectionsByUsername,
    getCollectionOfCurrentUser,
};