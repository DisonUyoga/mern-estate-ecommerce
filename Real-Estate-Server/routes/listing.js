import express from 'express'
import {createListing, deleteListing, editListing, listingList, getListings} from '../controllers/listing.js'
import { verifyToken } from '../utils/updateUser.js'
 

const router =express.Router()

router.post("/create",verifyToken,createListing)
router.delete("/delete/:id", verifyToken, deleteListing)
router.post("/edit/:id", verifyToken, editListing)
router.get("/get/:id", listingList)
router.get('/get', getListings)



export default router;