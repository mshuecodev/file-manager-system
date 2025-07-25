import fs from "fs"
import path from "path"

export const ensureDirectoryExists = (dirPath: string) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
}
