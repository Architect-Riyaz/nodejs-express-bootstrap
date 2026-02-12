import web3 from "../config/web3.js"
import env from "../config/env.js"
import { NODE_ENV_MAP, USER_ROLE_MAP } from "../constants/index.js"
import handlePromise from "../middleware/handlePromise.js"
import Users from "../models/users.js"
import sendToken from "../utils/jwtToken.js"
import ErrorHandler from "../utils/errorHandler.js"
import cache from "../utils/cache.js"
import uploadHandler from "../middleware/uploads.js"
import crypto from "crypto"

export const createAdmin = handlePromise(async (req, res, next) => {
  const { APP_SECRET } = req.body
  if (!APP_SECRET) return next(new ErrorHandler("Key not found.", 403))

  if (APP_SECRET !== env.APP_SECRET)
    return next(new ErrorHandler("Key not matched.", 403))

  const user = await Users.create({
    ...req.body,
    role: USER_ROLE_MAP.ADMIN,
    isActive: true,
  })
  sendToken(user, 201, res)
})

export const signup = handlePromise(async (req, res, next) => {
  let avatar = "https://dummyimage.com/1000.jpg"
  let coverPhoto = "https://dummyimage.com/1000.jpg"

  if (req.body.avatar) avatar = req.body.avatar
  if (req.body.coverPhoto) coverPhoto = req.body.coverPhoto

  const isActive = true
  const user = await Users.create({
    ...req.body,
    avatar,
    coverPhoto,
    role: USER_ROLE_MAP.CLIENT,
    isActive,
  })
  user.password = req.body.password
  await user.save({ validateBeforeSave: false })
  sendToken(user, 201, res)
})
export const signin = handlePromise(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password)
    return next(new ErrorHandler("Please Enter Email & Password", 400))
  const user = await Users.findOne({ email }).select("+password")
  if (!user) return next(new ErrorHandler("Invalid email or password", 403))
  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid email or password", 403))
  // const token = user.getJWTToken()
  // return res.status(200).json({ status: true, user, token })
  res.setHeader("set-cookie", "token=; max-age=0")
  sendToken(user, 200, res)
})

export const signout = handlePromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  res.status(200).json({
    status: true,
    message: "Sign out.",
  })
})
export const forgotPassword = handlePromise(async (req, res, next) => {
  const { APP_URL, RESET_PASSWORD_URL } = env
  const user = await Users.findOne({ email: req.body.email })

  if (!user) return next(new ErrorHandler("User not found.", 404))
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })
  // const resetPasswordURL = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
  let resetPasswordURL = `${APP_URL}/api/v1/users/password/reset/${resetToken}`
  if (RESET_PASSWORD_URL) {
    resetPasswordURL = `${RESET_PASSWORD_URL}/?resetToken=${encodeURIComponent(
      resetToken
    )}`
  }
  const message = `Your password reset token is :- \n\n${resetPasswordURL}\n\nIf you have not requested this email then please ignore it.`
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: `${env.APP_NAME} Password Recovery.`,
    //   message,
    //   smtpService,
    //   smtpMail,
    //   smtpPassword,
    //   emailSenderName,
    // })

    const data = {
      status: true,
      message: `Email sent to ${user.email} successfully.`,
    }

    if (env.NODE_ENV === NODE_ENV_MAP.DEVELOPMENT) {
      data["resetPasswordURL"] = resetPasswordURL
    }
    res.json(data)
  } catch (error) {
    console.log(error.message)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })
    return next(new ErrorHandler("Email sending failed.", 400))
  }
})
export const resetPassword = handlePromise(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")
  const user = await Users.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: new Date() },
  })
  if (!user)
    return next(
      new ErrorHandler("Reset password token is invalid or expired.", 400)
    )
  if (req.body.password !== req.body.confirmPassword)
    return next(
      new ErrorHandler("Password and confirm password does not matched.", 400)
    )
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()
  sendToken(user, 200, res)
})

export const updatePassword = handlePromise(async (req, res, next) => {
  const user = await Users.findById(req.user.id).select("+password")
  const { oldPassword, password, confirmPassword } = req.body
  if (!oldPassword) return next(new ErrorHandler("Old Password Required.", 400))
  const isPasswordMatched = await user.comparePassword(oldPassword)
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid old Password", 400))
  if (password !== confirmPassword)
    return next(
      new ErrorHandler("Password and confirm password does not matched.", 400)
    )
  user.password = password
  await user.save()
  res.status(200).json({
    status: true,
    user,
  })
})

// TODO :Delete the below apis.

export const getUser = handlePromise(async (req, res, next) => {
  const key = req.originalUrl
  const cachedResponse = cache.get(key)
  if (cachedResponse) {
    console.log(`Cache hit for ${key}`)
    return res.send(cachedResponse)
  }

  const user = await Users.findById(req.params.id).select("-profilePic")
  if (!user) {
    return next(new ErrorHandler("User not found", 404))
  }

  cache.set(key, user)
  res.json(user)
})

export const getUserDetails = handlePromise(async (req, res, next) => {
  const user = await Users.findById(req.params.id).lean()
  if (!user)
    return res.status(400).json(`User id ${req.params.id} does not exists.`)

  const {
    _id,
    name = null,
    ethWalletAddress,
    referred,
    profilePic = null,
  } = user

  res.status(200).json({
    status: true,
    user: {
      _id,
      name,
      ethWalletAddress,
      referred,
      profilePic,
    },
  })
})

export const uploadProfilePic = uploadHandler.fields([
  { name: "profilePic", maxCount: 1 },
])

