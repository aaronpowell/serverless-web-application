import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TodoItem } from "../types";
import { CosmosClient } from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  todo: TodoItem
): Promise<void> {
  if (!todo) {
    context.res = {
      status: 404,
      body: `No item with ${req.params.id}`,
    };
    return;
  }

  const { description, owner, status } = req.body;

  if (description !== undefined) {
    todo.description = description;
  }

  if (owner !== undefined) {
    todo.owner = owner;
  }

  if (status !== undefined) {
    todo.status = status;
  }

  const client = new CosmosClient(process.env.CosmosConnectionString);
  const { database } = await client.databases.createIfNotExists({
    id: "TodoList",
  });
  const { container } = await database.containers.createIfNotExists({
    id: "Items",
    partitionKey: { paths: ["/id"] },
  });

  const res = await container.items.upsert(todo);

  if (res.statusCode !== 200) {
    context.res = {
      status: res.statusCode,
      body: "Failed up update item",
    };
    return;
  }

  context.res = {
    status: 200,
    body: {
      id: todo.id,
      description: todo.description,
      owner: todo.owner,
      status: todo.status,
    },
    headers: {
      "content-type": "application/json",
    },
  };
};

export default httpTrigger;
