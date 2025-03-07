import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,
            required: true,
            trim: true
        },
        thumbnail: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            reqired: "User",
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
        },
        duration: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },

    },
    { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);