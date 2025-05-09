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
 * Creates a new todo element with a text button that deletes when clicked
 * @param {Todo} todo - The todo object
 * @returns {HTMLLIElement} - The created todo element
 */
function createTodoElement(todo) {
  const newTodoLI = document.createElement('li');
  const todoBtn = document.createElement('button');
  
  // Store the todo ID as a data attribute
  newTodoLI.dataset.todoId = todo.id;
  
  // Configure the todo button for deletion
  todoBtn.className = 'todo-btn cursor-pointer text-base py-1 px-2 hover:line-through transition-colors rounded';
  todoBtn.textContent = todo.todo;
  todoBtn.dataset.todoId = todo.id;
  todoBtn.setAttribute('aria-label', `Delete todo: ${todo.todo}`);
  todoBtn.title = 'Click to delete this todo';
  
  // No need for click event here as we'll handle it in addEventListenersToTodos
  
  newTodoLI.appendChild(todoBtn);
  return newTodoLI;
}

/**
 * Adds event listeners to all todo buttons for deletion
 */
function addEventListenersToTodos() {
  const todoButtons = document.querySelectorAll('#myTodos .todo-btn');
  
  todoButtons.forEach(button => {
    button.addEventListener('click', function() {
      const todoId = this.dataset.todoId;
      // The actual deletion will be handled by eventHandlers.js
      // We're just dispatching a custom event here
      const deleteEvent = new CustomEvent('todo:delete', { 
        detail: { todoId }, 
        bubbles: true 
      });
      this.dispatchEvent(deleteEvent);
      
      logger.info(`Delete requested for todo: ${this.textContent} (ID: ${todoId})`);
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

/**
 * Shows a confirmation dialog
 * @param {string} message - Confirmation message to display
 * @returns {boolean} - Whether the user confirmed the action
 */
function showConfirmation(message) {
  return confirm(message);
}

export { displayTodos, createTodoElement, addEventListenersToTodos, showError, showConfirmation };

