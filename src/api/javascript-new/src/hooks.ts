import { CosmosClient } from "@azure/cosmos";
import { registerHook } from "@azure/functions-core";

registerHook("preInvocation", async (context) => {
  const client = new CosmosClient(process.env.CosmosConnectionString);
  const { database } = await client.databases.createIfNotExists({
    id: "TodoList",
  });
  const { container } = await database.containers.createIfNotExists({
    id: "Items",
    partitionKey: { paths: ["/id"] },
  });

  const ctx = context.invocationContext as any;
  ctx.extraInputs.set("cosmosContainer", container);
});
