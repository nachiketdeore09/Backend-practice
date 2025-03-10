import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ---------------------------------- Middlewares and Configurations ---------------------------------------------

// here CORS middleware is use to allow our frontend to access the backend 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

// this configuration defines the limit of json that the server will be accepting
app.use(express.json({ limit: "16kb" }));

// this configuration handles the url response i.e it can handle the modifications that are made in url
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// this configuration use to store the img,favicons... i.e publicly acceseble assests in the local server folder that is passed in it
app.use(express.static("public"));

// this is use to access cookies from client browser and perform CRED operations on them
app.use(cookieParser())

// ---------------------------------- End of Middlewares and Configurations ---------------------------------------------

// import Routes

import userRouter from "./routes/user.routes.js";

// routes declaration
//here imported routes are basically used as a middleware 
// this way of breating an url is a standart practice
app.use("/api/v1/users", userRouter);


export { app }