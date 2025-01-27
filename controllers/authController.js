import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { catchAsync } from "./../utils/catchAsync.js";
import { AppError } from "./../utils/appError.js";
import { sendEmail } from "../utils/email.js";
import { welcomeTemplate, forgotPasswordTemplate } from "../utils/emailTemplates.js";

import { User } from "./../models/userModel.js";

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
		expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 
	};

	res.cookie("jwt", token, cookieOptions);

	// Remove password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

export const signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		username: req.body.username.toLowerCase(),
		name: req.body.name,
		email: req.body.email.toLowerCase(),
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	// Welcome email to the new user

	const options = {
		email: req.body.email,
		subject: "Welcome to SkillMingle",
		message: welcomeTemplate(newUser.username),
		attachments : [{
			filename : "Welcome.jpeg",
			path : "https://img.freepik.com/free-vector/flat-creativity-concept-illustration_52683-64279.jpg?w=740&t=st=1710674167~exp=1710674767~hmac=203ff95b65145b624dbb5bc3c2d9284e15ed58cd18bf753e5f96f1fa398fa86f"
		}]
	};

	if (process.env.NODE_ENV === 'production') await sendEmail(options);

	createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exist
	if (!email || !password) {
		return next(new AppError("Please provide email and password!", 400));
	}
	// 2) Check if user exists && password is correct
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect email or password", 401));
	}

	// 3) If everything ok, send token to client
	createSendToken(user, 200, res);
});

export const logout = (req, res) => {
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: "success" });
};

// For protected routes (Authorized user can only access)
export const protect = catchAsync(async (req, res, next) => {
	// 1) Getting token and check of it's there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(
			new AppError(
				"You are not logged in! Please log in to get access.",
				401
			)
		);
	}

	// 2) Verification token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError(
				"The user belonging to this token does no longer exist.",
				401
			)
		);
	}

	// 4) Check if user changed password after the token was issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError(
				"User recently changed password! Please log in again.",
				401
			)
		);
	}

	// GRANT ACCESS TO PROTECTED ROUTE
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

export const forgotPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on POSTed email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError("There is no user with this email address.", 404));
	}

	// 2) Generate the random reset token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	// 3) Send it to user's email
	try {

		const frontendHost = req.headers['x-frontend-host'] || `${req.protocol}://${req.get('host')}`;
		const resetURL = `${frontendHost}/resetPassword/${resetToken}`;
		
		const options = {
			email: req.body.email,
			subject: "Password Reset",
			message: forgotPasswordTemplate(user.username, resetURL)
		};

		await sendEmail(options);

		res.status(200).json({
			status : "success",
			message : "Password Reset Token sent to email!"
		})

	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				"There was an error sending the email. Try again later!"
			),
			500
		);
	}
});

export const resetPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on the token
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError("Token is invalid or has expired", 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// 3) Update changedPasswordAt property for the user
	// 4) Log the user in, send JWT
	createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
	// 1) Get user from collection
	const user = await User.findById(req.user.id).select("+password");

	// 2) Check if POSTed current password is correct
	if (
		!(await user.correctPassword(req.body.passwordCurrent, user.password))
	) {
		return next(new AppError("Your current password is wrong.", 401));
	}

	// 3) If so, update password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();
	// User.findByIdAndUpdate will NOT work as intended!

	// 4) Log user in, send JWT
	createSendToken(user, 200, res);
});
