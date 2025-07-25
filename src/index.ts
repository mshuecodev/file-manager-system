import express from "express"
import fileRoutes from "./routes/fileRoutes"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use("/files", fileRoutes)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
