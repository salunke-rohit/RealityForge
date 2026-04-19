import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import searchRoutes from "./routes/searchRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api", searchRoutes)

app.get("/", (req, res) => {
  res.send("RealityForge API running 🚀")
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})