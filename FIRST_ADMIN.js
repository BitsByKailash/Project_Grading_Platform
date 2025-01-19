const bcrypt = require('bcrypt');
const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "grading_platform",
    password: "HareKrishnaHareKrishna123!", 
    port: 5432,
  });

(async () => {
    const username = 'KailashHari';
    const password = 'HareKrishna123!@#';
    const role = 'administrator';

    try 
    {
        const result = await pool.query(
            'INSERT INTO users (username, passwrd, usertype) VALUES ($1, $2, $3)',
            [username, password, role]
        );
        console.log('Admin user created successfully.');
    } catch (err) {
        console.error('Error creating admin:', err);
    }
})();