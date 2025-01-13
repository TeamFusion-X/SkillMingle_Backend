import { catchAsync } from "./../utils/catchAsync.js";
import { GoogleGenerativeAI } from "@google/generative-ai";


export const getResponse = catchAsync(async (req, res, next) => {
    const genAI = new GoogleGenerativeAI(process.env.GEN_AI_KEY);
    const model = genAI.getGenerativeModel({model : "gemini-pro"});
    
    const prompt = req.body.prompt;

    const result = await model.generateContent(prompt);
    const response = result.response.candidates[0].content.parts[0].text;

    res.status(200).json({
        status : "success",
        response : response
    });
});