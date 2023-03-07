import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TodoItem } from "../types";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  todoItem: TodoItem | null
): Promise<void> {
  context.log(`GetTodoItem function processed a request for ${req.params.id}.`);

  if (todoItem) {
    context.res = {
      body: {
        id: todoItem.id,
        description: todoItem.description,
        owner: todoItem.owner,
        status: todoItem.status,
      },
      headers: {
        "content-type": "application/json",
      },
    };
  } else {
    context.res = {
      status: 404,
      body: "Todo item not found",
    };
  }
};

export default httpTrigger;
