import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import mongoose from 'mongoose';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    // console.log('username:', username, 'password:', password);

    if (
        [username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    let avatarUrl = "";
    if (avatarLocalPath) {
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar) {
            throw new ApiError(500, "Failed to upload avatar");
        }
        avatarUrl = avatar?.url || "";
    }

    const existingUser = await User.findOne({
        username,
    });

    if (existingUser) {
        throw new ApiError(400, "Username already exists")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        password,
        avatar: avatarUrl,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: createdUser,
            accessToken,
            refreshToken
        }, "User Registered Successfully"))
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        throw new ApiError(400, "Username is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
        username
    });

    if (!user) {
        throw new ApiError(400, "Invalid username");
    }

    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            }
            , "User logged in successfully"));
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    User.findByIdAndUpdate(user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    await User.findByIdAndDelete(req.user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User deleted successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Current and new password are required");
    }

    const isPasswordValid = await user.verifyPassword(currentPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid current password");
    }

    user.password = newPassword;
    await user.save();

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!loggedInUser) {
        throw new ApiError(500, "Failed to change password");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, loggedInUser, "Password changed successfully"));
});

const changeUsername = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    const { newUsername } = req.body;

    if (!newUsername) {
        throw new ApiError(400, "New username is required");
    }

    const existingUsername = await User.findOne({ username: newUsername });
    if (existingUsername) {
        throw new ApiError(400, "Username already exists");
    }

    user.username = newUsername;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Username changed successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token missing");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Request Token");
        }

        if (user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid/Expired Refresh Token");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access Token refreshed successfully"
            ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid/Expired Refresh Token");
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details fetched successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
    changeUsername,

};