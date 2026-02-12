import NodeCache from "node-cache"
import env from "../config/env.js"

const { CACHE_TTL = 3, CACHE_CHECK = 120 } = env

const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CACHE_CHECK })
export default cache
