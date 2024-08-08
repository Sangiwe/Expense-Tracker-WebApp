const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

exports.register = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  try {
    // Validate user input
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email already exists
    const [results] = await db.promise().query('SELECT email FROM users WHERE email = ?', [email]);

    if (results.length > 0) {
      return res.status(400).json({ message: 'That email is already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert new user
    await db.promise().query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    return res.status(201).json({ message: 'User Registered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate user input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Query the database for the user
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    // Check if user exists
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




// const mysql = require('mysql2');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const db = mysql.createPool({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE
// });

// exports.register = async (req, res) => {
//   const { name, email, password, passwordConfirm } = req.body;

//   try {
//     // Check if email already exists
//     const [results] = await db.promise().query('SELECT email FROM users WHERE email = ?', [email]);

//     if (results.length > 0) {
//       return res.render('register', { message: 'That email is already in use' });
//     }

//     if (password !== passwordConfirm) {
//       return res.render('register', { message: 'Passwords do not match' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 8);

//     // Insert new user
//     await db.promise().query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

//     return res.render('register', { message: 'User Registered' });
//   } catch (error) {
//     console.error(error);
//     res.render('register', { message: 'An error occurred' });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Query the database for the user
//     const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

//     // Check if user exists
//     if (users.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = users[0];

//     // Compare provided password with hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid Email or Password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN
//     });

//     return res.status(200).json({ message: "Login successful", token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// // const mysql = require('mysql2');
// // const jwt = require('jsonwebtoken');
// // const bcrypt = require('bcryptjs');

// // const db = mysql.createConnection({
// //   host: process.env.DATABASE_HOST,
// //   user: process.env.DATABASE_USER,
// //   password: process.env.DATABASE_PASSWORD,
// //   database: process.env.DATABASE
// // });


// // exports.register = (req, res) => {
// //   console.log(req.body);

// //   const { name, email, password, passwordConfirm } = req.body;

// //   db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
// //     if(error){
// //       console.log(error);
// //     }

// //     if(results.length > 0){
// //       return res.render('register', {
// //         message: 'That email is already in use'
// //       })
// //     } else if( password !== passwordConfirm ) {
// //       return res.render('register', {
// //         message: 'Passwords do not match'
// //       });
// //     }

// //     let hashedPassword = await bcrypt.hash(password, 8);
// //     console.log(hashedPassword);

// //     db.query('INSERT INTO users SET ?', {username: name, email: email, password: hashedPassword }, (error, results) =>{
// //       if(error){
// //         console.log(error);
// //       } else {
// //         console.log(results);
// //         return res.render('register', {
// //           message: 'User Registered'
// //         });
// //       }
// //     })

// //   }); 
// // }

// // exports.login = async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     // Query the database for the user
// //     const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

// //     // Check if user exists
// //     if (users.length === 0) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     const user = users[0];

// //     // Compare provided password with hashed password
// //     const isPasswordValid = await bcrypt.compare(password, user.password);

// //     if (!isPasswordValid) {
// //       return res.status(400).json({ message: "Invalid Email or Password" });
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
// //       expiresIn: process.env.JWT_EXPIRES_IN
// //     });

// //     return res.status(200).json({
// //       message: "Login successful",
// //       token
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
