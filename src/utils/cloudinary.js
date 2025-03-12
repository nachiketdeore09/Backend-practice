import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    }
);


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("Not a local file path");
            return null;
        }

        //upload file using uploader
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("this response contains: ", response);
        console.log("File uploaded successfully: ", response.url);
        return response;
    } catch (error) {
        // this deletes the loaclly saved file as the file uplaod is failed
        fs.unlinkSync(localFilePath);

    }
}


export { uploadOnCloudinary };
