﻿const apiPath = 'api/Expenses';
let expenses = [];
let expenseTypes = [];

function init() {
    getExpenseItems();
    getExpenseTypes();
    closeInput();
}

function getExpenseTypes() {
    fetch(`${apiPath}/expenseTypes`)
        .then(response => response.json())
        .then(data => _displayExpenseTypes(data))
        .catch(error => console.error('Unable to get expense types.', error));
}

function getExpenseItems() {
    fetch(apiPath)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addDateTextbox = document.getElementById('add-date');
    const addRecipientTextbox = document.getElementById('add-recipient');
    const addAmountTextbox = document.getElementById('add-amount');
    const addCurrencyTextbox = document.getElementById('add-currency');
    const addTypeList = document.getElementById('add-expensetype');

    const newExpense = {        
        TransactionDate: addDateTextbox.value.trim(),
        Recipient: addRecipientTextbox.value.trim(),
        Currency: addCurrencyTextbox.value.trim(),
        Amount: parseInt(addAmountTextbox.value.trim()),         //todo add validation, catch errors
        ExpenseType: addTypeList.value.trim(),
    };

    fetch(apiPath, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newExpense)
    })
        .then(response => response.json())
        .then(() => {
            getExpenseItems();
            _clearAddInputs();
        })
        .catch(error => console.error('Unable to add item.', error));
    $('#addExpenseModal').modal('hide');
}

function deleteItem(id) {
    fetch(`${apiPath}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getExpenseItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = expenses.find(item => item.id === id);
    $('#editExpenseModal').modal('show');

    document.getElementById('edit-id').value = item.id;
    if (item.transactionDate !== "undefined") {
        document.getElementById('edit-date').value = parseDate(item.transactionDate);
    }    
    document.getElementById('edit-recipient').value = item.recipient;
    document.getElementById('edit-amount').value = item.amount;
    document.getElementById('edit-currency').value = item.currency;
    const selectorList = document.getElementById('edit-expensetype');
    expenseTypes.forEach(expenseType => {
        var el = document.createElement("option");
        el.text = expenseType;
        el.value = expenseType;
        if (el.text == item.expenseType) { 
            el.selected = true;
        }
        selectorList.add(el);
    });
    
   
}

function updateItem() {
    const addDateTextbox = document.getElementById('edit-date');
    const addRecipientTextbox = document.getElementById('edit-recipient');
    const addAmountTextbox = document.getElementById('edit-amount');
    const addCurrencyTextbox = document.getElementById('edit-currency');
    const addTypeList = document.getElementById('edit-expensetype');
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),   
        TransactionDate: addDateTextbox.value.trim(),
        Recipient: addRecipientTextbox.value.trim(),
        Currency: addCurrencyTextbox.value.trim(),
        Amount: parseInt(addAmountTextbox.value.trim()),         //todo add validation, catch errors
        ExpenseType: addTypeList.value.trim(),
    };

    fetch(`${apiPath}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getExpenseItems())
        .catch(error => console.error('Unable to update item.', error));
    $('#editExpenseModal').modal('hide');
    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function parseDate(dateInput) {
    var date = new Date(dateInput);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}

function _clearAddInputs() {
    const addDateTextbox = document.getElementById('add-date');
    const addRecipientTextbox = document.getElementById('add-recipient');
    const addAmountTextbox = document.getElementById('add-amount');
    const addCurrencyTextbox = document.getElementById('add-currency');
    const addTypeList = document.getElementById('add-expensetype');

    addDateTextbox.value = '';
    addRecipientTextbox.value = '';
    addAmountTextbox.value = '';
    addCurrencyTextbox.value = '';      //todo extrect in method
    addTypeList.selectedIndex = 0;
}

function _displayExpenseTypes(data) {
    const selectorList = document.getElementById('add-expensetype');
    data.forEach(item => {
        var el = document.createElement("option");
        el.text = item;
        el.value = item;
        selectorList.add(el);
    });

    expenseTypes = data;
}

function _displayItems(data) {
    const tBody = document.getElementById('expenses');
    tBody.innerHTML = '';

    const button = document.createElement('button');

    data.forEach(item => {     

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let dateValue = "";
        if (item.transactionDate !== "undefined") {
            dateValue = new Date(item.transactionDate).toLocaleDateString();
        }
        let dateNode = document.createTextNode(dateValue);
        td1.appendChild(dateNode);

        let td2 = tr.insertCell(1);
        let recipientNode = document.createTextNode(item.recipient);
        td2.appendChild(recipientNode);

        let td3 = tr.insertCell(2);
        let amountNode = document.createTextNode(item.amount);
        td3.appendChild(amountNode);

        let td4 = tr.insertCell(3);
        let currencyNode = document.createTextNode(item.currency);
        td4.appendChild(currencyNode);

        let td5 = tr.insertCell(4);
        let typeNode = document.createTextNode(item.expenseType);
        td5.appendChild(typeNode);

        let td6 = tr.insertCell(5);
        td6.appendChild(editButton);

        let td7 = tr.insertCell(6);
        td7.appendChild(deleteButton);
    });

    expenses = data;
}