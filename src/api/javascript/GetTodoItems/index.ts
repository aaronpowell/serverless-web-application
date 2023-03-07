import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TodoItem } from "../types";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  todoItems: TodoItem[]
): Promise<void> {
  context.log("GetTodoItems function processed a request.");

  context.res = {
    body: todoItems,
    headers: {
      "content-type": "application/json",
    },
  };
};

export default httpTrigger;
