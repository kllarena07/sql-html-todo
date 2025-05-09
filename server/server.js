import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { _log, getAllTodos } from "./utils/utils.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "src")));

app.get("/todos", async (req, res) => {
  try {
    const [todos, error] = await getAllTodos(process.env.PATH_TO_DB);

    if (error) {
      _log(`Error retrieving todos: ${error}`, "error");
      return res.status(500).send("<p>Error loading todos</p>");
    }

    let todosHTML = "";
    if (todos && todos.length > 0) {
      todos.forEach((todo) => {
        todosHTML += `<li><button class="hover:line-through cursor-pointer text-base">${todo}</button></li>`;
      });
    } else {
      todosHTML = "<p>You have no todos, go ahead and make some!</p>";
    }

    res.send(todosHTML);
  } catch (err) {
    _log(`Unexpected error in /todos route: ${err.message}`, "error");
    res.status(500).send("<p>Server error</p>");
  }
});

app.listen(PORT, () => _log(`Started server on port ${PORT}`));
