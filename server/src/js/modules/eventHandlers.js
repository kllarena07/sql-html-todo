/**
 * Event Handlers module for managing user interactions
 */
import logger from './logger.js';
import { createTodo, deleteTodo } from './todoService.js';
import { showError, showConfirmation } from './todoView.js';

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
 * Handle deleting a todo
 * @param {number} todoId - The ID of the todo to delete
 * @param {boolean} [skipConfirmation=false] - Whether to skip the confirmation dialog
 */
async function handleDeleteTodo(todoId, skipConfirmation = false) {
  if (!todoId) {
    showError('Cannot delete todo: Missing ID');
    return;
  }

  // Confirm deletion if not skipped
  if (!skipConfirmation && !showConfirmation('Are you sure you want to delete this todo?')) {
    logger.info(`Deletion of todo with ID ${todoId} cancelled by user`);
    return;
  }

  const result = await deleteTodo(todoId);
  
  if (result.success) {
    logger.info(`Todo with ID ${todoId} deleted successfully, refreshing list`);
    if (refreshTodosFunction) {
      refreshTodosFunction();
    }
  } else {
    showError(result.message || 'Failed to delete todo');
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
  
  // Add event listener for todo:delete custom event using event delegation
  const todoList = document.querySelector('#myTodos');
  todoList.addEventListener('todo:delete', (event) => {
    // Extract todoId from the custom event detail
    const todoId = event.detail.todoId;
    if (todoId) {
      logger.info(`Received todo:delete event for todo ID: ${todoId}`);
      handleDeleteTodo(todoId, true); // Pass true to skip confirmation
    } else {
      logger.error('Received todo:delete event but no todo ID found in event details');
    }
  });
  
  logger.info('Event listeners set up successfully');
}

export { setupEventListeners, handleAddTodo, handleDeleteTodo };

