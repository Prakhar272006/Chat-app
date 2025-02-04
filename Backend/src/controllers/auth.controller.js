import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
// import user from "../models/user.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      profilePic:""
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res
        .status(201)
        .json({
          message: "User created successfully",
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic:newUser.profilePic
        });
    } else {
      return res.status(400).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal  server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
   const isCorrect =  await bcrypt.compare(password,user.password)
    if(!isCorrect){
     return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res
      .status(200)
      .json({
        message: "Login successful",
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic:user.profilePic
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal  server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal  server error" });
    
  }
};


export const updateProfile = async (req, res) => {
  try {
      const { profilePic } = req.body;
      const userId = req.user._id;

      if (!profilePic) {
          return res.status(400).json({ message: "Profile picture is required" });
      }

      // Log the profilePic to ensure it is being received correctly
      // console.log("Profile picture received: ", profilePic);

      // Upload the profile picture to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      // console.log("Upload response: ", uploadResponse);

      // Update the user's profile picture URL in the database
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePic: uploadResponse.secure_url },
          { new: true }
      );

      // Log the updated user to ensure the update was successful
      // console.log("Updated user: ", updatedUser);

      res.status(200).json(updatedUser);
  } catch (error) {
      console.log("Error in updateProfile: ", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};