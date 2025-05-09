/**
 * Todo View module for handling UI interactions
 */
import logger from './logger.js';

/**
 * Todo object structure - imported from todoService
 * @typedef {Object} Todo
 * @property {number} id - The unique identifier of the todo
 * @property {string} todo - The todo text content
 */

/**
 * Displays todos in the DOM
 * @param {Array<Todo>} todos - Array of todo objects to display
 * @returns {boolean} - Success status of the operation
 */
function displayTodos(todos) {
  try {
    const todoList = document.querySelector('#myTodos');
    
    // Clear the current list
    todoList.innerHTML = '';
    
    // Check if we have todos to display
    if (!todos || todos.length === 0) {
      todoList.innerHTML = '<li>No todos found</li>';
      logger.info('No todos to display');
      return true;
    }
    
    // Create and append todo elements
    todos.forEach(todo => {
      const todoElement = createTodoElement(todo);
      todoList.appendChild(todoElement);
    });
    
    // Add event listeners to todo items
    addEventListenersToTodos();
    
    logger.info(`Successfully displayed ${todos.length} todos in UI`);
    return true;
  } catch (error) {
    logger.error('Failed to display todos', error);
    document.querySelector('#myTodos').innerHTML = '<li>Failed to load todos</li>';
    return false;
  }
}

/**
 * Creates a new todo element
 * @param {Todo} todo - The todo object
 * @returns {HTMLLIElement} - The created todo element
 */
function createTodoElement(todo) {
  const newTodoLI = document.createElement('li');
  const newTodoBtn = document.createElement('button');
  
  // Store the todo ID as a data attribute for future functionality
  newTodoLI.dataset.todoId = todo.id;
  
  newTodoBtn.className = 'hover:line-through cursor-pointer text-base';
  newTodoBtn.textContent = todo.todo;
  
  // Add click event to toggle completion state
  newTodoBtn.addEventListener('click', function() {
    this.classList.toggle('line-through');
    logger.info(`Todo marked as ${this.classList.contains('line-through') ? 'completed' : 'active'}: ${todo.todo} (ID: ${todo.id})`);
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

