/**
 * Todo Service module for handling API interactions
 */
import logger from './logger.js';

/**
 * Fetches todos from the server
 * @returns {Promise<{success: boolean, data: string|null, error: Error|null}>}
 */
async function fetchTodos() {
  try {
    const response = await fetch('/todos');
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const todosHTML = await response.text();
    logger.info('Successfully fetched todos from server');
    
    return {
      success: true,
      data: todosHTML,
      error: null
    };
  } catch (error) {
    logger.error('Failed to fetch todos', error);
    return {
      success: false,
      data: null,
      error
    };
  }
}

/**
 * Creates a new todo on the server
 * @param {string} todoContent - The content of the todo to create
 * @returns {Promise<{success: boolean, message: string, error: Error|null}>}
 */
async function createTodo(todoContent) {
  try {
    if (!todoContent.trim()) {
      logger.warn('Cannot add empty todo');
      return {
        success: false,
        message: 'Todo content cannot be empty',
        error: null
      };
    }
    
    logger.info(`Sending request to create todo: ${todoContent}`);
    
    const response = await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo: todoContent })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      logger.info(`Todo created successfully: ${todoContent}`);
      return {
        success: true,
        message: data.message || 'Todo created successfully',
        error: null
      };
    } else {
      logger.error(`Server error creating todo: ${data.message}`);
      return {
        success: false,
        message: data.message || 'Failed to create todo',
        error: null
      };
    }
  } catch (error) {
    logger.error('Failed to add todo', error);
    return {
      success: false,
      message: 'Error connecting to server',
      error
    };
  }
}

export { fetchTodos, createTodo };

