const { toWei } = require("web3").utils

const sendTx = async ({
  privateKey,
  data,
  nonce,
  gasPrice,
  gasLimit,
  amount,
  chainID,
  web3,
  to,
}) => {
  const serializedTx = await web3.eth.accounts.signTransaction(
    {
      nonce: Number(nonce),
      chainID,
      to,
      data,
      value: toWei(amount),
      gasPrice,
      gas: gasLimit,
    },
    privateKey
  )

  return new Promise((res, rej) =>
    web3.eth
      .sendSignedTransaction(serializedTx.rawTransaction)
      .once("transactionHash", res)
      .once("error", rej)
  )
}

module.exports = sendTx
