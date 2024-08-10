document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  console.log(registerForm);

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
          // Handle successful login
          alert(result.message);
          // Redirect or handle token as needed
          localStorage.setItem('token', result.token);
          window.location.href = '/';
        } else {
          // Handle errors
          alert(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;

      try {
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password, passwordConfirm })
        });

        const result = await response.json();

        if (response.ok) {
          // Handle successful registration
          alert(result.message);
          // Store token in localStorage
          localStorage.setItem('token', result.token);
          // Redirect or clear form as needed
          window.location.href = '/login';
        } else {
          // Handle errors
          alert(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }

  // Fetch and display expenses when the page loads
fetchExpenses();

const form = document.getElementById('expense-form');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const descriptionInput = document.getElementById('description');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

let totalAmount = 0;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const category = categoryInput.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const description = descriptionInput.value;
  const expenseId = form.dataset.editId; // Get the edit ID if present

  if (category === '') {
    alert('Please enter category');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter valid amount');
    return;
  }
  if (date === '') {
    alert('Please enter a date');
    return;
  }

  try {

    let response;
    let result;

    if (expenseId) {
      // Editing an existing expense
      response = await fetch(`/expenses/edit/${expenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          category_id: 1, // Replace with actual category_id
          amount, 
          date, 
          description 
        })
      });
      result = await response.json();
    } else {
      // Adding a new expense
      response = await fetch('/expenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          user_id: 1, // You need to get the actual user_id from the logged-in user 
          category_id: 1, // Replace with actual category_id
          amount, 
          date, 
          description 
        })
      });
      result = await response.json();
    }

    if (response.ok) {
      alert(result.message);
      fetchExpenses(); // Refresh the expenses list
      form.reset(); // Reset form and clear edit ID
      delete form.dataset.editId;
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// form.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const category = categoryInput.value;
//   const amount = Number(amountInput.value);
//   const date = dateInput.value;
//   const description = descriptionInput.value;
//   const expenseId = form.dataset.editId;

//   console.log('Adding expense:', { category, amount, date, description });

//   if (category === '') {
//     alert('Please enter category');
//     return;
//   }
//   if (isNaN(amount) || amount <= 0) {
//     alert('Please enter valid amount');
//     return;
//   }
//   if (date === '') {
//     alert('Please enter a date');
//     return;
//   }

//   // Send POST request to add the expense
//   try {
//     const response = await fetch('/expenses/add', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ 
//         user_id: 1, // You need to get the actual user_id from the logged-in user 
//         category_id: 1, // Replace with actual category_id
//         amount, 
//         date, 
//         description 
//       })
//     });

//     const result = await response.json();

//     if (response.ok) {
//       alert(result.message);
//       fetchExpenses(); // Refresh the expenses list
//     } else {
//       alert(result.message);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// });

// Function to fetch and display expenses
async function fetchExpenses() {
  try {
    const user_id = 1; // You need to get the actual user_id from the logged-in user
    const response = await fetch(`/expenses/get?user_id=${user_id}`);
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    const expenses = await response.json();
    console.log(expenses, '*******');
    displayExpenses(expenses);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayExpenses(expenses) {
  expensesTableBody.innerHTML = '';
  totalAmount = 0;
  expenses.forEach(expense => {
    totalAmount += parseFloat(expense.amount);

    const newRow = expensesTableBody.insertRow();
    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const descriptionCell = newRow.insertCell();
    const actionsCell = newRow.insertCell(); // Single cell for both Edit and Delete buttons

    // Create Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.style.marginRight = '10px'; // Add some space between buttons
    deleteBtn.addEventListener('click', async () => {
      try {
        const response = await fetch(`/expenses/delete/${expense.expense_id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          fetchExpenses(); // Refresh the expenses list
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });

    // Create Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => {
      // Populate the form fields with the expense data
      categoryInput.value = expense.category_name;
      amountInput.value = expense.amount;
      dateInput.value = expense.date;
      descriptionInput.value = expense.description;
      
      // Set up a flag or id to identify this expense when updating
      form.dataset.editId = expense.expense_id;
    });

    // Add both buttons to the actionsCell
    actionsCell.appendChild(deleteBtn);
    actionsCell.appendChild(editBtn);

    categoryCell.textContent = expense.category_name;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;
    descriptionCell.textContent = expense.description;
  });
  totalAmountCell.textContent = totalAmount.toFixed(2);
  console.log('Total Amount:', totalAmount);
}

// function displayExpenses(expenses) {
//   expensesTableBody.innerHTML = '';
//   totalAmount = 0;
//   expenses.forEach(expense => {
//     totalAmount += expense.amount;

//     const newRow = expensesTableBody.insertRow();
//     const categoryCell = newRow.insertCell();
//     const amountCell = newRow.insertCell();
//     const dateCell = newRow.insertCell();
//     const descriptionCell = newRow.insertCell();
//     const actionsCell = newRow.insertCell(); // Single cell for both Edit and Delete buttons
 

//     deleteBtn.textContent = 'Delete';
//     deleteBtn.classList.add('delete-btn');

//     deleteBtn.addEventListener('click', async () => {
//       console.log('Delete button clicked');
//       // Send DELETE request to remove the expense
//       try {
//         const response = await fetch(`/expenses/delete/${expense.expense_id}`, {
//           method: 'DELETE'
//         });

//         const result = await response.json();

//         if (response.ok) {
//           alert(result.message);
//           fetchExpenses(); //Refresh the expenses list
//           fetchTransactions();
//         } else {
//           alert(result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     });

//      // Create Edit button
//      const editBtn = document.createElement('button');
//      editBtn.textContent = 'Edit';
//      editBtn.classList.add('edit-btn');
//      editBtn.addEventListener('click', () => {
//        // Populate the form fields with the expense data
//        categoryInput.value = expense.category_name;
//        amountInput.value = expense.amount;
//        dateInput.value = expense.date;
//        descriptionInput.value = expense.description;
       
//        // Set up a flag or id to identify this expense when updating
//        form.dataset.editId = expense.expense_id;
//      });

//     categoryCell.textContent = expense.category_name;
//     amountCell.textContent = expense.amount;
//     dateCell.textContent = expense.date;
//     descriptionCell.textContent = expense.description;
//     deleteCell.appendChild(deleteBtn);
//     editCell.appendChild(editBtn);
//   });
//   totalAmountCell.textContent = totalAmount;
// }

async function fetchTransactions() {
  try {
    const response = await fetch('/api/transactions');
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    const transactions = await response.json();
    console.log('Fetched transactions:', transactions);
    displayTransactions(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};
});


