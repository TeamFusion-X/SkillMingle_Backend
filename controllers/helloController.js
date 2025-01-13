import { catchAsync } from "../utils/catchAsync.js";

export const saySomething = catchAsync(async (req, res, next) => {
    const response = "The server is up and running!!";

    res.status(200).json({
        status : "success",
        response : response
    });
});