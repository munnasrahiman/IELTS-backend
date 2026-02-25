import db from '../config/db.js';

export const getAdminDashboardStats = (req, res) => {
    const statsQueries = {
        totalUsers: "SELECT COUNT(*) as count FROM users",
        totalTutors: "SELECT COUNT(*) as count FROM tutors",
        totalLanguages: "SELECT COUNT(*) as count FROM languages",
        activeEnrollments: "SELECT COUNT(*) as count FROM enrolled_courses",
        recentActivities: `
            SELECT 
                'enrollment' as type,
                CONCAT(u.name, ' enrolled in ', l.name) as description,
                ec.enrolled_at as timestamp
            FROM enrolled_courses ec
            JOIN users u ON ec.user_id = u.id
            JOIN languages l ON ec.language_id = l.id
            ORDER BY ec.enrolled_at DESC
            LIMIT 5
        `
    };

    let stats = {};
    let completedQueries = 0;
    const totalQueries = Object.keys(statsQueries).length;

    Object.entries(statsQueries).forEach(([key, query]) => {
        db.query(query, (err, results) => {
            if (err) {
                console.error(`Error fetching ${key}:`, err);
                if (!res.headersSent) {
                    return res.status(500).json({ error: `Error fetching ${key}` });
                }
                return;
            }

            stats[key] = key === 'recentActivities' ? results : results[0].count;
            completedQueries++;

            if (completedQueries === totalQueries && !res.headersSent) {
                res.status(200).json(stats);
            }
        });
    });
}; 