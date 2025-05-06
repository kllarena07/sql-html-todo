const addItemButton = document.getElementById('add-item');
const todoList = document.getElementById('todo-list');
const newItemInput = document.getElementById('new-item');

addItemButton.addEventListener('click', () => {
    const newItem = newItemInput.value;

    if (newItem === '' || !newItem) {
        alert('Please enter a valid item');
        return;
    }

    const listItem = document.createElement('li');
    listItem.textContent = newItem;
    todoList.appendChild(listItem);
    newItemInput.value = '';
});
