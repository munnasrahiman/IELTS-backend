import db from '../config/db.js'

export const addUser = (req,res)=>{
  const { name, email, password, phone} = req.body;
  
  const sql = "INSERT INTO users (name, email, password, phone_number) VALUES ( ?, ?, ?, ?)";
  const values = [name, email, password, phone];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding User:', err);
      res.status(500).json({ error: 'Error adding User' });
      return;
    }
    console.log('User added successfully');
    res.status(200).json({ message: 'User added successfully' });
  });
}

export const addTutor = (req,res)=>{
  const { name, email, phone_number, password,language} = req.body;
  
  const sql = "INSERT INTO tutors (name, email, phone_number, password,language) VALUES (? , ?, ?, ?, ?)";
  const values = [name, email, phone_number, password,language];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding Tutor:', err);
      res.status(500).json({ error: 'Error adding Tutor' });
      return;
    }
    console.log('Tutor added successfully');
    res.status(200).json({ message: 'Tutor added successfully' });
  });
}

export const addlanguage = (req,res)=>{
    const { name ,fee} = req.body;
    const sql = "INSERT INTO languages (name,fee) VALUES (?, ?)";
    const values = [name,fee];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error adding Languages:', err);
        res.status(500).json({ error: 'Error adding Languages' });
        return;
      }
      console.log('Languages added successfully');
      res.status(200).json({ message: 'Languages added successfully' });
    });
}
export const enrollCourse = (req, res) => {
  console.log(req.body);

  const { user_id, language_id, amount } = req.body;

  if (!user_id || !language_id || !amount) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sqlEnroll = `
    INSERT INTO enrolled_courses (user_id, language_id, amount, payment_status)
    VALUES (?, ?, ?, 'completed')
  `;
  const values = [user_id, language_id, amount];

  db.query(sqlEnroll, values, (err, result) => {
    if (err) {
      console.error('Error enrolling in course:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const enrollmentId = result.insertId;

    // Step 2: Find a random tutor who teaches the same language
    const sqlFindTutor = `
      SELECT tutors.id 
      FROM tutors
      JOIN languages ON tutors.language = languages.name
      WHERE languages.id = ?
      ORDER BY RAND() LIMIT 1
    `;

    db.query(sqlFindTutor, [language_id], (err, tutorResult) => {
      if (err) {
        console.error('Error finding tutor:', err);
        return res.status(500).json({ error: 'Error assigning tutor' });
      }

      if (tutorResult.length === 0) {
        return res.status(200).json({
          message: "Enrollment successful, but no tutor available",
          enrollmentId,
        });
      }

      const tutorId = tutorResult[0].id;

      // Step 3: Assign the tutor and insert into tutor_assignments
      const sqlAssignTutor = `
        INSERT INTO tutor_assignments (enrollment_id, tutor_id)
        VALUES (?, ?)
      `;

      db.query(sqlAssignTutor, [enrollmentId, tutorId], (err, assignResult) => {
        if (err) {
          console.error('Error assigning tutor:', err);
          return res.status(500).json({ error: 'Error assigning tutor' });
        }

        res.status(200).json({
          message: "Enrollment successful and tutor assigned",
          enrollmentId,
          tutorId,
        });
      });
    });
  });
};



export const addCourseProgression = (req, res) => {
  const { 
    user_id, 
    language_id, 
    enrollment_id, 
    level_number,
    level_score, 
    lesson_details 
  } = req.body;

  // Input validation
  if (!user_id || !language_id || !enrollment_id || !level_number || level_score === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO course_progression 
    (user_id, language_id, enrollment_id, level_number, level_score, lesson_details) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    user_id, 
    language_id,
    enrollment_id,
    level_number,
    level_score,
    JSON.stringify(lesson_details)
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding course progression:', err);
      res.status(500).json({ error: 'Error adding course progression' });
      return;
    }

    // Check if this was the final level (level 5)
    if (level_number === 5) {
      // Update enrolled_course status to completed
      const updateEnrollmentSql = `
        UPDATE enrolled_courses 
        SET status = 'completed' 
        WHERE id = ?
      `;

      db.query(updateEnrollmentSql, [enrollment_id], (updateErr) => {
        if (updateErr) {
          console.error('Error updating enrollment status:', updateErr);
        }
      });
    }
    
    console.log('Course progression added successfully');
    res.status(200).json({ 
      message: 'Course progression added successfully',
      progression_id: result.insertId,
      is_course_completed: level_number === 5
    });
  });
};

export const getProgressionLevel = (req, res) => {
  const { user_id, language_id, enrollment_id } = req.query;

  if (!user_id || !language_id || !enrollment_id) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const sql = `
    SELECT level_number, level_score
    FROM course_progression
    WHERE user_id = ? AND language_id = ? AND enrollment_id = ?
    ORDER BY level_number DESC
    LIMIT 1
  `;

  db.query(sql, [user_id, language_id, enrollment_id], (err, result) => {
    if (err) {
      console.error('Error fetching progression:', err);
      return res.status(500).json({ error: 'Error fetching progression' });
    }

    const currentLevel = result.length > 0 ? result[0].level_number + 1 : 1;
    res.status(200).json({
      current_level: currentLevel,
      last_score: result.length > 0 ? result[0].level_score : null
    });
  });
};





