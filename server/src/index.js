import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
    .then(
        () => {
            app.on("error", (err) => {
                console.log(err);
                throw err;
            });
            app.listen(process.env.PORT || 8000, () => {
                console.log(`Listening on port ${process.env.PORT}`);
            })
        })
    .catch((err) => {
        console.log("mongo connection failed", err);
    }
    )