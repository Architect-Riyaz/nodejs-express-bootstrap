import ErrorHandler from "../utils/errorHandler.js"
import handlePromise from "./handlePromise.js"
import Users from "../models/users.js"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import env from "../config/env.js"
import { NODE_ENV_MAP } from "../constants/index.js"

export const devMode = handlePromise(async (req, res, next) => {
  const { NODE_ENV = NODE_ENV_MAP.PRODUCTION } = env
  if (NODE_ENV === NODE_ENV_MAP.PRODUCTION) {
    return next(
      new ErrorHandler("This request is restricted to development only.", 400)
    )
  }
  next()
})

export const isAuthenticated = handlePromise(async (req, res, next) => {
  const { token: cToken } = req.cookies
  const { authorization: hToken } = req.headers
  const { token: bToken } = req.body
  const token = cToken || hToken?.split(" ")[1] || bToken
  if (!token) {
    return next(new ErrorHandler("Access Denied.", 401))
  }
  const decodedData = jwt.verify(token, env.JWT_SECRET)
  const user = await Users.findById(decodedData.id)
  if (!user) {
    return next(new ErrorHandler("Access Denied. User not found.", 401))
  }
  req.user = user
  next()
})

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource.`,
          403
        )
      )
    }
    next()
  }
}

export const googleAuth = handlePromise(async (req, res, next) => {
  const { token } = req.body
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    req.payload = payload
    req.body.googleLogin = true
  } catch (error) {
    // console.log(error.message)
    return next(new ErrorHandler("Token Expired.", 401))
  }
})
