import db from "../config/db.js";

export const getStaff = (req,res)=>{
    const { userType } = req.body;

    const sql = "Select * from users where user_type =  ?";
    const values = [userType];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error getting staff:', err);
        res.status(500).json({ error: 'Error ' });
        return;
      }
      console.log('Staff retrieved');
      res.status(200).json({ data:result });
    });
}

export const getAllLanguages = (req,res)=>{
    const sql = "Select * from languages ";
    db.query(sql,(err, result) => {
      if (err) {
        console.error('Error getting languages:', err);
        res.status(500).json({ error: 'Error ' });
        return;
      }
      res.status(200).json({ data:result });
    });
}

export const getAllPlots = (req,res)=>{
    const sql = "Select * from plots ";
    db.query(sql,(err, result) => {
      if (err) {
        console.error('Error getting plots:', err);
        res.status(500).json({ error: 'Error ' });
        return;
      }
      res.status(200).json({ data:result });
    });
}
export const getPlotSlotsByIdAndType = (req, res) => {
  const { plot_id, vehicle_type } = req.query;

  console.log(req.query);

  const sql = "SELECT * FROM plot_slots WHERE plot_id = ? AND vehicle_type = ?";

  db.query(sql, [plot_id, vehicle_type], (err, result) => {
    if (err) {
      console.error("Error retrieving plot slots:", err);
      res.status(500).json({ error: "Error retrieving plot slots." });
      return;
    }
    res.status(200).json({ data: result });
  });
};

export const getUserCourses = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      enrolled_courses.*, 
      languages.name AS language_name,
      tutors.name AS tutor_name,
      tutors.id AS tutor_id,
      tutors.email AS tutor_email,
      tutors.phone_number AS tutor_phone_number
    FROM enrolled_courses
    LEFT JOIN languages ON enrolled_courses.language_id = languages.id
    LEFT JOIN tutor_assignments ON enrolled_courses.id = tutor_assignments.enrollment_id
    LEFT JOIN tutors ON tutor_assignments.tutor_id = tutors.id
    WHERE enrolled_courses.user_id = ?;
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error getting enrolled courses:', err);
      res.status(500).json({ error: 'Error retrieving enrolled courses' });
      return;
    }
    res.status(200).json({ data: result });
  });
};


export const getAllseats = (req,res)=>{
    const sql = "Select * from seats ";
    db.query(sql,(err, result) => {
      if (err) {
        console.error('Error getting seats:', err);
        res.status(500).json({ error: 'Error ' });
        return;
      }
      res.status(200).json({ data:result });
    });
}

export const getAllUsers = (req,res)=>{
    const sql = "Select * from users ";
    db.query(sql,(err, result) => {
      if (err) {
        console.error('Error getting products:', err);
        res.status(500).json({ error: 'Error ' });
        return;
      }
      // console.log('all users successfully ');
      res.status(200).json({ data:result });
    });
}

export const getAllTutors = (req,res)=>{
  const sql = "Select * from tutors ";
  db.query(sql,(err, result) => {
    if (err) {
      console.error('Error getting products:', err);
      res.status(500).json({ error: 'Error ' });
      return;
    }
    // console.log('all users successfully ');
    res.status(200).json({ data:result });
  });
}



export const getAllSlotBookings = (req, res) => {
  const bookingquery = "SELECT * FROM slot_bookings";

  db.query(bookingquery, (error, results) => {
    if (error) {
      console.error('Error retrieving bookings:', error);
      res.status(500).json({ error: 'Error retrieving bookings' });
      return;
    }

    res.status(200).json({ data:results });
  });
};

