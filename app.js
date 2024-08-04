// app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./db'); // Import the db connection

dotenv.config({ path: './.env' });

const app = express();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('view engine', 'hbs');

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/expenses', require('./routes/expenses'));
app.use('/api/categories', require('./routes/categories'));


app.listen(5000, () => {
  console.log('Server started on Port 5000');
});



// const express = require('express');
// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// const path = require('path')

// dotenv.config({ path: './.env'});

// const app = express();

// const db = mysql.createConnection({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE
// });

// const publicDirectory = path.join(__dirname, './public')
// app.use(express.static(publicDirectory));

// // Parse URL-encoded bodies (as sent by HTML forms)
// app.use(express.urlencoded({ extended: false }));
// // Parse JSON bodies (as sent by API clients)
// app.use(express.json());

// app.set('view engine', 'hbs');

// db.connect( (error) => {
//   if (error) {
//     console.log(error)
//   } else {
//     console.log("MYSQL connected successfully....")
//   }
// });

// //Define Routes
// app.use('/', require('./routes/pages'));
// app.use('/auth', require('./routes/auth'));
// app.use('/expenses', require('./routes/expenses'));


// app.listen(4000, () => {
//   console.log("Server started on Port 4000");
// });