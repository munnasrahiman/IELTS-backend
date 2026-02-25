import db from '../config/db.js';

export const addResource = (req, res) => {
    const { title, description, tutor_id, type, category, contentType, external_link } = req.body;
    const file = req.file;

    if (contentType !== 'link' && !file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const sql = `
        INSERT INTO resources 
        (tutor_id, title, description, file_path, file_type, type, category, content_type, external_link) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const filePath = file ? file.path : null;
    const fileType = file ? 
        (file.mimetype.startsWith('image/') ? 'image' : 
         file.mimetype.startsWith('video/') ? 'video' : 'document') 
        : 'link';

    db.query(
        sql, 
        [tutor_id, title, description, filePath, fileType, type, category, contentType, external_link],
        (err, result) => {
            if (err) {
                console.error('Error adding resource:', err);
                res.status(500).json({ error: 'Error adding resource' });
                return;
            }

            res.status(200).json({ 
                message: 'Resource added successfully',
                resource_id: result.insertId
            });
        }
    );
};

export const getResources = (req, res) => {
    const tutorId = req.params.tutorId;
    console.log(tutorId);
    console.log(req.params);

    const sql = `
        SELECT * FROM resources 
        WHERE tutor_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [tutorId], (err, results) => {
        if (err) {
            console.error('Error fetching resources:', err);
            res.status(500).json({ error: 'Error fetching resources' });
            return;
        }

        res.status(200).json(results);
    });
};

export const deleteResource = (req, res) => {
    const { id, tutor_id } = req.params;

    const sql = 'DELETE FROM resources WHERE id = ? AND tutor_id = ?';

    db.query(sql, [id, tutor_id], (err, result) => {
        if (err) {
            console.error('Error deleting resource:', err);
            res.status(500).json({ error: 'Error deleting resource' });
            return;
        }

        res.status(200).json({ message: 'Resource deleted successfully' });
    });
}; 