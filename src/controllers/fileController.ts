import { Request, Response } from "express"
import path from "path"
import fs from "fs"

import { ensureDirectoryExists } from "../utils/fileUtils"

const UPLOADS_DIR = path.join(__dirname, "../../uploads")
const TRASH_DIR = path.join(__dirname, "../../trash")

interface MulterRequest extends Request {
	file?: Express.Multer.File
}

export const uploadFile = (req: MulterRequest, res: Response) => {
	const file = req.file
	if (!file) {
		return res.status(400).json({ error: "No file uploaded" })
	}

	ensureDirectoryExists(UPLOADS_DIR)

	const filePath = path.join(UPLOADS_DIR, file.originalname)
	fs.renameSync(file.path, filePath)

	res.status(201).json({ message: "File uploaded successfully", fileName: file.originalname })
}

export const downloadFile = (req: Request, res: Response) => {
	const fileName = req.params.fileName
	const filePath = path.join(UPLOADS_DIR, fileName)

	if (fs.existsSync(filePath)) {
		res.download(filePath, (err) => {
			if (err) {
				res.status(500).json({ error: "Error downloading file" })
			}
		})
	} else {
		res.status(404).json({ error: "File not found" })
	}
}

export const createDirectory = (req: Request, res: Response) => {
	const dirName = req.body.name
	const dirPath = path.join(UPLOADS_DIR, dirName)

	ensureDirectoryExists(dirPath)

	res.status(201).json({ message: "Directory created successfully", directory: dirName })
}

export const moveFileToDirectory = (req: Request, res: Response) => {
	const fileName = req.params.fileName
	const targetDir = req.body.targetDir
	const filePath = path.join(UPLOADS_DIR, fileName)
	const targetPath = path.join(UPLOADS_DIR, targetDir, fileName)

	if (fs.existsSync(filePath)) {
		ensureDirectoryExists(path.join(UPLOADS_DIR, targetDir))
		fs.renameSync(filePath, targetPath)
		res.status(200).json({ message: "File moved successfully", fileName: fileName })
	} else {
		res.status(404).json({ error: "File not found" })
	}
}

export const renameFile = (req: Request, res: Response) => {
	const oldFileName = req.params.fileName
	const newFileName = req.body.newFileName
	const oldFilePath = path.join(UPLOADS_DIR, oldFileName)
	const newFilePath = path.join(UPLOADS_DIR, newFileName)

	if (fs.existsSync(oldFilePath)) {
		fs.renameSync(oldFilePath, newFilePath)
		res.status(200).json({ message: "File renamed successfully", newFileName: newFileName })
	} else {
		res.status(404).json({ error: "File not found" })
	}
}

export const moveToTrash = (req: Request, res: Response) => {
	const fileName = req.params.fileName
	const dirPath = req.body.dirPath // Optional directory path from body
	const trashPath = path.join(TRASH_DIR, fileName)

	let filePath: string
	if (dirPath) {
		filePath = path.join(UPLOADS_DIR, dirPath, fileName)
	} else {
		filePath = path.join(UPLOADS_DIR, fileName)
	}

	if (fs.existsSync(filePath)) {
		ensureDirectoryExists(TRASH_DIR)
		fs.renameSync(filePath, trashPath)
		res.status(200).json({ message: "File moved to trash successfully" })
	} else {
		res.status(404).json({ error: "File not found" })
	}
}
