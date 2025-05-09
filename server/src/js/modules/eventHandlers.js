/**
 * Event Handlers module for managing user interactions
 */
import logger from './logger.js';
import { createTodo } from './todoService.js';
import { showError } from './todoView.js';

// Reference to the refresh function that will be set from index.js
let refreshTodosFunction = null;

/**
 * Set the function to refresh todos
 * @param {Function} refreshFunction - Function to call to refresh todos
 */
function setRefreshFunction(refreshFunction) {
  refreshTodosFunction = refreshFunction;
}

/**
 * Handle adding a new todo
 * @param {string} todoContent - The content of the todo to add
 */
async function handleAddTodo(todoContent) {
  if (!todoContent || !todoContent.trim()) {
    showError('Todo content cannot be empty');
    return;
  }

  const result = await createTodo(todoContent);
  
  if (result.success) {
    logger.info('Todo added successfully, refreshing list');
    if (refreshTodosFunction) {
      refreshTodosFunction();
    }
  } else {
    showError(result.message || 'Failed to add todo');
  }
}

/**
 * Setup all event listeners
 * @param {Function} refreshFunction - Function to call to refresh todos
 */
function setupEventListeners(refreshFunction) {
  // Store the refresh function for later use
  setRefreshFunction(refreshFunction);
  
  // Get references to DOM elements
  const todoInput = document.querySelector('input');
  const addTodoBtn = document.querySelector('#addTodoBtn');
  
  // Add event listener to the Add Todo button
  addTodoBtn.addEventListener('click', () => {
    handleAddTodo(todoInput.value);
    todoInput.value = ''; // Clear the input field after adding
  });
  
  // Add event listener for pressing Enter in the input field
  todoInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      handleAddTodo(todoInput.value);
      todoInput.value = ''; // Clear the input field after adding
    }
  });
  
  logger.info('Event listeners set up successfully');
}

export { setupEventListeners, handleAddTodo };

