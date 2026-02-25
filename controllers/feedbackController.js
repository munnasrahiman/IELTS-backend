import db from '../config/db.js';

export const submitFeedback = (req, res) => {
    const { name, email, message } = req.body;

    const sql = `
        INSERT INTO feedback (name, email, message)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error submitting feedback:', err);
            res.status(500).json({ error: 'Error submitting feedback' });
            return;
        }

        res.status(200).json({ 
            message: 'Feedback submitted successfully',
            feedback_id: result.insertId
        });
    });
};

export const getFeedbacks = (req, res) => {
    const sql = `
        SELECT * FROM feedback 
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching feedbacks:', err);
            res.status(500).json({ error: 'Error fetching feedbacks' });
            return;
        }

        res.status(200).json(results);
    });
}; 