import axios from "axios"

export const coinInfo = async (ids) => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        ids,
      },
    }
  )
  return response.data[0]
}
