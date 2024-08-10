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

  
  return db.query(query, [user_id], (err, results) => {
    
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log(results);
    return res.status(200).json(results);
  });
};

exports.delete = (req, res) => {
  console.log('Delete request received:', req.params);
  
  
  const { id } = req.params;

  console.log('Deleting expense with ID:', id);
  
  const query = 'DELETE FROM expenses WHERE expense_id = ?';

  return db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting expense:', err);
      return res.status(500).json({ message: 'Failed to delete expense' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.status(200).json({ message: 'Expense deleted successfully' });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { category_id, amount, date, description } = req.body;

  const query = `
    UPDATE expenses
    SET category_id = ?, amount = ?, date = ?, description = ?, updated_at = NOW()
    WHERE expense_id = ?
  `;

  db.query(query, [category_id, amount, date, description, id], (err, result) => {
    if (err) {
      console.error('Error updating expense:', err);
      return res.status(500).json({ message: 'Failed to update expense' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.status(200).json({ message: 'Expense updated successfully' });
  });
};
