import express from 'express'
import {signOut,deleteUser, signup, login, google, update, getUser} from '../controllers/user.js'
import {getListing} from '../controllers/listing.js'
import {verifyToken} from '../utils/updateUser.js'
const router=express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/google", google)
router.post("/update/:id",verifyToken,update)
router.delete("/delete/:id", verifyToken, deleteUser)
router.get('/signout', signOut)
router.get("/listing/:id",verifyToken, getListing)
router.get('/:id', verifyToken, getUser)
export default router