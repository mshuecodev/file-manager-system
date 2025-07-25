import { Router } from "express"
import multer from "multer"
import * as fileController from "../controllers/fileController"

const router = Router()
const upload = multer({ dest: "uploads/" })

router.post("/upload", upload.single("file"), fileController.uploadFile)
router.get("/download/:fileName", fileController.downloadFile)
router.post("/create-directory", fileController.createDirectory)
router.post("/move-file/:fileName", fileController.moveFileToDirectory)
router.post("/rename-file/:fileName", fileController.renameFile)

router.delete("/move-to-trash/:fileName", fileController.moveToTrash)

export default router
