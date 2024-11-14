const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  try {
    // console.log("under signUp controller");
    const { username, email, password } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const newUser = await User.create({ username, email, password });
    const createdUser = await User.findById(newUser._id).select("-password");

    if (!createdUser) {
      throw new ApiError(500, "Failed to create user");
    }
    res
      .status(200)
      .json(new ApiResponse(200, { user: createdUser }, "Signup successful"));
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    if (!email || !password || email === "" || password === "") {
      throw new ApiError(400, "All fields are required");
    }

    const validUser = await User.findOne({ email });
    if (!validUser) {
      throw new ApiError(404, "User not found");
    }

    const validPassword = await validUser.isPasswordCorrect(password);
    // const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword) {
      throw new ApiError(400, "Invalid password");
    }
    const token = validUser.generateAccessToken();

    const { password: pass, ...rest } = validUser._doc;

    const cookieOptions = {
      httpOnly: true,
      sameSite: "Strict", // Helps prevent CSRF attacks
    };
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    res
      .status(200)
      .cookie("accessToken", token, cookieOptions)
      .json(new ApiResponse(200, { user: rest }, "Sign In Successfully"));
  } catch (error) {
    next(error);
  }
};

const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json(new ApiResponse(200, {}, "User has been signed out"));
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    let user = await User.findOne({ email }).select("-password");
    if (user) {
      const token = user.generateAccessToken();
      return res
        .status(200)
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .json(new ApiResponse(200, { user }, "User sign-in successful"));
    } else {

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") + // joen deo
          Math.random().toString(9).slice(-4),
        email,
        password: generatedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      user = await User.findById(newUser._id).select("-password");

      const token = user.generateAccessToken();

      return res
        .status(200)
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .json(new ApiResponse(200, { user }, "User sign-up successful"));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin, signout, google };
