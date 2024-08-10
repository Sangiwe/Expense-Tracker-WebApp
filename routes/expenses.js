const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expenses');

// router.post('/add', expensesController.addExpense);
router.post('/add', (req, res) => {
  console.log('Request received at /add endpoint:', req.body);
  expensesController.addExpense(req, res);
});

router.get('/get', expensesController.getExpenses);
router.delete('/delete/:id', expensesController.delete);
router.put('/edit/:id', expensesController.update);

module.exports = router;
