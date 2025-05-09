// Modern logger function with different log levels
const logger = {
  info: (message) => {
    const now = new Date().toISOString();
    console.log(`${now} [INFO] ${message}`);
  },
  error: (message, error) => {
    const now = new Date().toISOString();
    console.error(`${now} [ERROR] ${message}`, error);
  },
  warn: (message) => {
    const now = new Date().toISOString();
    console.warn(`${now} [WARN] ${message}`);
  }
};

// Fetch todos from the server and display them
async function fetchAndDisplayTodos() {
  try {
    const response = await fetch('/todos');
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const todosHTML = await response.text();
    const todoList = document.querySelector('#myTodos');
    
    // Clear the current list
    todoList.innerHTML = '';
    
    // Add the new todos HTML
    todoList.innerHTML = todosHTML;
    
    // Add event listeners to todo items
    addEventListenersToTodos();
    
    logger.info('Successfully fetched and displayed todos');
  } catch (error) {
    logger.error('Failed to fetch todos', error);
    document.querySelector('#myTodos').innerHTML = '<li>Failed to load todos</li>';
  }
}

// Add a new todo
async function addTodo(todoContent) {
  try {
    if (!todoContent.trim()) {
      logger.warn('Cannot add empty todo');
      return;
    }
    
    // For now, we'll just create the todo locally
    // Later, this should send a POST request to the server
    const todoList = document.querySelector('#myTodos');
    const newTodoElement = createTodoElement(todoContent);
    
    todoList.appendChild(newTodoElement);
    logger.info(`Added new todo: ${todoContent}`);
    
    // TODO: Implement server-side todo creation with a POST request
    // const response = await fetch('/todos', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ todo: todoContent })
    // });
    
    // if (response.ok) {
    //   fetchAndDisplayTodos();
    // }
  } catch (error) {
    logger.error('Failed to add todo', error);
  }
}

// Create a todo element
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

// Add event listeners to all todo buttons
function addEventListenersToTodos() {
  const todoButtons = document.querySelectorAll('#myTodos button');
  
  todoButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.classList.toggle('line-through');
      logger.info(`Todo marked as ${this.classList.contains('line-through') ? 'completed' : 'active'}: ${this.textContent}`);
    });
  });
}

// Initialize the application
function main() {
  // Get references to DOM elements
  const todoInput = document.querySelector('input');
  const addTodoBtn = document.querySelector('#addTodoBtn');
  
  // Add event listener to the Add Todo button
  addTodoBtn.addEventListener('click', () => {
    addTodo(todoInput.value);
    todoInput.value = ''; // Clear the input field after adding
  });
  
  // Add event listener for pressing Enter in the input field
  todoInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      addTodo(todoInput.value);
      todoInput.value = ''; // Clear the input field after adding
    }
  });
  
  // Fetch todos when the page loads
  fetchAndDisplayTodos();
  
  logger.info('Todo application initialized');
}

// Start the application
main();
