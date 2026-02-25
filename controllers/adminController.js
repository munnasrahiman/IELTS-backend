import db from '../config/db.js';

export const getStudentProgress = (req, res) => {
    const sql = `
        SELECT 
            u.id,
            u.name,
            l.name as language,
            cp.level_number,
            cp.level_score,
            CASE 
                WHEN cp.level_number <= 2 THEN 'Beginner'
                WHEN cp.level_number <= 4 THEN 'Intermediate'
                ELSE 'Advanced'
            END as level,
            ec.enrolled_at
        FROM users u
        JOIN enrolled_courses ec ON u.id = ec.user_id
        JOIN languages l ON ec.language_id = l.id
        LEFT JOIN course_progression cp ON (
            u.id = cp.user_id AND 
            ec.language_id = cp.language_id AND 
            ec.id = cp.enrollment_id
        )
        ORDER BY cp.level_number DESC, cp.level_score DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching student progress:', err);
            return res.status(500).json({ error: 'Error fetching student progress' });
        }
        res.json(results);
    });
};

export const getAnalyticsReport = (req, res) => {
    const queries = {
        languageDistribution: `
            SELECT 
                l.name as language,
                COUNT(*) as student_count,
                AVG(COALESCE(cp.level_score, 0)) as avg_score
            FROM enrolled_courses ec
            JOIN languages l ON ec.language_id = l.id
            LEFT JOIN course_progression cp ON ec.id = cp.enrollment_id
            GROUP BY l.id, l.name
        `,
        levelDistribution: `
            SELECT 
                CASE 
                    WHEN cp.level_number <= 2 THEN 'Beginner'
                    WHEN cp.level_number <= 4 THEN 'Intermediate'
                    ELSE 'Advanced'
                END as level,
                COUNT(*) as student_count
            FROM course_progression cp
            GROUP BY 
                CASE 
                    WHEN cp.level_number <= 2 THEN 'Beginner'
                    WHEN cp.level_number <= 4 THEN 'Intermediate'
                    ELSE 'Advanced'
                END
        `
    };

    const analytics = {};
    let completed = 0;
    const total = Object.keys(queries).length;

    Object.entries(queries).forEach(([key, query]) => {
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching ${key}:`, err);
                return res.status(500).json({ error: `Error fetching ${key}` });
            }
            analytics[key] = results;
            completed++;

            if (completed === total) {
                res.json(analytics);
            }
        });
    });
}; 