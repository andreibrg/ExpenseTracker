const apiPath = 'api/Expenses';
let expenses = [];
let expenseTypes = [];

function init() {
    getExpenseItems();
    getExpenseTypes();
    addValidation();
}

function getExpenseTypes() {
    fetch(`${apiPath}/expenseTypes`)
        .then(response => response.json())
        .then(data => displayExpenseTypes(data))
        .catch(error => console.error('Unable to get expense types.', error));
}

function getExpenseItems() {
    fetch(apiPath)
        .then(response => response.json())
        .then(data => displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {   
    const newExpense = {        
        TransactionDate: $('#add-date').val().trim(),
        Recipient: $('#add-recipient').val().trim(),
        Currency: $('#add-currency').val().trim(),
        Amount: parseFloat($('#add-amount').val().trim()),         
        ExpenseType: $('#add-expensetype').val().trim(),
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
            clearAddInputs();
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

function displayEditModal(id) {
    const item = expenses.find(item => item.id === id);
    $('#editExpenseModal').modal('show');
    $('#edit-id').val(item.id);
    if (item.transactionDate !== "undefined") {
        $('#edit-date').val(parseDate(item.transactionDate));
    }    
    $('#edit-recipient').val(item.recipient);
    $('#edit-amount').val(item.amount);
    $('#edit-currency').val(item.currency);
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
    const itemId = $('#edit-id').val();
    const item = {
        id: parseInt(itemId, 10),
        TransactionDate: $('#edit-date').val().trim(),
        Recipient: $('#edit-recipient').val().trim(),
        Currency: $('#edit-currency').val().trim(),
        Amount: parseFloat($('#edit-amount').val().trim()),         
        ExpenseType: $('#edit-expensetype').val().trim(),
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

function parseDate(dateInput) {
    var date = new Date(dateInput);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}

function clearAddInputs() { 
    $('#add-date').val('');
    $('#add-recipient').val('')
    $('#add-amount').val('');
    $('#add-currency').val('');
    $('#add-expensetype').prop('selectedIndex', 0);
}

function displayExpenseTypes(data) {
    const selectorList = document.getElementById('add-expensetype');
    data.forEach(item => {
        var el = document.createElement("option");
        el.text = item;
        el.value = item;
        selectorList.add(el);
    });

    expenseTypes = data;
}

function displayItems(data) {
    const tBody = document.getElementById('expenses');
    tBody.innerHTML = '';
    const button = document.createElement('button');

    data.forEach(item => {     

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditModal(${item.id})`);
        editButton.setAttribute('class', 'btn btn-secondary');        

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);
        deleteButton.setAttribute('class', 'btn btn-danger');  

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

function addValidation() {
    //force expense date to be in the past
    var dtToday = new Date();
    $('#add-date').attr('max', parseDate(dtToday));
}