const bcrypt = require('bcrypt');
const saltRounds = 10; // Salt rounds for bcrypt

const password = 'HareKrishnaHareKrishna123!'; // The plain-text password you want to hash

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  // Insert the hashed password into the database here
  console.log('Hashed password:', hashedPassword);
});
