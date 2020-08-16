//!!Classes

class Budget {
	constructor(budget) {
		this.budget = Number(budget);
		this.budgetLeft = this.budget;
	}

	//subtract from budget
	subtractFromBudget(amount) {
		return (this.budgetLeft -= amount);
	}
}

class ElementUI {
	//insert budget in html
	insertBudget(amount) {
		budgetTotal.innerHTML = `${amount}`;
		budgetLeft.innerHTML = `${amount}`;
	}

	//print message
	printMessage(message, className) {
		const messagediv = document.createElement('div');

		messagediv.classList.add('text-center', 'alert', className);
		messagediv.innerText = message;

		//insert into html
		document.querySelector('.primary').insertBefore(messagediv, addExpenseForm);

		//clear the error
		setTimeout(() => {
			document.querySelector('.primary .alert').remove();
			// or messagediv.remove();

			//reset form
			addExpenseForm.reset();
		}, 3000);
	}

	//display the expenses
	addExpenseToList(name, amount) {
		const expenses = document.querySelector('#expenses ul');
		//create a li
		const myList = document.createElement('li');
		myList.className =
			'list-group-item d-flex justify-content-between align-items-center';

		//create a template to add
		myList.innerHTML = `${name} <span class="badge badge-primary badge-pill">$${amount}</span>`;

		expenses.appendChild(myList);
	}

	//track and update remaining budget
	trackBudget(amount) {
		const amountLeftThisWeek = budget.subtractFromBudget(amount);
		budgetLeft.innerHTML = `${amountLeftThisWeek}`;

		//check if amount left is less than 25%
		if (budget.budget / 4 >= amountLeftThisWeek) {
			//add styles
			budgetLeft.parentElement.parentElement.classList.remove(
				'alert-success',
				'alert-warning',
			);
			budgetLeft.parentElement.parentElement.classList.add('alert-danger');

			//check if amount left is less than 50%
		} else if (budget.budget / 2 >= amountLeftThisWeek) {
			budgetLeft.parentElement.parentElement.classList.remove('alert-success');
			budgetLeft.parentElement.parentElement.classList.add('alert-warning');
		}
	}
}

//!!variables
const addExpenseForm = document.querySelector('#add-expense'),
	budgetTotal = document.querySelector('span#total'),
	budgetLeft = document.querySelector('span#left');

let budget, userBudget;

//instantiate the ElementUI class to be accessible globally
const budgetUI = new ElementUI();

//!!event listeners
(function eventListeners() {
	//app init
	document.addEventListener('DOMContentLoaded', printPrompt);

	//when a new expense is added
	addExpenseForm.addEventListener('submit', addExpense);
})();

//!!functions

function printPrompt() {
	//get user budget
	userBudget = prompt("What's your budget for this week");

	//validate the user input
	if (userBudget === null || userBudget === 0 || isNaN(userBudget)) {
		window.location.reload();
	} else {
		//instantiate the Budget class
		budget = new Budget(userBudget);
		console.log(budget);

		//instantiate the ElementUI class
		budgetUI.insertBudget(budget.budget);
	}
}

function addExpense(e) {
	e.preventDefault();
	//get input values
	const expenseName = document.querySelector('#expense').value,
		amount = document.querySelector('#amount').value;

	if (expenseName === '' || amount === '') {
		budgetUI.printMessage(
			'There was an error, all the fields are mandatory',
			'alert-danger',
		);
	} else {
		//add expense data into the list
		budgetUI.addExpenseToList(expenseName, amount);
		budgetUI.trackBudget(amount);
		budgetUI.printMessage('Added...', 'alert-success');
		addExpenseForm.reset();
	}
}
