/**
 * Todo View module for handling UI interactions
 */
import logger from './logger.js';

/**
 * Displays todos in the DOM
 * @param {string} todosHTML - HTML content for the todos
 * @returns {boolean} - Success status of the operation
 */
function displayTodos(todosHTML) {
  try {
    const todoList = document.querySelector('#myTodos');
    
    // Clear the current list
    todoList.innerHTML = '';
    
    // Add the new todos HTML
    todoList.innerHTML = todosHTML || '<li>No todos found</li>';
    
    // Add event listeners to todo items
    addEventListenersToTodos();
    
    logger.info('Successfully displayed todos in UI');
    return true;
  } catch (error) {
    logger.error('Failed to display todos', error);
    document.querySelector('#myTodos').innerHTML = '<li>Failed to load todos</li>';
    return false;
  }
}

/**
 * Creates a new todo element
 * @param {string} todoContent - The content of the todo
 * @returns {HTMLLIElement} - The created todo element
 */
function createTodoElement(todoContent) {
  const newTodoLI = document.createElement('li');
  const newTodoBtn = document.createElement('button');
  
  newTodoBtn.className = 'hover:line-through cursor-pointer text-base';
  newTodoBtn.textContent = todoContent;
  
  // Add click event to toggle completion state
  newTodoBtn.addEventListener('click', function() {
    this.classList.toggle('line-through');
    logger.info(`Todo marked as ${this.classList.contains('line-through') ? 'completed' : 'active'}: ${todoContent}`);
  });
  
  newTodoLI.appendChild(newTodoBtn);
  return newTodoLI;
}

/**
 * Adds event listeners to all todo buttons
 */
function addEventListenersToTodos() {
  const todoButtons = document.querySelectorAll('#myTodos button');
  
  todoButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.classList.toggle('line-through');
      logger.info(`Todo marked as ${this.classList.contains('line-through') ? 'completed' : 'active'}: ${this.textContent}`);
    });
  });
}

/**
 * Shows error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
  alert(message);
}

export { displayTodos, createTodoElement, addEventListenersToTodos, showError };

