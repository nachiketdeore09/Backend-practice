import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        // loging if any error before listning
        app.on("error", (error) => {
            console.log("Error while starting app:", error)
        })

        //Listining to port
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MONGO-DB connection Failed !!!- ", err)
    })



















// import express from "express";
// const app = express();
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.log("Error: ", error)
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`app is listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("ERROR: ", error)
//         throw error
//     }
// })()