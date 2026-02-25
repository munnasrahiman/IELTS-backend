import db from '../config/db.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to load images
const loadImage = (imagePath) => {
  return path.join(__dirname, '..', 'assets', imagePath);
};

export const generateCertificate = async (req, res) => {
    const { userId, languageId, enrollmentId } = req.query;

    try {
        // First check if all levels are completed
        const checkLevelsSql = `
            SELECT COUNT(*) as completed_levels,
                   AVG(level_score) as average_score
            FROM course_progression
            WHERE user_id = ? 
            AND language_id = ?
            AND enrollment_id = ?
            AND level_score IS NOT NULL`;

        db.query(checkLevelsSql, [userId, languageId, enrollmentId], async (levelErr, levelResults) => {
            if (levelErr) {
                console.error('Error checking levels:', levelErr);
                return res.status(500).json({ error: 'Error checking course completion' });
            }

            const completedLevels = levelResults[0].completed_levels;
            const averageScore = levelResults[0].average_score;

            if (completedLevels < 5) {
                return res.status(400).json({ 
                    error: `Course not completed. ${completedLevels}/5 levels completed.` 
                });
            }

            if (!averageScore) {
                return res.status(400).json({ error: 'No scores recorded for this course.' });
            }

            // Check if certificate already exists
            const checkCertSql = `
                SELECT * FROM certificates 
                WHERE user_id = ? 
                AND language_id = ? 
                AND enrollment_id = ?`;

            db.query(checkCertSql, [userId, languageId, enrollmentId], async (certErr, certResults) => {
                if (certErr) {
                    console.error('Error checking certificate:', certErr);
                    return res.status(500).json({ error: 'Error checking existing certificate' });
                }

                if (certResults.length > 0) {
                    return res.json(certResults[0]);
                }

                // Get user and course details
                const detailsSql = `
                    SELECT 
                        u.name as student_name,
                        l.name as language_name,
                        DATE_FORMAT(NOW(), '%d %M %Y') as completion_date
                    FROM users u
                    JOIN languages l ON l.id = ?
                    WHERE u.id = ?`;

                db.query(detailsSql, [languageId, userId], async (detailsErr, detailsResults) => {
                    if (detailsErr || detailsResults.length === 0) {
                        console.error('Error getting details:', detailsErr);
                        return res.status(500).json({ error: 'Error getting user details' });
                    }

                    const userData = detailsResults[0];
                    const avgScore = parseFloat(averageScore);

                    // Determine certificate type
                    let certificateType = '';
                    let badgeColor = '';
                    if (avgScore >= 80) {
                        certificateType = 'Advanced';
                        badgeColor = '#FFD700'; // Gold
                    } else if (avgScore >= 60) {
                        certificateType = 'Intermediate';
                        badgeColor = '#C0C0C0'; // Silver
                    } else if (avgScore >= 40) {
                        certificateType = 'Beginner';
                        badgeColor = '#CD7F32'; // Bronze
                    }

                    // Create PDF
                    const doc = new PDFDocument({
                        layout: 'landscape',
                        size: 'A4',
                        margin: 0
                    });

                    const certificateDir = path.join(__dirname, '..', 'certificates');
                    if (!fs.existsSync(certificateDir)) {
                        fs.mkdirSync(certificateDir, { recursive: true });
                    }

                    const fileName = `certificate_${userId}_${languageId}_${Date.now()}.pdf`;
                    const filePath = path.join(certificateDir, fileName);
                    const writeStream = fs.createWriteStream(filePath);
                    doc.pipe(writeStream);

                    // Add background
                    doc.rect(0, 0, doc.page.width, doc.page.height)
                       .fill('#f8f9fa');

                    // Add decorative border
                    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
                       .lineWidth(2)
                       .stroke('#1976d2');

                    // Add header image/logo if exists
                    try {
                        const logoPath = loadImage('logo.png');
                        doc.image(logoPath, doc.page.width/2 - 50, 40, {
                            width: 100
                        });
                    } catch (err) {
                        console.log('Logo not found, skipping...');
                    }

                    // Add certificate title
                    doc.font('Helvetica-Bold')
                       .fontSize(40)
                       .fillColor('#1976d2')
                       .text('Certificate of Completion', 0, 150, {
                           align: 'center'
                       });

                    // Add decorative line
                    const lineY = 200;
                    doc.moveTo(doc.page.width/2 - 100, lineY)
                       .lineTo(doc.page.width/2 + 100, lineY)
                       .lineWidth(1)
                       .stroke('#1976d2');

                    // Add main content
                    doc.font('Helvetica')
                       .fontSize(24)
                       .fillColor('#333')
                       .text('This is to certify that', 0, 250, {
                           align: 'center'
                       });

                    // Student name
                    doc.font('Helvetica-Bold')
                       .fontSize(32)
                       .fillColor('#000')
                       .text(userData.student_name, 0, 300, {
                           align: 'center'
                       });

                    // Course details
                    doc.font('Helvetica')
                       .fontSize(24)
                       .fillColor('#333')
                       .text('has successfully completed the', 0, 350, {
                           align: 'center'
                       });

                    doc.font('Helvetica-Bold')
                       .fontSize(28)
                       .fillColor('#1976d2')
                       .text(`${certificateType} ${userData.language_name} Course`, 0, 400, {
                           align: 'center'
                       });

                    // Add score
                    doc.font('Helvetica')
                       .fontSize(20)
                       .fillColor('#666')
                       .text(`with an outstanding score of ${Math.round(avgScore)}%`, 0, 450, {
                           align: 'center'
                       });

                    // Add date
                    doc.font('Helvetica')
                       .fontSize(16)
                       .fillColor('#666')
                       .text(`Awarded on ${userData.completion_date}`, 0, 500, {
                           align: 'center'
                       });

                    // Add certificate ID
                    const certificateId = `${userId}${languageId}${Date.now()}`.slice(-8);
                    doc.font('Helvetica')
                       .fontSize(10)
                       .fillColor('#999')
                       .text(`Certificate ID: ${certificateId}`, 50, doc.page.height - 50);

                    // Add signature placeholder
                    doc.font('Helvetica-Bold')
                       .fontSize(14)
                       .fillColor('#333')
                       .text('_______________________', doc.page.width - 250, doc.page.height - 100, {
                           align: 'center'
                       })
                       .fontSize(12)
                       .text('Course Director', doc.page.width - 250, doc.page.height - 70, {
                           align: 'center'
                       });

                    // Add badge/seal
                    doc.circle(100, doc.page.height - 100, 30)
                       .lineWidth(2)
                       .stroke(badgeColor)
                       .fillOpacity(0.1)
                       .fill(badgeColor);

                    doc.end();

                    // Save to database when PDF is finished
                    writeStream.on('finish', () => {
                        const saveSql = `
                            INSERT INTO certificates 
                            (user_id, language_id, enrollment_id, certificate_type, average_score, file_path) 
                            VALUES (?, ?, ?, ?, ?, ?)`;

                        db.query(saveSql, 
                            [userId, languageId, enrollmentId, certificateType, avgScore, fileName],
                            (saveErr) => {
                                if (saveErr) {
                                    console.error('Error saving certificate:', saveErr);
                                    return res.status(500).json({ error: 'Error saving certificate' });
                                }

                                res.json({
                                    certificate_type: certificateType,
                                    average_score: avgScore,
                                    file_path: fileName
                                });
                            }
                        );
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating certificate' });
    }
};

export const getCertificate = async (req, res) => {
    const { userId, languageId, enrollmentId } = req.query;

    const sql = `
        SELECT * FROM certificates 
        WHERE user_id = ? 
        AND language_id = ? 
        AND enrollment_id = ?
    `;

    db.query(sql, [userId, languageId, enrollmentId], (err, results) => {
        if (err) {
            console.error('Error fetching certificate:', err);
            return res.status(500).json({ error: 'Error fetching certificate' });
        }

        if (results.length === 0) {
            return res.json(null); // Return null if no certificate exists
        }

        res.json(results[0]);
    });
}; 