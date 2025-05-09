import { getAllTodos, createTodo, execPromise, _log } from "./utils.js";
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
        _log("Todos retrieved successfully: " + JSON.stringify(todos), "info");
      }
    }

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
