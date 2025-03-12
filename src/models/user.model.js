import mongoose, { mongo, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const fullNameSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    }
})
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        avatar: {
            type: String,
            required: true
        },
        coverImage: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            }
        ],
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)
//for encryption of password whenever user enters the password or changes it
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

//for comparing of password when user logs-in
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// For generating accessTokens and refresTokens

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            usename: this.usename,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema)
