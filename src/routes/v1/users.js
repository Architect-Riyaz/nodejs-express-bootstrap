import express from "express"
import {
  createAdmin,
  createTestUser,
  createTestUsers,
  fireBaseLogin,
  forgotPassword,
  getAllUsers,
  getRandomUser,
  getUser,
  getUserDetails,
  me,
  registerWallet,
  resetPassword,
  signin,
  signout,
  signup,
  updateProfile,
  uploadProfilePic,
} from "../../controllers/users.js"
import { devMode, isAuthenticated } from "../../middleware/auth.js"

const userRoutes = express.Router()

userRoutes.post("/createAdmin", devMode, createAdmin)

userRoutes.post("/signup", signup)
userRoutes.post("/signin", signin)
userRoutes.get("/signout", signout)
userRoutes.post("/forgotPassword", forgotPassword)
userRoutes.patch("/password/reset/:token", resetPassword)
userRoutes.get("/me", isAuthenticated, me)

export default userRoutes
