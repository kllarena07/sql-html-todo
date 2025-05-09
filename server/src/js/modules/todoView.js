/**
 * Todo View module for handling UI interactions
 */
import logger from './logger.js';

/**
 * Displays todos in the DOM using server-generated HTML
 * @param {string} todosHTML - HTML string containing todo elements
 * @returns {boolean} - Success status of the operation
 */
function displayTodos(todosHTML) {
  try {
    const todoList = document.querySelector('#myTodos');
    
    // Clear the current list
    todoList.innerHTML = '';
    
    // Insert the HTML from the server
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
 * Adds event listeners to all todo buttons for deletion
 */
function addEventListenersToTodos() {
  const todoButtons = document.querySelectorAll('#myTodos .todo-btn');
  
  todoButtons.forEach(button => {
    button.addEventListener('click', function() {
      const todoId = this.dataset.todoId;
      
      if (!todoId) {
        logger.error('Todo button clicked but no todo ID found');
        return;
      }
      
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

export { displayTodos, addEventListenersToTodos, showError, showConfirmation };

