import { getAllTodos, createTodo, deleteTodo, execPromise, _log } from "./utils.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go up one level to the server directory where .env is located
const serverDir = path.dirname(__dirname);

dotenv.config({ path: path.join(serverDir, ".env") });

const PATH_TO_TEST_DB = process.env.PATH_TO_TEST_DB;

async function initTestDB() {
  const SQL = `
    CREATE TABLE todos (
      id INTEGER PRIMARY KEY,
      todo TEXT NOT NULL
    );
  `;

  const { stderr } = await execPromise(`sqlite3 ${PATH_TO_TEST_DB} '${SQL}'`);

  if (stderr) {
    _log(`Error creating test db: ${stderr}`, "error");
  }
}

async function deleteTestDB() {
  const { stderr } = await execPromise(`rm -rf ${PATH_TO_TEST_DB}`);

  if (stderr) {
    _log(`Error deleting test db: ${stderr}`, "error");
  }
}

(async () => {
  try {
    _log("Test database path: " + PATH_TO_TEST_DB, "info");
    await deleteTestDB();
    await initTestDB();
    _log("Test database initialized successfully", "info");

    // RUN TESTS
    _log("Running test: createTodo", "info");
    const [_, err] = await createTodo(PATH_TO_TEST_DB, "run a test script");
    if (err) {
      throw new Error(err);
    } else {
      _log("Todo created successfully", "info");

      // Test getAllTodos
      _log("Running test: getAllTodos", "info");
      const [todos, todosErr] = await getAllTodos(PATH_TO_TEST_DB);
      if (todosErr) {
        throw new Error(todosErr);
      } else {
        // Check that todos is an array
        if (!Array.isArray(todos)) {
          throw new Error("Expected todos to be an array, but got: " + typeof todos);
        }
        
        // Check that the array is not empty
        if (todos.length === 0) {
          throw new Error("Expected todos array to have at least one item, but it was empty");
        }
        
        // Check that each todo has the correct schema
        for (const todo of todos) {
          // Check that todo is an object
          if (typeof todo !== 'object' || todo === null) {
            throw new Error(`Expected todo to be an object, but got: ${typeof todo}`);
          }
          
          // Check that todo has 'id' property and it's a number
          if (!('id' in todo)) {
            throw new Error(`Todo object is missing 'id' property: ${JSON.stringify(todo)}`);
          }
          if (typeof todo.id !== 'number') {
            throw new Error(`Expected todo.id to be a number, but got: ${typeof todo.id}`);
          }
          
          // Check that todo has 'todo' property and it's a string
          if (!('todo' in todo)) {
            throw new Error(`Todo object is missing 'todo' property: ${JSON.stringify(todo)}`);
          }
          if (typeof todo.todo !== 'string') {
            throw new Error(`Expected todo.todo to be a string, but got: ${typeof todo.todo}`);
          }
        }
        
        // Check that the todo we created exists in the array
        const createdTodo = todos.find(item => item.todo === "run a test script");
        if (!createdTodo) {
          throw new Error(`Expected to find a todo with text 'run a test script', but none was found in: ${JSON.stringify(todos)}`);
        }
        
        _log(
          "Todos retrieved successfully: " + JSON.stringify(todos),
          "info",
        );
      }
    }

    // Test deleteTodo
    _log("Running test: deleteTodo", "info");
    
    // First, create a todo to delete
    const todoToDelete = "todo item to be deleted";
    const [createResult, createErr] = await createTodo(PATH_TO_TEST_DB, todoToDelete);
    
    if (createErr) {
      throw new Error(`Failed to create test todo for deletion: ${createErr}`);
    }
    
    // Get all todos to find the ID of our test todo
    const [todosBeforeDelete, todosBeforeErr] = await getAllTodos(PATH_TO_TEST_DB);
    
    if (todosBeforeErr) {
      throw new Error(`Failed to retrieve todos before delete test: ${todosBeforeErr}`);
    }
    
    const todoToDeleteObj = todosBeforeDelete.find(item => item.todo === todoToDelete);
    
    if (!todoToDeleteObj) {
      throw new Error(`Could not find the todo '${todoToDelete}' to delete in the database`);
    }
    
    // Now delete the todo
    const [deleteResult, deleteErr] = await deleteTodo(PATH_TO_TEST_DB, todoToDeleteObj.id);
    
    if (deleteErr) {
      throw new Error(`Failed to delete todo: ${deleteErr}`);
    }
    
    // Verify the todo was deleted by getting all todos again
    const [todosAfterDelete, todosAfterErr] = await getAllTodos(PATH_TO_TEST_DB);
    
    if (todosAfterErr) {
      throw new Error(`Failed to retrieve todos after delete: ${todosAfterErr}`);
    }
    
    // Check that the deleted todo is no longer in the database
    const deletedTodoStillExists = todosAfterDelete.some(item => item.id === todoToDeleteObj.id);
    
    if (deletedTodoStillExists) {
      throw new Error(`Todo with ID ${todoToDeleteObj.id} was not deleted successfully`);
    }
    
    _log(`Todo with ID ${todoToDeleteObj.id} deleted successfully`, "info");

    await deleteTestDB();
    _log("Test cleanup completed", "info");
  } catch (error) {
    _log("Test execution failed: " + error.message, "error");
    // Ensure cleanup happens even if tests fail
    await deleteTestDB().catch((e) =>
      _log("Cleanup failed: " + e.message, "error"),
    );
    process.exit(1); // Exit with error code
  }
})();
