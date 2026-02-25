import express from 'express'
import { UpdateTutorStatus, UpdateUserStatus, Updatelanguage, updateTutor, updateUser } from '../controllers/editServices.js'

const router= express.Router()

router.put('/UpdateUser',updateUser)
router.put('/UpdateTutor',updateTutor)
router.put('/UpdateLanguage/:id',Updatelanguage)
router.put('/UpdateUserStatus',UpdateUserStatus)
router.put('/UpdateTutorStatus',UpdateTutorStatus)

export default router