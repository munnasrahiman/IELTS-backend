import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Tutor routes working' });
});

// Stats route
router.get('/stats/:tutorId', (req, res) => {
    const tutorId = req.params.tutorId;
    console.log('Fetching stats for tutor:', tutorId);

    // Get total students assigned to tutor
    const studentQuery = `
        SELECT COUNT(DISTINCT id) as totalStudents 
        FROM tutor_assignments 
        WHERE tutor_id = ?`;

    // Get total active resources
    const resourceQuery = `
        SELECT COUNT(*) as activeResources 
        FROM resources 
        WHERE tutor_id = ? 
        `;

    db.query(studentQuery, [tutorId], (err, studentResults) => {
        if (err) {
            console.error('Error getting student count:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        db.query(resourceQuery, [tutorId], (err, resourceResults) => {
            if (err) {
                console.error('Error getting resource count:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const stats = {
                totalStudents: studentResults[0]?.totalStudents || 0,
                activeResources: resourceResults[0]?.activeResources || 0
            };

            res.json({
                stats,
                activities: []
            });
        });
    });
});

export default router; 