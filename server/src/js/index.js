/**
 * Main application entry point
 * Coordinates between all modules
 */
import logger from './modules/logger.js';
import { fetchTodos } from './modules/todoService.js';
import { displayTodos } from './modules/todoView.js';
import { setupEventListeners } from './modules/eventHandlers.js';

/**
 * Fetches todos from the server and updates the UI
 */
async function refreshTodos() {
  logger.info('Refreshing todos...');
  
  const result = await fetchTodos();
  
  if (result.success) {
    displayTodos(result.data);
  } else {
    displayTodos('<li>Failed to load todos</li>');
    logger.error('Failed to refresh todos', result.error);
  }
}

/**
 * Initializes the application
 */
function main() {
  try {
    // Set up event listeners with the refresh function
    setupEventListeners(refreshTodos);
    
    // Load initial todos
    refreshTodos();
    
    logger.info('Todo application initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize application', error);
  }
}

// Start the application
main();

