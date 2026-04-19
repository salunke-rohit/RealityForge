import express from "express"
import { createSearch, getHistory, deleteSearch } from "../controllers/searchController.js"

const router = express.Router()

router.post("/search", createSearch)
router.get("/history", getHistory)
router.delete("/search/:id", deleteSearch)

export default router