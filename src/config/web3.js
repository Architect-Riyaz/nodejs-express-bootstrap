import Web3 from "web3"
import env from "./env.js"

const { RPC_URL = "", ADMIN_PRIVATE_KEY } = env

const web3 = new Web3(RPC_URL)
web3.eth.handleRevert = true

export let adminWallet

if (ADMIN_PRIVATE_KEY)
  adminWallet = web3.eth.accounts.wallet.add(ADMIN_PRIVATE_KEY)

export default web3
