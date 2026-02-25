import express from 'express'
import { getAllLanguages, getAllPlots, getAllSlotBookings, getAllTutors, getAllUsers,  getAllseats,  getPlotSlotsByIdAndType, getStaff, getUserCourses } from '../controllers/getServices.js'
import { getProgressionLevel } from '../controllers/addServices.js'


const router= express.Router()

router.post('/getStaff', getStaff)
router.get('/getAllUsers', getAllUsers)
router.get('/getAllTutors', getAllTutors)
router.get('/getAllLanguages', getAllLanguages)
router.get('/getAllplots', getAllPlots)
router.get('/getPlotslots', getPlotSlotsByIdAndType)
router.get('/enrolledCourses/:id', getUserCourses)
router.get('/progression-level', getProgressionLevel);
router.get('/getAllseats', getAllseats)
router.get('/getAllBookings', getAllSlotBookings)


export default router