import cors from "cors"
import env from "../config/env.js"

const { CORS_ALLOWED } = env

const whitelist = CORS_ALLOWED?.split(" ") || []

const corsOptions = {
  origin: whitelist,
  httpAllowMethods: ["GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"],
  preflightContinue: true,
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
}

const addCors = () => {
  if (whitelist.length) return cors(corsOptions)
  return cors({})
}

export default addCors