export const updateProfile = handlePromise(async (req, res, next) => {
  const { APP_URL } = env
  const { email, name, dob, language, gender } = req.body
  let updateData = {}

  if (name) updateData = { ...updateData, name }
  if (email) updateData = { ...updateData, email }
  if (dob) updateData = { ...updateData, dob }
  if (gender) updateData = { ...updateData, gender }
  if (language) updateData = { ...updateData, language }

  if (req.files?.profilePic && req.files?.profilePic.length) {
    const { filename, destination } = req.files.profilePic[0]
    const profilePic = `${APP_URL}/${destination}/${filename}`
    updateData = { ...updateData, profilePic }
  }

  const updatedUser = await Users.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
  })
  res.status(200).json(updatedUser)
})

export const registerWallet = handlePromise(async (req, res, next) => {
  const {
    ethWalletAddress,
    referredBy = null,
    referral,
    referralTxHash,
    referralTxTime,
    referralTxHashBlock,
  } = req.body
  const isValidAddress = web3.utils.isAddress(ethWalletAddress)
  if (!isValidAddress) return next(new ErrorHandler("Invalid ETH Address", 400))
  const isWalletAlreadyRegistered = await Users.findOne({ ethWalletAddress })

  if (isWalletAlreadyRegistered)
    return next(new ErrorHandler("Wallet Address already used.", 400))
  const user = await Users.findById(req.user.id)
  if (user?.ethWalletAddress) {
    return next(new ErrorHandler("User already updated wallet address.", 400))
  }
  if (user?.referral) {
    return next(new ErrorHandler("User already updated referral.", 400))
  }
  const duplicateReferral = await Users.findOne({ referral })

  if (duplicateReferral)
    return next(new ErrorHandler("Referral already used!", 400))

  let referredByUser = null
  if (referredBy) {
    referredByUser = await Users.findOne({ referral: referredBy })

    if (!referredByUser)
      return next(new ErrorHandler("Referral not found!", 404))

    referredByUser.referred.push(user._id)
    await Users.findByIdAndUpdate(referredByUser.id, referredByUser)
  }

  const updatedUser = await Users.findByIdAndUpdate(
    req.user.id,
    {
      ethWalletAddress,
      referredBy: referredByUser,
      referral,
      referralTxHash,
      referralTxTime,
      referralTxHashBlock,
    },
    {
      runValidators: true,
      useFindAndModify: false,
    }
  )
  res.status(200).json({
    status: true,
    updatedUser,
  })
})

export const fireBaseLogin = handlePromise(async (req, res, next) => {
  const { uid } = req.payload
  let user = await Users.findOne({ fireBaseUserID: uid })
  if (user) {
    return sendToken(user, 200, res)
  }
  req.body = { fireBaseUserID: uid }
  const createdUser = await createUser(req, res, next)
  return sendToken(createdUser, 200, res)
})

export const createUser = async (req, res, next) => {
  const isActive = true
  const user = await Users.create({
    ...req.body,
    role: USER_ROLE_MAP.USER,
    isActive,
  })

  if (req.body.referredBy) {
    const { referredBy } = req.body
    const referredByUser = await Users.findById(referredBy)
    referredByUser.referred.push(user._id)
    await Users.findByIdAndUpdate(referredByUser.id, referredByUser)
  }
  await user.save({ validateBeforeSave: false })
  const savedUser = await Users.findById(user._id)
  return savedUser
}

export const me = handlePromise(async (req, res, next) => {
  const user = await Users.findById(req.user.id)
  if (!user)
    return res.status(400).json(`User id ${req.user.id} does not exists.`)
  res.status(200).json({
    status: true,
    user,
  })
})

// Development API'S
export const getRandomUser = handlePromise(async (req, res, next) => {
  const count = await Users.countDocuments()
  const random = Math.floor(Math.random() * count)
  const user = await Users.findOne().skip(random)
  res.json(user)
})
export const getAllUsers = handlePromise(async (req, res, next) => {
  const users = await Users.find().limit(10)
  res.json(users)
})

export const createTestUser = handlePromise(async (req, res, next) => {
  const { referredBy } = req.body
  let referredByUser

  if (referredBy) {
    referredByUser = await Users.findById(referredBy)
    if (!referredByUser) return next(new ErrorHandler("User not found.", 400))
    req.body.referredByUser = referredByUser
    req.body.referredBy = referredByUser._id
  }
  const uid = Math.random().toString(36).substring(2, 7)

  let user = await Users.findOne({ fireBaseUserID: uid })
  if (user) return sendToken(user, 200, res)

  const account = web3.eth.accounts.create()
  req.body = { ethWalletAddress: account.address }

  const createdUser = await createUser(req, res, next)
  res.json(createdUser)
})

export const createTestUsers = handlePromise(async (req, res, next) => {
  const usersCount = parseInt(req.params.usersCount)
  if (!usersCount) return next(new ErrorHandler("usersCount not found.", 400))
  let users = []
  do {
    const count = await Users.countDocuments()
    if (count) {
      const random = Math.floor(Math.random() * count)
      const randomUser = await Users.findOne().skip(random)
      req.body.referredBy = randomUser._id
    }
    const uid = Math.random().toString(36).substring(2, 7)

    let user = await Users.findOne({ fireBaseUserID: uid })
    if (user) return sendToken(user, 200, res)

    const account = web3.eth.accounts.create()
    req.body.ethWalletAddress = account.address

    const createdUser = await createUser(req, res, next)
    users.push(createdUser)
  } while (users.length < usersCount)
  res.json(users)
})

export const getFirebaseToken = handlePromise(async (req, res, next) => {
  // firebaseClient

  res.status(200).json({
    status: true,
    // token: firebaseClientConfig,
  })
})
