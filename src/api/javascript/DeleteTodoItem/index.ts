import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const id = req.params.id;
  context.log(`Deleting todo item ${id}`);

  const client = new CosmosClient(process.env.CosmosConnectionString);
  const { database } = await client.databases.createIfNotExists({
    id: "TodoList",
  });
  const { container } = await database.containers.createIfNotExists({
    id: "Items",
    partitionKey: { paths: ["/id"] },
  });

  const res = await container.item(id, id).delete();

  if (res.statusCode !== 204) {
    context.res = {
      status: res.statusCode,
      body: "Error deleting todo item",
    };
    return;
  }

  context.res = {
    status: 204 /* Defaults to 200 */,
  };
};

export default httpTrigger;
