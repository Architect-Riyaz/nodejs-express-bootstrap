const handlePromise = (PromiseHandler) => (req, res, next) => {
  Promise.resolve(PromiseHandler(req, res, next)).catch(next)
}

export default handlePromise
