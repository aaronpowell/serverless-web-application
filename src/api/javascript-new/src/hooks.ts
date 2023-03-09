import { CosmosClient } from "@azure/cosmos";
import { registerHook } from "@azure/functions-core";
import { cosmosSettings } from "./cosmosBindings";

registerHook("preInvocation", async (context) => {
  const client = new CosmosClient(
    process.env[cosmosSettings.connectionStringSetting]
  );
  const { database } = await client.databases.createIfNotExists({
    id: cosmosSettings.databaseName,
  });
  const { container } = await database.containers.createIfNotExists({
    id: cosmosSettings.collectionName,
    partitionKey: { paths: ["/id"] },
  });

  const ctx = context.invocationContext as any;
  ctx.extraInputs.set("cosmosContainer", container);
});
