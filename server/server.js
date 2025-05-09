import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { _log, getAllTodos, createTodo, deleteTodo } from "./utils/utils.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());

app.get("/todos", async (req, res) => {
  try {
    const [todos, error] = await getAllTodos(process.env.PATH_TO_DB);

    if (error) {
      _log(`Error retrieving todos: ${error}`, "error");
      return res.status(500).send("<p class='text-red-500'>Error loading todos</p>");
    }

    let todosHTML = "";
    
    if (todos && todos.length > 0) {
      todos.forEach(todo => {
        // Create HTML for each todo with proper attributes and styles
        todosHTML += `
          <li data-todo-id="${todo.id}">
            <button 
              class="todo-btn cursor-pointer text-base py-1 px-2 hover:line-through transition-colors rounded"
              data-todo-id="${todo.id}"
              aria-label="Delete todo: ${todo.todo}"
              title="Click to delete this todo"
            >
              ${todo.todo}
            </button>
          </li>
        `;
      });
      
      _log(`Generated HTML for ${todos.length} todos`, "info");
    } else {
      todosHTML = "<li>No todos found</li>";
      _log("No todos to display", "info");
    }

    res.send(todosHTML);
  } catch (err) {
    _log(`Unexpected error in /todos route: ${err.message}`, "error");
    res.status(500).send("<p class='text-red-500'>Server error</p>");
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { todo } = req.body;
    
    if (!todo || todo.trim() === "") {
      _log("Attempt to create empty todo", "warn");
      return res.status(400).json({ success: false, message: "Todo cannot be empty" });
    }
    
    const [data, error] = await createTodo(process.env.PATH_TO_DB, todo);
    
    if (error) {
      _log(`Error creating todo: ${error}`, "error");
      return res.status(500).json({ success: false, message: "Failed to create todo" });
    }
    
    _log(`Created new todo: ${todo}`, "info");
    return res.status(201).json({ success: true, message: "Todo created successfully" });
  } catch (err) {
    _log(`Unexpected error in POST /todos route: ${err.message}`, "error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    
    if (!todoId) {
      _log("Attempt to delete todo without ID", "warn");
      return res.status(400).json({ success: false, message: "Todo ID is required" });
    }
    
    const [data, error] = await deleteTodo(process.env.PATH_TO_DB, todoId);
    
    if (error) {
      _log(`Error deleting todo: ${error}`, "error");
      return res.status(500).json({ success: false, message: "Failed to delete todo" });
    }
    
    _log(`Deleted todo with ID: ${todoId}`, "info");
    return res.status(200).json({ success: true, message: "Todo deleted successfully" });
  } catch (err) {
    _log(`Unexpected error in DELETE /todos/:id route: ${err.message}`, "error");
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => _log(`Started server on port ${PORT}`));
