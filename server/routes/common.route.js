import { Router } from "express"
import { getAllGenres } from "../controllers/Genre.controller.js"


const router = Router()
router.get("/genres", getAllGenres)

// Export the router
export default router