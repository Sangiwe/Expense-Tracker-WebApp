document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

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

  const addBtn = document.getElementById('add-button');
  const categoryInput = document.getElementById('category');
  const amountInput = document.getElementById('amount');
  const dateInput = document.getElementById('date');
  const descriptionInput = document.getElementById('description');
  const expensesTableBody = document.getElementById('expense-table-body');
  const totalAmountCell = document.getElementById('total-amount');

  let totalAmount = 0;

  addBtn.addEventListener('click', async () => {
    const category = categoryInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const description = descriptionInput.value;
  
    console.log('Adding expense:', { category, amount, date, description });

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

    // Send POST request to add the expense
    try {
      const response = await fetch('/expenses/add', {
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

  // Function to fetch and display expenses
  async function fetchExpenses() {
    try {
      const user_id = 1; // You need to get the actual user_id from the logged-in user
      const response = await fetch(`/expenses?user_id=${user_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const expenses = await response.json();
      displayExpenses(expenses);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function displayExpenses(expenses) {
    expensesTableBody.innerHTML = '';
    totalAmount = 0;
    expenses.forEach(expense => {
      totalAmount += expense.amount;

      const newRow = expensesTableBody.insertRow();
      const categoryCell = newRow.insertCell();
      const amountCell = newRow.insertCell();
      const dateCell = newRow.insertCell();
      const descriptionCell = newRow.insertCell();
      const deleteCell = newRow.insertCell();
      const deleteBtn = document.createElement('button');

      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', async () => {
        // Send DELETE request to remove the expense
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

      categoryCell.textContent = expense.category_name;
      amountCell.textContent = expense.amount;
      dateCell.textContent = expense.date;
      descriptionCell.textContent = expense.description;
      deleteCell.appendChild(deleteBtn);
    });
    totalAmountCell.textContent = totalAmount;
  }
});

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
}

//categories
document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
});

async function fetchCategories() {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories = await response.json();
    const categorySelect = document.getElementById('category');

    // Clear existing options, except for the default one
    categorySelect.innerHTML = '<option value="">Select a category</option>';

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.category_id; // Use the ID as the value
      option.textContent = category.category_name; // Display the category name
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}



// document.addEventListener('DOMContentLoaded', () => {
//   const loginForm = document.getElementById('login-form');
//   const registerForm = document.getElementById('register-form');

//   if (loginForm) {
//     loginForm.addEventListener('submit', async (event) => {
//       event.preventDefault(); // Prevent the default form submission

//       const email = document.getElementById('email').value;
//       const password = document.getElementById('password').value;

//       try {
//         const response = await fetch('/auth/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ email, password })
//         });

//         const result = await response.json();

//         if (response.ok) {
//           // Handle successful login
//           alert(result.message);
//           // Redirect or handle token as needed
//           localStorage.setItem('token', result.token);
//           window.location.href = '/';
//         } else {
//           // Handle errors
//           alert(result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     });
//   }

//   if (registerForm) {
//     registerForm.addEventListener('submit', async (event) => {
//       event.preventDefault(); // Prevent the default form submission

//       const name = document.getElementById('name').value;
//       const email = document.getElementById('email').value;
//       const password = document.getElementById('password').value;
//       const passwordConfirm = document.getElementById('passwordConfirm').value;

//       try {
//         const response = await fetch('/auth/register', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ name, email, password, passwordConfirm })
//         });

//         const result = await response.json();

//         if (response.ok) {
//           // Handle successful registration
//           alert(result.message);
//            // Store token in localStorage
//           localStorage.setItem('token', result.token);
//           // Redirect or clear form as needed
//           window.location.href = '/login';
//         } else {
//           // Handle errors
//           alert(result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     });
//   }
// });

// function validateLoginForm(email, password) {
//   if (!email || !password) {
//     alert('Please fill in all fields');
//     return false;
//   }
//   // Add more validation checks as needed
//   return true;
// }

// function validateRegisterForm(name, email, password, passwordConfirm) {
//   if (!name || !email || !password || !passwordConfirm) {
//     alert('Please fill in all fields');
//     return false;
//   }
//   if (password !== passwordConfirm) {
//     alert('Passwords do not match');
//     return false;
//   }
//   // Add more validation checks as needed
//   return true;
// }

// //add-view-edit scripts
// let expenses = [];
// let totalAmount = 0;

// const categoryInput = document.getElementById('category');
// const amountInput = document.getElementById('amount');
// const dateInput = document.getElementById('date');
// const descriptionInput = document.getElementById('description');
// const addBtn = document.getElementById('add-button');
// const expensesTableBody = document.getElementById('expense-table-body');
// const totalAmountCell = document.getElementById('total-amount');

// addBtn.addEventListener('click', function() {
//   const category = categoryInput.value;
//   const amount = Number(amountInput.value);
//   const date = dateInput.value;
//   const description = descriptionInput.value;

//   if (category === '') {
//     alert('Please enter category');
//     return;
//   }
//   if (isNaN(amount) || amount <=0) {
//     alert('Please enter valid amount');
//     return;
//   }
//   if (date === '') {
//     alert('Please enter a date');
//     return;
//   }
  
//   expenses.push({category, amount, date, description});

//   totalAmount += amount;
//   totalAmountCell.textContent = totalAmount;

//   const newRow = expensesTableBody.insertRow();

//   const categoryCell = newRow.insertCell();
//   const amountCell = newRow.insertCell();
//   const dateCell = newRow.insertCell();
//   const descriptionCell = newRow.insertCell();
//   const deleteCell = newRow.insertCell();
//   const deleteBtn = document.createElement('button');


//   deleteBtn.textContent = 'Delete';
//   deleteBtn.classList.add('delete-btn');
//   deleteBtn.addEventListener('click', function(){
//     expenses.splice(expenses.indexOf(expense), 1);

//     totalAmount -= expense.amount;
//     totalAmountCell.textContent = totalAmount;

//     expensesTableBody.removeChild(newRow);
//   });

//   const expense = expenses[expenses.length - 1];
//   categoryCell.textContent = expense.category;
//   amountCell.textContent = expense.amount;
//   dateCell.textContent = expense.date;
//   descriptionCell.textContent = expense.description;
//   deleteCell.appendChild(deleteBtn);
// });

// for (const expense of expenses) {
//   totalAmount += expense.amount;
//   totalAmountCell.textContent = totalAmount;

//   const newRow = expensesTableBody.insertRow();
//   const categoryCell = newRow.insertCell();
//   const amountCell = newRow.insertCell();
//   const dateCell = newRow.insertCell();
//   const descriptionCell = newRow.insertCell();
//   const deleteCell = newRow.insertCell();
//   const deleteBtn = document.createElement('button');

//   deleteBtn.textContext = 'Delete';
//   deleteBtn.classList.add('delete-btn');
//   deleteBtn.addEventListener('click', function(){
//     expenses.splice(expenses.indexOf(expense), 1);

//     totalAmount -= expense.amount;
//     totalAmountCell.textContent = totalAmount;

//     expensesTableBody.removeChild(newRow);
//   });

//   categoryCell.textContent = expense.category;
//   amountCell.textContent = expense.amount;
//   dateCell.textContent = expense.date;
//   descriptionCell.textContent = expense.description;
//   deleteCell.appendChild(deleteBtn);
// }

// // Fetch transactions
// async function fetchTransactions() {
//   try {
//       const response = await fetch('/api/transactions');
//       if (!response.ok) {
//           throw new Error('Failed to fetch transactions');
//       }
//       const transactions = await response.json();
//       displayTransactions(transactions);
//   } catch (error) {
//       console.error(error);
//   }
// }

// // Fetch budget settings
// async function fetchBudgetSettings() {
//   try {
//       const response = await fetch('/api/budget-settings');
//       if (!response.ok) {
//           throw new Error('Failed to fetch budget settings');
//       }
//       const budgetSettings = await response.json();
//       displayBudgetSettings(budgetSettings);
//   } catch (error) {
//       console.error(error);
//   }
// }

// // Functions to display data
// function displayTransactions(transactions) {
//   const transactionsContainer = document.getElementById('transactions');
//   transactionsContainer.innerHTML = '';
//   transactions.forEach(transaction => {
//       const transactionElement = document.createElement('div');
//       transactionElement.classList.add('transaction');
//       transactionElement.innerHTML = `
//           <div>${transaction.date}</div>
//           <div>${transaction.description}</div>
//           <div>${transaction.amount}</div>
//       `;
//       transactionsContainer.appendChild(transactionElement);
//   });
// }

// function displayBudgetSettings(budgetSettings) {
//   const budgetSettingsContainer = document.getElementById('budget-settings');
//   budgetSettingsContainer.innerHTML = '';
//   budgetSettings.forEach(setting => {
//       const settingElement = document.createElement('div');
//       settingElement.classList.add('setting');
//       settingElement.innerHTML = `
//           <div>${setting.category}</div>
//           <div>${setting.amount}</div>
//       `;
//       budgetSettingsContainer.appendChild(settingElement);
//   });
// }

// // Call the functions to fetch data when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//   fetchTransactions();
//   fetchBudgetSettings();
// });

