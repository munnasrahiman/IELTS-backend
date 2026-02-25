import express from 'express'
import {  addCourseProgression, addlanguage, addTutor,  addUser, enrollCourse } from '../controllers/addServices.js'


const router= express.Router()


router.post('/addUser', addUser)
router.post('/addTutor', addTutor)
router.post('/addlanguage', addlanguage)
router.post('/enrollcourse', enrollCourse)
router.post('/course-progression', addCourseProgression);



export default router

