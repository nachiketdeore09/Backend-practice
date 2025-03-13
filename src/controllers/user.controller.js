import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exist - by username or email
    // check for images and avatar
    // upload them to cloudinary(avatar)
    // create a user obj - create entry in db
    // remove password and refresh token feild from response
    // check for user creation 
    // return a yes

    // getting data from frontend
    const { fullName, email, username, password } = req.body;

    // console.log("req.body: ", req.body);
    // console.log("fullname: ", fullName);


    // validation of data
    if ([fullName, email, username, password].some((feild) =>
        feild?.trim() === ""
    )) {
        throw new apiError(400, "All feilds are required");
    }

    // check for existing user
    const userExisted = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExisted) {
        throw new apiError(409, "User with email or username already exist");
    }

    // check for images and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImagelocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImagelocalPath = req.files?.coverImage[0]?.path;
    }

    // console.log("req.files containes: ", req.files)
    // console.log("req.files.avata contains: ", req.files.avatar[0]);

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required");
    }

    //upload the images of cludinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImagelocalPath);

    // console.log("avatar url: ", avatar);

    if (!avatar) {
        throw new apiError(400, "avatar file is required");
    }

    // create an entry in DB
    const userEntry = await User.create({
        username: username.toLowerCase(),
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
    })

    // console.log("userEntry response contains: ", userEntry);

    // removing password and refreshTokens feild
    const createdUser = await User.findById(userEntry._id).select(
        "-password -refreshToken"
    )

    // check if user is created successfully
    if (!createdUser) {
        throw new apiError(500, "something went wrong while registering user");
    }

    //return response
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully")
    )

})

export { registerUser };