import db from '../config/db.js';

// Get chat history
export const getChatHistory = (req, res) => {
    const { tutor_id, student_id, enrollment_id } = req.query;
    
    const sql = `
        SELECT 
            cm.*,
            CASE 
                WHEN cm.sender_type = 'tutor' THEN t.name
                ELSE u.name
            END as sender_name
        FROM chat_messages cm
        LEFT JOIN tutors t ON (cm.sender_id = t.id AND cm.sender_type = 'tutor')
        LEFT JOIN users u ON (cm.sender_id = u.id AND cm.sender_type = 'student')
        WHERE enrollment_id = ?
        AND ((sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?))
        ORDER BY created_at ASC
    `;

    db.query(sql, [enrollment_id, tutor_id, student_id, student_id, tutor_id], (err, results) => {
        if (err) {
            console.error('Error fetching chat history:', err);
            res.status(500).json({ error: 'Error fetching chat history' });
            return;
        }

        res.status(200).json(results);
    });
};

// Send message
export const sendMessage = (req, res) => {
    const { sender_id, receiver_id, message, sender_type, enrollment_id } = req.body;
    
    const sql = `
        INSERT INTO chat_messages 
        (sender_id, receiver_id, message, sender_type, enrollment_id) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [sender_id, receiver_id, message, sender_type, enrollment_id], (err, result) => {
        if (err) {
            console.error('Error sending message:', err);
            res.status(500).json({ error: 'Error sending message' });
            return;
        }

        // Get the sent message details
        const messageQuery = `
            SELECT 
                cm.*,
                CASE 
                    WHEN cm.sender_type = 'tutor' THEN t.name
                    ELSE u.name
                END as sender_name
            FROM chat_messages cm
            LEFT JOIN tutors t ON (cm.sender_id = t.id AND cm.sender_type = 'tutor')
            LEFT JOIN users u ON (cm.sender_id = u.id AND cm.sender_type = 'student')
            WHERE cm.id = ?
        `;

        db.query(messageQuery, [result.insertId], (err, messageResult) => {
            if (err) {
                console.error('Error fetching sent message:', err);
                res.status(500).json({ error: 'Error fetching sent message' });
                return;
            }

            res.status(200).json(messageResult[0]);
        });
    });
};

// Mark messages as read
export const markMessagesAsRead = (req, res) => {
    const { receiver_id, sender_id, enrollment_id } = req.body;
    
    const sql = `
        UPDATE chat_messages 
        SET is_read = TRUE 
        WHERE receiver_id = ? 
        AND sender_id = ?
        AND enrollment_id = ?
        AND is_read = FALSE
    `;

    db.query(sql, [receiver_id, sender_id, enrollment_id], (err, result) => {
        if (err) {
            console.error('Error marking messages as read:', err);
            res.status(500).json({ error: 'Error marking messages as read' });
            return;
        }

        res.status(200).json({ message: 'Messages marked as read' });
    });
}; 