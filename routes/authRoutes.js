import express from 'express'
import { Adminlogin, login, tutorLogin } from '../controllers/auth.js'


const router= express.Router()


router.post('/Login', login)
router.post('/AdminLogin', Adminlogin)
router.post('/tutorLogin', tutorLogin)


export default router
