import db from '../config/db.js';

export const getTutorDashboardStats = async (req, res) => {
    const tutorId = req.params.tutorId;
    console.log('Fetching dashboard stats for tutor:', tutorId);

    try {
        // Get total students assigned to tutor
        const studentQuery = `
            SELECT COUNT(DISTINCT user_id) as totalStudents 
            FROM enrolled_courses 
            WHERE tutor_id = ?`;

        // Get total active resources
        const resourceQuery = `
            SELECT COUNT(*) as activeResources 
            FROM tutor_resources 
            WHERE tutor_id = ? 
            AND status = 'active'`;

        db.query(studentQuery, [tutorId], (err, studentResults) => {
            if (err) {
                console.error('Error getting student count:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            console.log('Student results:', studentResults);

            db.query(resourceQuery, [tutorId], (err, resourceResults) => {
                if (err) {
                    console.error('Error getting resource count:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                console.log('Resource results:', resourceResults);

                const stats = {
                    totalStudents: studentResults[0]?.totalStudents || 0,
                    activeResources: resourceResults[0]?.activeResources || 0
                };

                console.log('Sending stats:', stats);

                res.json({
                    stats,
                    activities: []
                });
            });
        });
    } catch (error) {
        console.error('Error in getTutorDashboardStats:', error);
        res.status(500).json({ error: 'Server error' });
    }
}; 