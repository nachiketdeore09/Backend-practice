import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // finding user by ID
        const user = await User.findById(userId);

        //generating token by using methods defined in models
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //saving only the referesh token feild in DB
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        //return the refresh and access token
        return { accessToken, refreshToken };


    } catch (error) {
        throw new apiError(500, "Something went wrong while generating tokens");
    }
}

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

const loginUser = asyncHandler(async (req, res) => {
    // req.bosy -> data
    // username base login or email base login
    // find the user
    // check password
    // access and refresh tokens
    // send cookie

    // accept data
    const { username, password, email } = req.body;

    // check if either username or email is present
    if (!(username || email)) {
        throw new apiError(400, "Username or Email is required");
    }

    // find user in database
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(404, "User does not exist , go and register first")
    }

    //check for correct user password
    const isPasswordVaild = await user.isPasswordCorrect(password)

    if (!isPasswordVaild) {
        throw new apiError(401, "Invalid user Password");
    }

    // access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    //SENDING COOKIES

    // here we stored the updated user 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // for sending cookie first we set some options
    // httpOnly,secure -> by default cookie are modifiable but after making this true cookies can't be modified from the front end
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken,
                },
                "User LoggedIn successfully",
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    // this method just taked the user from the response which was added by the middleware and then makes its refreshToken as undefined
    const userVar = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(
                200,
                {},
                "user Logged out successfull"
            )
        )

})

export { registerUser, loginUser, logoutUser };