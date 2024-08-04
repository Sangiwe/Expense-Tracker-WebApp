const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expenses');

// router.post('/add', expensesController.addExpense);
router.post('/add', (req, res) => {
  console.log('Request received at /add endpoint:', req.body);
  expensesController.addExpense(req, res);
});

router.get('/', expensesController.getExpenses);

module.exports = router;
