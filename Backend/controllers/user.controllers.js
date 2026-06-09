import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { createNotification } from "./notification.controllers.js"

export const getCurrentUser = async(req,res)=>{
    try {
        const userId = req.userId
        const user = await User.findById(userId)
            .populate("posts loops posts.author posts.comments")
            .populate({
                path: "saved",
                populate: [
                    { path: "author", select: "name userName profileImage" },
                    { path: "comments.author", select: "name userName profileImage" }
                ]
            })

        if (!user)
        {
            return res.status(400).json({
                message:"user not found"
            })
        }

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({
            message:`get current user error ${error}`
        })
    }
}

export const suggestedUsers = async(req,res)=>{
    try {
        const users = await User.find({
            _id:{$ne:req.userId}
        }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({
            message:`get suggested user error ${error}`
        })
    }
}

export const editProfile = async(req,res)=>{
    try {
        const {name,userName,bio,profession,gender} = req.body
       const user = await User.findById(req.userId).select("-password")
        if (!user)
        {
            return res.status(400).json({
                message:"user not found"
            })
        }

        const sameUserWithUserName = await User.findOne({userName}).select("-password")
       if (
  sameUserWithUserName &&
  sameUserWithUserName._id.toString() !== req.userId.toString()
)
        {
            return res.status(400).json({
                message:"userName already exist"
            })
        }

        let profileImage;
        if (req.file)
        {
            profileImage = await uploadOnCloudinary(req.file.path)
        }

        user.name = name
        user.userName = userName
          if (profileImage) {
      user.profileImage = profileImage;
    }
        user.bio = bio
        user.profession = profession
        user.gender = gender

        await user.save()

        return res.status(200).json(user)

    } catch (error) {
         return res.status(500).json({
            message:`edit profile error ${error}`
        })
    }
}

export const getProfile = async (req, res) => {

    try {

        const userName = req.params.userName

        const user = await User.findOne({ userName })
            .select("-password")
            .populate("posts loops followers following")

        if (!user) {

            return res.status(400).json({
                message: "user not found"
            })
        }

        return res.status(200).json(user)

    } catch (error) {

        console.log("GET PROFILE ERROR => ", error)

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const follow = async (req, res) => {
  try {
    const currentUserId = req.userId
    const targetUserId = req.params.targetUserId

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user not found" })
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself." })
    }

    const currentUser = await User.findById(currentUserId)
    const targetUser = await User.findById(targetUserId)  // ✅ FIXED

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const isFollowing = currentUser.following.includes(targetUserId)

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId)
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId)

      await currentUser.save()
      await targetUser.save()

      return res.status(200).json({
        following: false,
        message: "Unfollowed successfully"
      })
    } else {
      currentUser.following.push(targetUserId)
      targetUser.followers.push(currentUserId)

      await currentUser.save()
      await targetUser.save()

      await createNotification(currentUserId, targetUserId, "follow")

      return res.status(200).json({
        following: true,
        message: "Followed successfully"
      })
    }
  } catch (error) {
    console.log("Follow error:", error)
    return res.status(500).json({ message: `Follow error: ${error}` })
  }
}

export const searchUsers = async (req, res) => {
    try {
        const query = req.query.q
        if (!query) {
            return res.status(200).json([])
        }

        const users = await User.find({
            $and: [
                { _id: { $ne: req.userId } }, // Exclude self
                {
                    $or: [
                        { name: { $regex: query, $options: "i" } },
                        { userName: { $regex: query, $options: "i" } }
                    ]
                }
            ]
        }).select("name userName profileImage bio profession")

        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({
            message: `search users error ${error}`
        })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        return res.status(200).json({ message: "Password updated successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Update password error: ${error}` })
    }
}
