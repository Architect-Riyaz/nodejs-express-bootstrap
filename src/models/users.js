import mongoose from "mongoose"
import validator from "validator"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { USER_ROLE_MAP } from "../constants/index.js"
import env from "../config/env.js"
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      maxLength: [30, "Name cannot exceeds 30 characters"],
      default: "",
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: [30, "Name cannot exceeds 30 characters"],
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email!`,
      },
      trim: true,
      immutable: true, // ADD THIS PROPERTY HERE
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      maxLength: [30, "Password cannot exceeds 50 characters"],
      minLength: [8, "Password should be minimum 8 characters"],
      select: false,
      trim: true,
    },
    bio: {
      type: String,
      maxLength: [3000, "Bio cannot exceeds 3000 characters"],
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverPhoto: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE_MAP),
      default: USER_ROLE_MAP.CLIENT,
    },
    googleLogin: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcryptjs.hash(this.password, 12)
})
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  })
}
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex")
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
  return resetToken
}
userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`
})

const Users = mongoose.models.users || mongoose.model("users", userSchema)
export default Users
