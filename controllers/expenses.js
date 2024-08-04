const db = require('../db'); 

exports.addExpense = (req, res) => {
  const { user_id, category_id, amount, date, description } = req.body;

  console.log('Received data:', { user_id, category_id, amount, date, description });
  
  const query = `
    INSERT INTO expenses (user_id, category_id, amount, date, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(query, [user_id, category_id, amount, date, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'Expense added successfully' });
  });
};

exports.getExpenses = (req, res) => {
  const { user_id } = req.query;

  const query = `
    SELECT e.*, c.category_name FROM expenses e
    JOIN categories c ON e.category_id = c.category_id
    WHERE e.user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json(results);
  });
};
