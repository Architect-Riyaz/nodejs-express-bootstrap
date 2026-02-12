import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads")
  },
  filename: function (req, file, cb) {
    const suffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    cb(null, file.fieldname + "-" + suffix)
  },
  limits: { fileSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/
    const mimetype = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(`Filetype Error: Allowed extensions are ${fileTypes}`)
  },
})

const uploadHandler = multer({ storage })
export default uploadHandler
