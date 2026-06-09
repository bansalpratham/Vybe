import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { editProfile, follow, getCurrentUser, getProfile, suggestedUsers, searchUsers, updatePassword } from '../controllers/user.controllers.js'
import { upload } from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/suggested",isAuth,suggestedUsers)
userRouter.get("/getProfile/:userName",isAuth,getProfile)
userRouter.get("/follow/:targetUserId",isAuth,follow)
userRouter.get("/search",isAuth,searchUsers)
userRouter.post("/editProfile",isAuth,upload.single("profileImage"),editProfile)
userRouter.post("/updatePassword",isAuth,updatePassword)

export default userRouter