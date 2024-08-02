const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const sql = require('mssql/msnodesqlv8');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Configuration de la base de données SQL Server
const dbConfig = {
    server: 'ADLENE\\SQLEXPRESS', // Nom du serveur
    database: 'demande_formation',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        useUTC: true
    }
};

sql.connect(dbConfig, err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

app.post('/submit', (req, res) => {
    const { employeeName, courseProvider, courseCode, courseTitle, registrationDeadline, category, learningMode, courseLanguage, courseDuration, courseFee, courseStartDate } = req.body;

    const request = new sql.Request();
    const query = `
        INSERT INTO demandes (employee_name, course_provider, course_code, course_title, registration_deadline, category, learning_mode, course_language, course_duration, course_fee, course_start_date)
        VALUES (@employeeName, @courseProvider, @courseCode, @courseTitle, @registrationDeadline, @category, @learningMode, @courseLanguage, @courseDuration, @courseFee, @courseStartDate)`;

    request.input('employeeName', sql.NVarChar, employeeName)
        .input('courseProvider', sql.NVarChar, courseProvider)
        .input('courseCode', sql.NVarChar, courseCode)
        .input('courseTitle', sql.NVarChar, courseTitle)
        .input('registrationDeadline', sql.Date, registrationDeadline)
        .input('category', sql.NVarChar, category)
        .input('learningMode', sql.NVarChar, learningMode)
        .input('courseLanguage', sql.NVarChar, courseLanguage)
        .input('courseDuration', sql.Int, courseDuration)
        .input('courseFee', sql.Decimal(10, 2), courseFee)
        .input('courseStartDate', sql.Date, courseStartDate)
        .query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            // Send email notification to the manager
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'votre.email@gmail.com',
                    pass: 'votre_mot_de_passe'
                }
            });

            const mailOptions = {
                from: 'votre.email@gmail.com',
                to: 'ChBerge@lacitec.on.ca',
                subject: 'Nouvelle demande de formation',
                text: `Une nouvelle demande de formation a été soumise par ${employeeName}. Veuillez vérifier et approuver la demande.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).send(error);
                }
                res.send('Demande de formation soumise avec succès!');
            });
        });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


