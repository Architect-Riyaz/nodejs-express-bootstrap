// Create Token and saving in cookie

import env from "../config/env.js"

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken()

  // options for cookie
  const options = {
    expires: new Date(Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: false,
    secure: false,
  }

  res.status(statusCode).cookie("token", token, options).json({
    status: true,
    user,
    token,
  })
}

export default sendToken
