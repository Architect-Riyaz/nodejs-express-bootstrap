import seed from "./seedDatabase.js"

const autoRun = async () => {
  try {
    await seed()
  } catch (error) {
    console.log(error.message)
  }
}

export default autoRun
