import { Container } from "@azure/cosmos";
import { app } from "@azure/functions";
import { TodoItem } from "./types";
import { idGenerator } from "./idGenerator";
import {
  baseCosmosInputBinding,
  baseCosmosOutputBinding,
} from "./cosmosBindings";
import "./hooks";

app.get("get-todos", {
  route: "todos",
  handler: (req, context) => {
    const items = context.extraInputs.get("todoItems");
    return {
      jsonBody: items,
    };
  },
  extraInputs: [
    {
      ...baseCosmosInputBinding,
      name: "todoItems",
      sqlQuery: "SELECT c.id, c.owner, c.description, c.status FROM c",
    },
  ],
});

app.get("get-todo", {
  route: "todos/{id}",
  handler: (req, context) => {
    const id = req.params.id;
    context.log(`Getting todo ${id}`);

    const todo = context.extraInputs.get("todo");
    if (!todo) {
      return {
        status: 404,
        body: "No matching todo",
      };
    }
    return {
      jsonBody: todo,
    };
  },
  extraInputs: [
    {
      ...baseCosmosInputBinding,
      name: "todo",
      id: "{id}",
      partitionKey: "{id}",
    },
  ],
});

app.post("post-todo", {
  route: "todos",
  handler: async (req, context) => {
    const { owner, description } = (await req.json()) as {
      owner: string;
      description: string;
    };
    const id = idGenerator();
    const todo = { id, owner, description, status: false };
    context.extraOutputs.set("todo", [todo]);

    return {
      jsonBody: todo,
    };
  },
  extraOutputs: [
    {
      ...baseCosmosOutputBinding,
      name: "todo",
    },
  ],
});

app.put("put-todo", {
  route: "todos/{id}",
  handler: async (req, context) => {
    const todo = context.extraInputs.get("todo") as TodoItem;

    if (!todo) {
      return {
        status: 404,
        body: `No item with ${req.params.id}`,
      };
    }

    const container = context.extraInputs.get("cosmosContainer") as Container;

    const { description, owner, status } = (await req.json()) as any;

    if (description !== undefined) {
      todo.description = description;
    }

    if (owner !== undefined) {
      todo.owner = owner;
    }

    if (status !== undefined) {
      todo.status = status;
    }

    const res = await container.items.upsert(todo);

    if (res.statusCode !== 200) {
      return {
        status: res.statusCode,
        body: "Failed up update item",
      };
    }

    return {
      status: 200,
      jsonBody: {
        id: todo.id,
        description: todo.description,
        owner: todo.owner,
        status: todo.status,
      },
      headers: {
        "content-type": "application/json",
      },
    };
  },
  extraInputs: [
    {
      ...baseCosmosInputBinding,
      name: "todo",
      id: "{id}",
      partitionKey: "{id}",
    },
  ],
});

app.deleteRequest("delete-todo", {
  route: "todos/{id}",
  handler: async (req, context) => {
    const container = context.extraInputs.get("cosmosContainer") as Container;
    const id = req.params.id;

    const res = await container.item(id, id).delete();

    if (res.statusCode !== 204) {
      return {
        status: res.statusCode,
        body: "Error deleting todo item",
      };
    }

    return {
      status: 204,
    };
  },
});

app.http("healthcheck", {
  route: "todos",
  methods: ["HEAD"],
  handler: () => ({ status: 200 }),
});
