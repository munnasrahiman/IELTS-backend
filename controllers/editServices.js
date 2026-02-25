import db from "../config/db.js";


export const updateUser = (req, res) => {
    const { id, name, email, password, phone } = req.body;
    console.log(req.body);
    

    const sql = "UPDATE users SET name = ?, email = ?, password = ?, phone_number = ? WHERE id = ?";
    const values = [name, email, password, phone,  id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating User:', err);
            res.status(500).json({ error: 'Error updating User' });
            return;
        }
        console.log('User updated successfully');
        res.status(200).json({ message: 'User updated successfully' });
    });
}

export const updateTutor = (req, res) => {
    const { id, name, email, phone_number,language } = req.body;
    console.log(req.body);
    

    const sql = "UPDATE tutors SET name = ?, email = ?, phone_number = ?,language = ? WHERE id = ?";
    const values = [name, email, phone_number,language,  id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating Tutor:', err);
            res.status(500).json({ error: 'Error updating Tutor' });
            return;
        }
        console.log('Tutor updated successfully');
        res.status(200).json({ message: 'Tutor updated successfully' });
    });
}

export const UpdateUserStatus = (req, res) => {
    const { id, status} = req.body;
    console.log(req.body)
    
    const sql = "UPDATE users SET status = ?  WHERE id = ?";
    const values = [  status,id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating User:', err);
            res.status(500).json({ error: 'Error updating User' });
            return;
        }
        console.log('User status updated successfully');
        res.status(200).json({ message: 'Status updated successfully' });
    });
}

export const UpdateTutorStatus = (req, res) => {
    const { id, status} = req.body;
    console.log(req.body)
    
    const sql = "UPDATE tutors SET status = ?  WHERE id = ?";
    const values = [  status,id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating Tutor:', err);
            res.status(500).json({ error: 'Error updating Tutor' });
            return;
        }
        console.log('Tutor status updated successfully');
        res.status(200).json({ message: 'Status updated successfully' });
    });
}
export const Updatelanguage = (req, res) => {
    const {id} =req.params
    const {name, fee} = req.body;
    console.log(req.body)
    
    const sql = "UPDATE languages SET name = ?  , fee=?  WHERE id = ?";
    const values = [  name,fee,id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating language:', err);
            res.status(500).json({ error: 'Error updating language' });
            return;
        }
        console.log('language status updated successfully');
        res.status(200).json({ message: 'Status updated successfully' });
    });
}