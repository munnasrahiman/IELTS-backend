import db from '../config/db.js';

export const getAssignedUsers = (req, res) => {
    const tutorId = req.params.tutorId;
    
    const sql = `
        SELECT 
            u.id as user_id,
            u.name as student_name,
            u.email as student_email,
            u.phone_number as student_phone,
            l.id as language_id,
            l.name as language_name,
            ec.id as enrollment_id,
            ta.tutor_id
        FROM users u
        JOIN enrolled_courses ec ON u.id = ec.user_id
        JOIN languages l ON ec.language_id = l.id
        JOIN tutor_assignments ta ON ec.id = ta.enrollment_id
        WHERE ta.tutor_id = ?
    `;

    db.query(sql, [tutorId], (err, results) => {
        if (err) {
            console.error('Error fetching assigned users:', err);
            res.status(500).json({ error: 'Error fetching assigned users' });
            return;
        }

        res.status(200).json(results);
    });
}; 