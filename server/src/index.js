function appendTodoElementToList(todoLI, todoList) {
  const now = new Date();
  try {
    todoList.appendChild(todoLI);
    console.log(`${now} [LOG] Successfully appended todo item: ${todoLI}`);
    return [true, null];
  } catch (error) {
    console.error(`${now} [ERROR] Failed to create todo item: ${error}`);
    return [false, error];
  }
}

function createTodoElement(todoContent) {
  const now = new Date();
  try {
    const newTodoLI = document.createElement("li");
    const newTodoBtn = document.createElement("button");

    newTodoBtn.className = "hover:line-through cursor-pointer text-base";
    newTodoBtn.innerText = todoContent;

    newTodoLI.appendChild(newTodoBtn);

    console.log(`${now} [LOG] Successfully created todo item: ${todoContent}`);

    return [newTodoLI, null];
  } catch (error) {
    console.error(`${now} [ERROR] Failed to create todo item: ${error}`);
    return [null, error];
  }
}

function main() {
  const myTodos = document.querySelector("#myTodos");
  const addTodoBtn = document.querySelector("#addTodoBtn");
}
main();
