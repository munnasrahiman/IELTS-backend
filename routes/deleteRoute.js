import express from "express";
import { deleteLanguage, deletePlot, deleteProduct, deleteStaff, deleteTable } from "../controllers/deleteServices.js";

const router=express.Router();

router.delete('/deleteProduct', deleteProduct)
router.delete('/deletePlot/:id', deletePlot)
router.delete('/deleteStaff', deleteStaff)
router.delete('/deleteLanguage/:id', deleteLanguage)
router.delete('/deleteTable', deleteTable)

export default router