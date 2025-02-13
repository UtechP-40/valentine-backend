import LoveLetter from "../models/loveLetter.models.js";
import Love from "../models/love.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const saveLoveLetter = async (req, res) => {
    try {
        const { title, message, to, from } = req.body;
        const { id } = req.params; 


        if ([title, message, to, from].some((field) => !field?.trim())) {
            throw new ApiError(400, "All fields (title, message, to, from) are required");
        }

        const loveEntry = await Love.findById(id);
        if (!loveEntry) {
            throw new ApiError(404, "Love entry not found");
        }

        const loveLetter = new LoveLetter({ title, message, to, from });
        await loveLetter.save();

        loveEntry.loveLetters.push(loveLetter._id);
        await loveEntry.save();

        console.log("Love Letter saved successfully");

        return res.status(201).json(new ApiResponse(201, loveLetter, "Love letter saved successfully"));
    } catch (error) {
        console.error("Error saving love letter:", error);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error")
        );
    }
};
