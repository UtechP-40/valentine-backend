import express from "express";
import { upload } from "./middlewares/multer.middlewares.js";
import { ApiError } from "./utils/ApiError.js";
import { uploadOnCloudinary } from "./utils/cloudinary.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import Love from "./models/love.models.js";
import connectDb from "./lib/db.config.js";
import cors from "cors";
import dotenv from "dotenv";
// import { saveLoveLetter } from "./models/loveLetter.models.js";
import { saveLoveLetter } from './controllers/letter.controller.js';
dotenv.config({ path: "./.env" });

const app = express();

app.use(
    cors({
      origin: "https://valentine-rust-five.vercel.app", // Your frontend URL
      methods: "GET,POST,PUT,DELETE,OPTIONS",
      allowedHeaders: "Content-Type,Authorization",
      credentials: true, // If using cookies/sessions
    })
  );
  
  // ✅ Handle Preflight Requests (for POST, PUT, DELETE)
  app.options("*", cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/save-valentine", upload.fields([{ name: "image", maxCount: 1 }]), async (req, res) => {
    try {
        const { name, partnerName, message, firstMet } = req.body;

        if ([name, partnerName, message, firstMet].some((field) => !field?.trim())) {
            throw new ApiError(400, "All fields (name, partnerName, message, firstMet) are required");
        }

        const imagePath = req.files?.image?.[0]?.path;
        if (!imagePath) {
            throw new ApiError(400, "Image is required");
        }

        const image = await uploadOnCloudinary(imagePath);
        if (!image?.secure_url) {
            throw new ApiError(500, "Failed to upload image");
        }

        const love = new Love({ 
            name, 
            partnerName, 
            message, 
            firstMet, // 📅 Save the first met date
            image: image.secure_url 
        });

        await love.save();
        console.log("Love message saved successfully");

        return res.status(201).json(new ApiResponse(201, love, "Love message saved successfully"));

    } catch (error) {
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
}
);


app.get("/get-love/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the love message and populate the loveLetters field
        const love = await Love.findOne({ _id: id }).populate("loveLetters");

        if (!love) {
            throw new ApiError(404, "Love message not found");
        }

        console.log("Love message found", love);
        return res.status(200).json(new ApiResponse(200, love, "Love message found"));
    } catch (error) {
        console.error("Error fetching love message:", error);
        res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error")
        );
    }
});


app.post("/save-love-letter/:id",saveLoveLetter )

    app.get("/", (req, res) => {
        res.send("<h1>Welcome to the homepage</h1>");
    });


connectDb()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(3000, () => console.log(`Server running at: http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("MongoDB Connection Failed", err);
        process.exit(1);
    });

// app.on("error", (error) => {
//     console.error("Server Error:", error);
//     process.exit(1);
// });
