import { User } from "./../models/userModel.js";
import { catchAsync } from "./../utils/catchAsync.js";
import { AppError } from "./../utils/appError.js";
import { uploadImage } from "./../utils/fileUploads.js";
import sharp from "sharp";

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

export const getMe = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		status: "success",
		data: {
			user: user,
		},
	});
});

export const getUser = catchAsync(async (req, res, next) => {
	const user = JSON.parse(
		JSON.stringify(await User.findOne({ username: req.params.username }))
	);
	
	if (!user) {
		res.status(200).json({
			status: "Success",
			message: "No user found",
		});
	} else {
		const filteredUser = filterObj(
			user,
			"username",
			"name",
			"email",
			"bio",
			"displayPicture",
			"userSkills",
			"skillsToLearn",
			"skillsToTeach",
			"teachingRating",
			"reviews"
		);

		res.status(200).json({
			status: "Success",
			user: filteredUser,
		});
	}
});

export const uploadDP = uploadImage.single("DP"); // DP is the field name in which the display picture should be passed

export const resizeAndSaveDP = catchAsync(async (req, res, next) => {
	if (!req.file) return next(new AppError("Please provide an image", 400));

	const filename = `user-${req.user.id}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat("jpeg")
		.jpeg({ quality: 80 })
		.toFile(`public/img/users/${filename}`);

	const location = `/img/users/${filename}`;

	await User.findByIdAndUpdate(
		req.user.id,
		{ displayPicture: location },
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json({
		status: "success",
	});
});

export const updateMe = catchAsync(async (req, res, next) => {
	// 1) Create error if user POSTs password data or upldates DP
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				"This route is not for password updates. Please use /updateMyPassword.",
				400
			)
		);
	}
	if (req.file) {
		return next(
			new AppError(
				"This route is not for updating display picture. Please use /updateDP",
				400
			)
		);
	}

	// 2) Filtered out unwanted fields names that are not allowed to be updated
	const filteredBody = filterObj(
		req.body,
		"name",
		"email",
		"userSkills",
		"skillsToLearn",
		"skillsToTeach",
		"bio"
	);

	// 3) Update user document
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		filteredBody,
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser,
		},
	});
});

export const deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndDelete(req.user.id);

	res.status(204).json({
		status: "success",
		data: null,
	});
});
